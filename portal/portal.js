// Portal da AprendendoDev: lê os JSON gerados pela publicação automática.
// Todo texto vindo de cards e Issues entra com textContent (nunca innerHTML).

const SQUADS = ['Cardápio', 'Carrinho', 'Pagamento', 'Cozinha', 'Cliente'];

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

function link(texto, url, classe) {
  const a = el('a', texto, classe);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

function lerUsuario() {
  try { return localStorage.getItem('usuario') || ''; } catch (e) { return ''; }
}

function guardarUsuario(u) {
  try { localStorage.setItem('usuario', u); } catch (e) { /* sem armazenamento: tudo bem */ }
}

// A sprint atual é a última cuja data já chegou (antes da primeira, mostra a primeira).
async function sprintAtual() {
  const sprints = await lerJSON('sprints.json', []);
  const hoje = new Date().toISOString().slice(0, 10);
  let atual = sprints[0] || null;
  for (const s of sprints) if (s.data <= hoje) atual = s;
  // prévia: tarefas.html?sprint=2 mostra outra sprint (útil para o PO conferir antes da aula)
  const pedida = new URLSearchParams(location.search).get('sprint');
  if (pedida !== null) atual = sprints.find((s) => String(s.numero) === pedida) || atual;
  const proxima = sprints.find((s) => atual && s.numero === atual.numero + 1) || null;
  return { atual, proxima, sprints };
}

function situacao(t) {
  if (!t.aberta) return { nome: 'Pronto', classe: 'pronto' };
  if (t.prs.length) return { nome: 'Em revisão', classe: 'revisao' };
  if (t.responsaveis.length) return { nome: 'Fazendo', classe: 'fazendo' };
  return { nome: 'Livre', classe: 'livre' };
}

// ---------- página inicial
async function iniciarHome() {
  const { atual, proxima } = await sprintAtual();
  const caixa = document.getElementById('sprint');
  if (!atual || !caixa) return;
  caixa.querySelector('.rotulo').textContent = atual.nome + ' · ' + atual.aula;
  caixa.querySelector('.objetivo').textContent = atual.objetivo;
  caixa.querySelector('.proxima').textContent = proxima ? 'Próxima: ' + proxima.nome + ' (' + proxima.aula + ')' : '';
  document.querySelectorAll('[data-sprint]').forEach((linha) => {
    if (Number(linha.dataset.sprint) === atual.numero) linha.classList.add('atual');
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

// ---------- sprint e tarefas
function cartaoTarefa(t, detalhado) {
  const s = situacao(t);
  const c = el('div', null, 'cartao tarefa ' + s.classe);
  const topo = el('p', null, 'sub');
  topo.appendChild(el('span', s.nome, 'etiqueta ' + s.classe));
  if (t.squad) topo.appendChild(el('span', t.squad, 'etiqueta'));
  c.appendChild(topo);
  const h = el('h3');
  h.appendChild(link('#' + t.numero + ' ' + t.titulo.replace(/^\[[^\]]+\]\s*/, ''), t.url));
  c.appendChild(h);
  if (detalhado && t.historia) c.appendChild(el('p', t.historia));
  if (detalhado && t.criterio) {
    const p = el('p', null, 'criterio');
    p.appendChild(el('strong', 'Critério de aceite: '));
    p.appendChild(document.createTextNode(t.criterio));
    c.appendChild(p);
  }
  if (t.arquivo) {
    const p = el('p', null, 'sub');
    p.appendChild(document.createTextNode('Arquivo: '));
    p.appendChild(el('code', t.arquivo));
    c.appendChild(p);
  }
  if (s.classe === 'livre') {
    c.appendChild(el('p', 'Para pegar: abra a Issue e comente /eu-pego', 'sub'));
    c.appendChild(link('Pegar esta tarefa', t.url, 'botao pequeno'));
  } else if (s.classe === 'fazendo') {
    c.appendChild(el('p', 'Com @' + t.responsaveis.join(', @'), 'sub'));
  } else if (s.classe === 'revisao') {
    const p = el('p', 'Pull request: ', 'sub');
    t.prs.forEach((pr, k) => {
      if (k) p.appendChild(document.createTextNode(', '));
      p.appendChild(link('#' + pr.numero + ' de @' + pr.autor, pr.url));
    });
    c.appendChild(p);
  } else if (t.responsaveis.length) {
    c.appendChild(el('p', 'Feito por @' + t.responsaveis.join(', @'), 'sub'));
  }
  return c;
}

async function iniciarTarefas() {
  const [{ atual }, dados, time] = await Promise.all([
    sprintAtual(),
    lerJSON('dados/tarefas.json', { atualizado: null, tarefas: [] }),
    lerJSON('dados/time.json', []),
  ]);
  const numero = atual ? atual.numero : null;
  if (atual) {
    document.getElementById('titulo-sprint').textContent = atual.nome;
    document.getElementById('aula-sprint').textContent = atual.aula;
    document.getElementById('objetivo-sprint').textContent = atual.objetivo;
  }
  if (dados.atualizado) {
    document.getElementById('atualizado').textContent = 'Atualizado em ' + new Date(dados.atualizado).toLocaleString('pt-BR') + ' (a página se atualiza sozinha depois de cada mudança nas Issues).';
  }
  const daSprint = dados.tarefas.filter((t) => t.sprint === numero);

  // placar da sprint
  const placar = document.getElementById('placar');
  for (const nome of ['Livre', 'Fazendo', 'Em revisão', 'Pronto']) {
    const n = daSprint.filter((t) => situacao(t).nome === nome).length;
    const caixa = el('div', null, 'placar-item');
    caixa.appendChild(el('strong', String(n)));
    caixa.appendChild(el('span', nome));
    placar.appendChild(caixa);
  }

  // minha tarefa
  const minhas = document.getElementById('minhas');
  const campo = document.getElementById('usuario');
  function buscar() {
    const u = campo.value.trim().replace(/^@/, '').toLowerCase();
    minhas.replaceChildren();
    guardarUsuario(u);
    if (!u) return;
    const eu = time.find((d) => d.github.toLowerCase() === u);
    if (eu) minhas.appendChild(el('p', 'Olá, ' + eu.nome + '! Você é do Squad ' + eu.squad + '.'));
    else minhas.appendChild(el('p', 'Ainda não achei o seu card. Termine o pull request da Sprint 0 (Issue #1) para o portal saber o seu squad.', 'vazio'));
    const comigo = dados.tarefas.filter((t) => t.aberta && t.responsaveis.some((r) => r.toLowerCase() === u));
    if (comigo.length) {
      const grade = el('div', null, 'grade larga');
      comigo.forEach((t) => grade.appendChild(cartaoTarefa(t, true)));
      minhas.appendChild(grade);
      return;
    }
    const livres = daSprint.filter((t) => situacao(t).classe === 'livre' && (!eu || t.squad === eu.squad));
    if (livres.length) {
      minhas.appendChild(el('p', 'Você está sem tarefa. Tarefas livres' + (eu ? ' do seu squad' : '') + ' nesta sprint:'));
      const grade = el('div', null, 'grade larga');
      livres.sort((x, y) => x.numero - y.numero).forEach((t) => grade.appendChild(cartaoTarefa(t, true)));
      minhas.appendChild(grade);
    } else {
      minhas.appendChild(el('p', 'Nenhuma tarefa livre' + (eu ? ' no seu squad' : '') + ' agora. Revise o pull request de um colega ou fale com o PO.', 'vazio'));
    }
  }
  document.getElementById('buscar').addEventListener('submit', (ev) => { ev.preventDefault(); buscar(); });
  campo.value = lerUsuario();
  buscar();

  // todas as tarefas da sprint, por squad
  const todas = document.getElementById('todas');
  for (const squad of SQUADS.concat([null])) {
    const lista = daSprint.filter((t) => t.squad === squad);
    if (!lista.length) continue;
    const devs = time.filter((d) => d.squad === squad).map((d) => '@' + d.github);
    todas.appendChild(el('h2', squad ? 'Squad ' + squad : 'Para todos'));
    if (squad && devs.length) todas.appendChild(el('p', devs.join('  ·  '), 'sub'));
    const grade = el('div', null, 'grade');
    lista.sort((a, b) => a.numero - b.numero).forEach((t) => grade.appendChild(cartaoTarefa(t, false)));
    todas.appendChild(grade);
  }
  if (!daSprint.length) todas.appendChild(el('p', 'As tarefas desta sprint aparecem aqui depois da Sprint Planning.', 'vazio'));
}

const pagina = document.body.dataset.pagina;
if (pagina === 'home') iniciarHome();
if (pagina === 'time') iniciarTime();
if (pagina === 'tarefas') iniciarTarefas();
