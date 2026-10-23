// Portal da AprendendoDev: lê os JSON gerados pela publicação automática.
// Todo texto vindo de cards e Issues entra com textContent (nunca innerHTML).

const SQUADS = ['Cardápio', 'Carrinho', 'Pagamento', 'Cozinha', 'Cliente'];
const REPO = 'https://github.com/aprendendodev/techburger';

async function lerJSON(caminho, padrao) {
  try {
    const resposta = await fetch(caminho, { cache: 'no-store' });
    if (!resposta.ok) return padrao;
    return await resposta.json();
  } catch (erro) {
    return padrao;
  }
}

function el(tag, texto, classe) {
  const e = document.createElement(tag);
  if (texto !== undefined && texto !== null) e.textContent = texto;
  if (classe) e.className = classe;
  return e;
}

function link(texto, url) {
  const a = el('a', texto);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

// ---------- página inicial
async function iniciarHome() {
  const sprint = await lerJSON('sprint.json', null);
  const caixa = document.getElementById('sprint');
  if (!sprint || !caixa) return;
  caixa.querySelector('.rotulo').textContent = sprint.nome + ' · ' + sprint.aula;
  caixa.querySelector('.objetivo').textContent = sprint.objetivo;
  caixa.querySelector('.proxima').textContent = 'Próxima: ' + sprint.proxima;
  document.querySelectorAll('[data-sprint]').forEach((linha) => {
    if (Number(linha.dataset.sprint) === sprint.numero) linha.classList.add('atual');
  });
}

// ---------- time
async function iniciarTime() {
  const time = await lerJSON('dados/time.json', []);
  const alvo = document.getElementById('time');
  document.getElementById('total').textContent = time.length + (time.length === 1 ? ' dev' : ' devs');
  for (const squad of SQUADS.concat(['Sem squad'])) {
    const devs = time.filter((d) => d.squad === squad);
    if (squad === 'Sem squad' && !devs.length) continue;
    alvo.appendChild(el('h2', 'Squad ' + squad + ' (' + devs.length + ')'));
    const grade = el('div', null, 'grade');
    if (!devs.length) grade.appendChild(el('p', 'Ninguém ainda: abra o seu pull request!', 'vazio'));
    for (const d of devs) {
      const c = el('div', null, 'cartao');
      c.appendChild(el('h3', d.nome));
      const sub = el('p', null, 'sub');
      sub.appendChild(link('@' + d.github, 'https://github.com/' + encodeURIComponent(d.github)));
      c.appendChild(sub);
      if (d.aprender) c.appendChild(el('p', 'Quer aprender: ' + d.aprender));
      if (d.curiosidade) c.appendChild(el('p', 'Curiosidade: ' + d.curiosidade));
      grade.appendChild(c);
    }
    alvo.appendChild(grade);
  }
}

// ---------- tarefas
function cartaoTarefa(t) {
  const c = el('div', null, 'cartao');
  const h = el('h3');
  h.appendChild(link('#' + t.numero + ' ' + t.titulo, t.url));
  c.appendChild(h);
  const sub = el('p', null, 'sub');
  sub.appendChild(el('span', t.aberta ? 'aberta' : 'concluída', 'etiqueta' + (t.aberta ? '' : ' fechada')));
  if (t.squad) sub.appendChild(el('span', t.squad, 'etiqueta'));
  if (t.sprint !== null) sub.appendChild(el('span', 'Sprint ' + t.sprint, 'etiqueta'));
  c.appendChild(sub);
  c.appendChild(el('p', t.responsaveis.length ? 'Com: ' + t.responsaveis.map((r) => '@' + r).join(', ') : 'Sem responsável', 'sub'));
  return c;
}

async function iniciarTarefas() {
  const dados = await lerJSON('dados/tarefas.json', { atualizado: null, tarefas: [] });
  const tarefas = dados.tarefas;
  if (dados.atualizado) {
    document.getElementById('atualizado').textContent = 'Atualizado em ' + new Date(dados.atualizado).toLocaleString('pt-BR');
  }
  const minhas = document.getElementById('minhas');
  const campo = document.getElementById('usuario');
  function buscar() {
    const u = campo.value.trim().replace(/^@/, '').toLowerCase();
    minhas.replaceChildren();
    if (!u) return;
    try { localStorage.setItem('usuario', u); } catch (e) { /* sem armazenamento: tudo bem */ }
    const lista = tarefas.filter((t) => t.responsaveis.some((r) => r.toLowerCase() === u));
    if (!lista.length) {
      minhas.appendChild(el('p', 'Nenhuma tarefa com @' + u + '. Na planning, peça um cartão ao PO.', 'vazio'));
      return;
    }
    const grade = el('div', null, 'grade');
    lista.sort((a, b) => b.aberta - a.aberta).forEach((t) => grade.appendChild(cartaoTarefa(t)));
    minhas.appendChild(grade);
  }
  document.getElementById('buscar').addEventListener('submit', (ev) => { ev.preventDefault(); buscar(); });
  try { campo.value = localStorage.getItem('usuario') || ''; } catch (e) { /* idem */ }
  buscar();

  const todas = document.getElementById('todas');
  const abertas = tarefas.filter((t) => t.aberta);
  for (const squad of SQUADS.concat([null])) {
    const lista = abertas.filter((t) => t.squad === squad);
    if (!lista.length) continue;
    todas.appendChild(el('h2', squad ? 'Squad ' + squad : 'Para todos'));
    const grade = el('div', null, 'grade');
    lista.forEach((t) => grade.appendChild(cartaoTarefa(t)));
    todas.appendChild(grade);
  }
  if (!abertas.length) todas.appendChild(el('p', 'Nenhuma tarefa aberta no momento.', 'vazio'));
}

const pagina = document.body.dataset.pagina;
if (pagina === 'home') iniciarHome();
if (pagina === 'time') iniciarTime();
if (pagina === 'tarefas') iniciarTarefas();
