// Monta o site publicado no GitHub Pages:
//   _site/            ← portal/ (o site da empresa)
//   _site/app/        ← src/ (o app TechBurger)
//   _site/dados/      ← time.json (cards de equipe/) e tarefas.json (Issues)
// Uso: node scripts/build-site.mjs   (GITHUB_TOKEN e GITHUB_REPOSITORY são opcionais)
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = path.join(RAIZ, '_site');
const SQUADS = ['Cardápio', 'Carrinho', 'Pagamento', 'Cozinha', 'Cliente'];

const semAcento = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

function squadDe(texto) {
  const t = semAcento(texto || '');
  return SQUADS.find((s) => t.includes(semAcento(s))) || null;
}

function lerCard(arquivo, md) {
  const linhas = md.split(/\r?\n/).map((l) => l.trim());
  const campo = (nome) => {
    const l = linhas.find((x) => semAcento(x).startsWith('- ' + semAcento(nome)));
    return l ? l.slice(l.indexOf(':') + 1).trim() : '';
  };
  const titulo = linhas.find((l) => l.startsWith('# '));
  const github = (campo('GitHub') || path.basename(arquivo, '.md')).replace(/^@/, '').replace(/[^A-Za-z0-9-]/g, '');
  return {
    arquivo,
    nome: (titulo ? titulo.slice(2).trim() : github).split(/\s+/)[0].slice(0, 40),
    github,
    squad: squadDe(campo('Squad')) || 'Sem squad',
    aprender: campo('Quero aprender').slice(0, 200),
    curiosidade: campo('Uma curiosidade').slice(0, 200),
  };
}

async function time() {
  const pasta = path.join(RAIZ, 'equipe');
  const arquivos = (await readdir(pasta)).filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md');
  const cards = [];
  for (const f of arquivos.sort()) {
    try {
      cards.push(lerCard(f, await readFile(path.join(pasta, f), 'utf8')));
    } catch (erro) {
      console.warn('card ignorado:', f, erro.message);
    }
  }
  return cards;
}

function secao(corpo, nome) {
  const m = new RegExp(String.raw`###\s*` + nome + String.raw`[^\n]*\n+([\s\S]*?)(?=\n###\s|$)`, 'i').exec(corpo || '');
  if (!m) return '';
  const t = m[1].trim();
  return t === '_No response_' ? '' : t.slice(0, 600);
}

async function api(caminho) {
  const token = process.env.GITHUB_TOKEN;
  const itens = [];
  for (let pagina = 1; pagina <= 10; pagina++) {
    const resp = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/${caminho}${caminho.includes('?') ? '&' : '?'}per_page=100&page=${pagina}`, {
      headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!resp.ok) {
      console.warn('falha na API do GitHub:', caminho, resp.status);
      break;
    }
    const lote = await resp.json();
    itens.push(...lote);
    if (lote.length < 100) break;
  }
  return itens;
}

async function tarefas() {
  if (!process.env.GITHUB_REPOSITORY) return { atualizado: null, tarefas: [] };
  // PRs abertos que citam uma Issue ("Closes #12", "Parte de #1") deixam a tarefa "Em revisão"
  const revisao = {};
  for (const pr of await api('pulls?state=open')) {
    for (const m of `${pr.title} ${pr.body || ''}`.matchAll(/(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?|parte de)\s+#(\d+)/gi)) {
      (revisao[m[1]] = revisao[m[1]] || []).push({ numero: pr.number, autor: pr.user.login, url: pr.html_url });
    }
  }
  const lista = [];
  for (const i of await api('issues?state=all')) {
    if (i.pull_request) continue;
    const etiquetas = i.labels.map((l) => (typeof l === 'string' ? l : l.name));
    const sprint = etiquetas.map((e) => /^sprint-(\d+)$/.exec(e)).find(Boolean);
    lista.push({
      numero: i.number,
      titulo: i.title,
      url: i.html_url,
      aberta: i.state === 'open',
      responsaveis: i.assignees.map((a) => a.login),
      squad: squadDe(etiquetas.find((e) => e.startsWith('squad-'))) || squadDe(secao(i.body, 'Squad')),
      sprint: sprint ? Number(sprint[1]) : null,
      etiquetas,
      historia: secao(i.body, 'História'),
      criterio: secao(i.body, 'Critério de aceite'),
      arquivo: secao(i.body, 'Arquivo'),
      prs: revisao[i.number] || [],
    });
  }
  return { atualizado: new Date().toISOString(), tarefas: lista };
}

await rm(SAIDA, { recursive: true, force: true });
await cp(path.join(RAIZ, 'portal'), SAIDA, { recursive: true });
await cp(path.join(RAIZ, 'src'), path.join(SAIDA, 'app'), { recursive: true });
await mkdir(path.join(SAIDA, 'dados'), { recursive: true });
const cards = await time();
const t = await tarefas();
await writeFile(path.join(SAIDA, 'dados', 'time.json'), JSON.stringify(cards, null, 2));
await writeFile(path.join(SAIDA, 'dados', 'tarefas.json'), JSON.stringify(t, null, 2));
await writeFile(path.join(SAIDA, '.nojekyll'), '');
console.log(`site montado em _site/: ${cards.length} cards, ${t.tarefas.length} tarefas`);
