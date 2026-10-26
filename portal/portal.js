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

function limparUsuario(texto) {
  return (texto || '').trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/.*$/, '').toLowerCase();
}

// ---------- copiar para a área de transferência (com aviso na tela)
function avisar(texto) {
  let caixa = document.getElementById('aviso-flutuante');
  if (!caixa) {
    caixa = el('div', null, 'aviso-flutuante');
    caixa.id = 'aviso-flutuante';
    caixa.setAttribute('role', 'status');
    document.body.appendChild(caixa);
  }
  caixa.textContent = texto;
  caixa.classList.add('visivel');
  clearTimeout(avisar.timer);
  avisar.timer = setTimeout(() => caixa.classList.remove('visivel'), 6000);
}

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (e) {
    const area = el('textarea');
    area.value = texto;
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    area.remove();
    return ok;
  }
}

function botaoCopiar(rotulo, texto, aviso) {
  const b = el('button', rotulo, 'botao pequeno secundario');
  b.type = 'button';
  b.addEventListener('click', async () => {
    const ok = await copiar(texto);
    avisar(ok ? aviso || 'Copiado: ' + texto : 'Não consegui copiar. Digite: ' + texto);
  });
  return b;
}

// Abre a Issue e já deixa "/eu-pego" copiado: o aluno só cola no comentário e envia.
function botaoPegar(t) {
  const a = link('Pegar esta tarefa', t.url, 'botao pequeno');
  a.addEventListener('click', () => {
    copiar('/eu-pego');
    avisar('/eu-pego copiado! Na Issue que abriu, clique na caixa de comentário, cole (Ctrl+V) e clique em Comment.');
  });
  return a;
}

// Caminhos de arquivo citados no campo "Arquivo" da Issue.
function arquivosDa(t) {
  return Array.from(new Set((t.arquivo || '').match(/[\w.\-/]+\.(?:md|drawio|html|css|js|json)\b/g) || []));
}

// Link para editar (texto) ou enviar (diagrama) direto no GitHub: o GitHub cria o fork sozinho.
function botoesArquivo(t) {
  const caixa = el('div', null, 'botoes');
  for (const arq of arquivosDa(t)) {
    if (arq.endsWith('.drawio')) {
      caixa.appendChild(link('Enviar ' + arq.split('/').pop(), REPO + '/upload/main/' + arq.split('/').slice(0, -1).join('/'), 'botao pequeno'));
    } else {
      caixa.appendChild(link('Editar ' + arq.split('/').pop(), REPO + '/edit/main/' + arq, 'botao pequeno'));
    }
  }
  return caixa;
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

// A Issue #1 (card da Sprint 0) é de todos: ninguém pega, cada um abre o seu PR.
function deTodos(t) {
  return !t.squad && (t.numero === 1 || t.etiquetas.includes('sprint-0'));
}

function situacao(t) {
  if (t.aberta && deTodos(t)) return { nome: 'Para todos', classe: 'livre' };
  if (!t.aberta) return { nome: 'Pronto', classe: 'pronto' };
  if (t.prs.length) return { nome: 'Em revisão', classe: 'revisao' };
  if (t.responsaveis.length) return { nome: 'Fazendo', classe: 'fazendo' };
  return { nome: 'Livre', classe: 'livre' };
}

function tituloCurto(t) {
  return t.titulo.replace(/^\[[^\]]+\]\s*/, '');
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
  const u = lerUsuario();
  const ola = document.getElementById('ola');
  if (u && ola) {
    ola.textContent = 'Olá, @' + u + '! ';
    ola.appendChild(link('Ver a minha tarefa', 'tarefas.html#minha'));
    ola.querySelector('a').removeAttribute('target');
    ola.hidden = false;
  }
}

// ---------- time
async function iniciarTime() {
  const [time, vagas] = await Promise.all([lerJSON('dados/time.json', []), lerJSON('squads.json', {})]);
  const alvo = document.getElementById('time');
  document.getElementById('total').textContent = time.length + (time.length === 1 ? ' dev' : ' devs');
  for (const squad of SQUADS.concat(['Sem squad'])) {
    const devs = time.filter((d) => d.squad === squad);
    if (squad === 'Sem squad' && !devs.length) continue;
    alvo.appendChild(el('h2', 'Squad ' + squad + (vagas[squad] ? ' (' + devs.length + ' de ' + vagas[squad] + ')' : ' (' + devs.length + ')')));
    if (vagas[squad] && devs.length > vagas[squad]) alvo.appendChild(el('p', 'Este squad passou do número de vagas: o professor vai acertar a divisão.', 'problemas'));
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

// ---------- começar: gerador do card da Sprint 0
async function iniciarComecar() {
  const form = document.getElementById('form-card');
  const previa = document.getElementById('previa-card');
  const problemas = document.getElementById('problemas-card');
  const acoes = document.getElementById('acoes-card');
  const campo = (id) => document.getElementById(id);
  campo('c-usuario').value = lerUsuario();
  // vagas por squad (squads.json) x cards que já entraram: squad cheio fica bloqueado
  const [vagas, time] = await Promise.all([lerJSON('squads.json', {}), lerJSON('dados/time.json', [])]);
  function ocupadas(squad, u) {
    return time.filter((d) => d.squad === squad && d.github.toLowerCase() !== u).length;
  }
  function marcarVagas() {
    const u = limparUsuario(campo('c-usuario').value);
    for (const op of campo('c-squad').options) {
      if (!op.value || !vagas[op.value]) continue;
      const n = ocupadas(op.value, u);
      const cheio = n >= vagas[op.value];
      op.textContent = op.value + (cheio ? ' (cheio)' : ' (' + (vagas[op.value] - n) + (vagas[op.value] - n === 1 ? ' vaga)' : ' vagas)'));
      op.disabled = cheio && campo('c-squad').value !== op.value;
    }
  }

  function montar() {
    const nome = campo('c-nome').value.trim().split(/\s+/)[0] || '';
    const u = limparUsuario(campo('c-usuario').value);
    const squad = campo('c-squad').value;
    const aprender = campo('c-aprender').value.trim().replace(/\s+/g, ' ');
    const curiosidade = campo('c-curiosidade').value.trim().replace(/\s+/g, ' ');
    const erros = [];
    if (!nome) erros.push('Escreva o seu primeiro nome.');
    if (campo('c-nome').value.trim().split(/\s+/).length > 1) erros.push('Só o primeiro nome: o repositório é público (usei "' + nome + '").');
    if (!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/.test(u)) erros.push('Escreva o seu usuário do GitHub (ex.: maria-silva), sem espaço.');
    if (!squad) erros.push('Escolha o seu squad (o professor diz qual é).');
    else if (vagas[squad] && ocupadas(squad, u) >= vagas[squad]) erros.push('O Squad ' + squad + ' já está cheio. Confira com o professor qual é o seu squad.');
    if (!aprender) erros.push('Conte o que quer aprender no projeto.');
    if (!curiosidade) erros.push('Conte uma curiosidade sobre você.');
    if (/\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\(?\d{2}\)?\s?9?\d{4}-?\d{4}/.test(aprender + ' ' + curiosidade)) erros.push('Parece que tem CPF ou telefone no texto. Tire: o repositório é público.');
    const texto = '# ' + (nome || 'Seu primeiro nome') + '\n\n' +
      '- GitHub: @' + (u || 'seu-usuario') + '\n' +
      '- Squad: ' + (squad || 'Cardápio, Carrinho, Pagamento, Cozinha ou Cliente') + '\n' +
      '- Quero aprender neste projeto: ' + (aprender || 'uma frase') + '\n' +
      '- Uma curiosidade sobre mim: ' + (curiosidade || 'uma frase') + '\n';
    return { u, texto, erros };
  }

  function desenhar() {
    marcarVagas();
    const { u, texto, erros } = montar();
    previa.textContent = texto;
    problemas.replaceChildren();
    // os avisos só aparecem depois que o aluno começa a preencher
    if (form.dataset.tocado) erros.forEach((e) => problemas.appendChild(el('li', e)));
    acoes.replaceChildren();
    if (erros.length) {
      acoes.appendChild(el('p', 'Preencha os campos acima para liberar o botão.', 'vazio'));
      return;
    }
    guardarUsuario(u);
    const url = REPO + '/new/main/equipe?filename=' + encodeURIComponent(u + '.md') + '&value=' + encodeURIComponent(texto);
    const abrir = link('Criar o meu card no GitHub', url, 'botao');
    abrir.addEventListener('click', () => {
      copiar(texto);
      avisar('Texto do card copiado também. Se a caixa do GitHub aparecer vazia, cole (Ctrl+V).');
    });
    acoes.appendChild(abrir);
    acoes.appendChild(botaoCopiar('Só copiar o texto', texto, 'Texto do card copiado.'));
    const nomeArq = el('p', null, 'sub');
    nomeArq.appendChild(document.createTextNode('Nome do arquivo: '));
    nomeArq.appendChild(el('code', 'equipe/' + u + '.md'));
    acoes.appendChild(nomeArq);
  }

  form.addEventListener('input', () => { form.dataset.tocado = '1'; desenhar(); });
  form.addEventListener('submit', (ev) => { ev.preventDefault(); desenhar(); });
  desenhar();
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
  h.appendChild(link('#' + t.numero + ' ' + tituloCurto(t), t.url));
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
  if (t.aberta && deTodos(t)) {
    c.appendChild(el('p', 'Não precisa pegar: cada dev abre o seu pull request.', 'sub'));
    const a = el('a', 'Criar o meu card', 'botao pequeno');
    a.href = 'comecar.html';
    c.appendChild(a);
  } else if (s.classe === 'livre') {
    c.appendChild(botaoPegar(t));
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

// Um passo da trilha: feito (verde), agora (laranja) ou depois (cinza).
function passo(lista, estado, titulo, texto) {
  const li = el('li', null, estado);
  li.appendChild(el('strong', titulo));
  if (texto) li.appendChild(el('p', texto));
  lista.appendChild(li);
  return li;
}

// A trilha do dev na sprint: card → pegar → fazer e enviar → revisão → pronto.
function desenharMinhas(u, contexto) {
  const { dados, time, daSprint, numero } = contexto;
  const minhas = document.getElementById('minhas');
  minhas.replaceChildren();
  if (!u) {
    minhas.appendChild(el('p', 'Digite o seu usuário do GitHub e clique em Ver: o portal mostra o seu próximo passo.', 'vazio'));
    return;
  }
  const eu = time.find((d) => d.github.toLowerCase() === u);
  const meu = (r) => r.toLowerCase() === u;
  const issue1 = dados.tarefas.find((t) => t.numero === 1);
  const prCard = issue1 ? issue1.prs.find((p) => meu(p.autor)) : null;
  const comigo = dados.tarefas.find((t) => t.aberta && t.sprint === numero && t.responsaveis.some(meu))
    || dados.tarefas.find((t) => t.aberta && t.numero !== 1 && t.responsaveis.some(meu));
  const feitas = daSprint.filter((t) => !t.aberta && t.responsaveis.some(meu));
  const meuPR = comigo ? comigo.prs.find((p) => meu(p.autor)) || comigo.prs[0] : null;

  minhas.appendChild(el('p', eu ? 'Olá, ' + eu.nome + '! Squad ' + eu.squad + '.' : 'Olá, @' + u + '!', 'ola'));
  const trilha = el('ol', null, 'trilha');
  minhas.appendChild(trilha);

  // 1. card
  if (eu) passo(trilha, 'feito', 'Card no time', 'O seu card está na página Time.');
  else if (prCard) {
    const li = passo(trilha, 'agora', 'Card no time: em revisão', 'O seu pull request do card está aberto. Assim que o professor fizer o merge, este passo fica verde. Enquanto isso, já pode pegar uma tarefa.');
    li.appendChild(link('Ver o meu pull request #' + prCard.numero, prCard.url, 'botao pequeno secundario'));
  } else {
    const li = passo(trilha, 'agora', 'Card no time', 'Ainda não achei o seu card. É o primeiro passo (Sprint 0) e leva 5 minutos.');
    const a = el('a', 'Criar o meu card', 'botao pequeno');
    a.href = 'comecar.html';
    li.appendChild(a);
  }

  // Sprint 0: a trilha é só o card
  if (numero === 0) {
    if (eu) passo(trilha, 'feito', 'Revisão e merge', null);
    else passo(trilha, prCard ? 'agora' : 'depois', 'Revisão e merge', prCard ? 'O robô confere o card e comenta no PR. Se o professor pedir mudança, edite o arquivo no seu fork, na mesma branch.' : 'Depois de abrir o pull request do card.');
    if (eu) {
      const li = passo(trilha, 'feito', 'Pronto para a Sprint 1!', 'Na próxima aula você pega a sua primeira tarefa aqui mesmo, nesta página.');
      const a = el('a', 'Ver o time', 'botao pequeno secundario');
      a.href = 'time.html';
      li.appendChild(a);
    } else passo(trilha, 'depois', 'Pronto para a Sprint 1', 'Quando o card entrar, você aparece na página Time.');
    return;
  }

  // 2. pegar
  if (comigo) passo(trilha, 'feito', 'Pegar uma tarefa', 'Você está com a #' + comigo.numero + ' · ' + tituloCurto(comigo) + '.');
  else if (feitas.length) passo(trilha, 'feito', 'Pegar uma tarefa', 'Você entregou a #' + feitas.map((t) => t.numero).join(', #') + ' nesta sprint.');
  else {
    const li = passo(trilha, 'agora', 'Pegar uma tarefa', null);
    const livres = daSprint.filter((t) => situacao(t).classe === 'livre' && (!eu || t.squad === eu.squad)).sort((x, y) => x.numero - y.numero);
    if (livres.length) {
      li.appendChild(el('p', 'Escolha uma tarefa livre' + (eu ? ' do seu squad' : '') + '. O botão abre a Issue e já copia o /eu-pego: é só colar no comentário e enviar. O robô responde em segundos.'));
      const grade = el('div', null, 'grade larga');
      livres.forEach((t) => grade.appendChild(cartaoTarefa(t, Boolean(eu))));
      li.appendChild(grade);
    } else {
      li.appendChild(el('p', 'Nenhuma tarefa livre' + (eu ? ' no seu squad' : '') + ' agora. Revise o pull request de um colega ou fale com o PO.', 'vazio'));
    }
  }

  // 3. fazer e enviar
  if (comigo && !meuPR) {
    const li = passo(trilha, 'agora', 'Fazer e enviar (pull request)', null);
    if (comigo.criterio) {
      const p = el('p', null, 'criterio');
      p.appendChild(el('strong', 'Critério de aceite: '));
      p.appendChild(document.createTextNode(comigo.criterio));
      li.appendChild(p);
    }
    const passos = el('ol', null, 'mini');
    passos.appendChild(el('li', 'Clique no botão abaixo. Se o GitHub pedir, clique em Fork this repository.'));
    passos.appendChild(el('li', 'Escreva no arquivo o que o critério de aceite pede.'));
    passos.appendChild(el('li', 'Clique em Commit changes..., escreva o que fez (ex.: Preenche a entrevista do cardápio) e clique em Propose changes.'));
    passos.appendChild(el('li', 'Clique em Create pull request. No campo Issue, escreva Closes #' + comigo.numero + ' (se esquecer, o robô coloca).'));
    li.appendChild(passos);
    const botoes = botoesArquivo(comigo);
    botoes.appendChild(botaoCopiar('Copiar Closes #' + comigo.numero, 'Closes #' + comigo.numero));
    botoes.appendChild(link('Ver a Issue', comigo.url, 'botao pequeno secundario'));
    li.appendChild(botoes);
  } else {
    passo(trilha, comigo || feitas.length ? 'feito' : 'depois', 'Fazer e enviar (pull request)', comigo || feitas.length ? null : 'Depois de pegar a tarefa, o botão para editar o arquivo aparece aqui.');
  }

  // 4. revisão
  if (meuPR) {
    const li = passo(trilha, 'agora', 'Revisão', 'Pull request aberto. Peça ao Tech Lead do squad para revisar. Se pedirem mudança, edite o mesmo arquivo no seu fork, na mesma branch: o PR se atualiza sozinho.');
    li.appendChild(link('Abrir o meu pull request #' + meuPR.numero, meuPR.url, 'botao pequeno'));
  } else {
    passo(trilha, feitas.length && !comigo ? 'feito' : 'depois', 'Revisão', null);
  }

  // 5. pronto
  if (feitas.length && !comigo) {
    const li = passo(trilha, 'feito', 'Pronto!', 'Merge feito: a sua entrega está no repositório da empresa. Agora ajude o squad revisando um pull request.');
    li.appendChild(link('Pull requests abertos', REPO + '/pulls', 'botao pequeno secundario'));
  } else {
    passo(trilha, 'depois', 'Pronto', 'Depois do merge, a Issue fecha sozinha.');
  }
}

function desenharSprint(contexto) {
  const { dados, time, daSprint, meuSquad } = contexto;
  if (dados.atualizado) {
    document.getElementById('atualizado').textContent = 'Atualizado às ' + new Date(dados.atualizado).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '. Esta página se atualiza sozinha a cada minuto.';
  }
  const placar = document.getElementById('placar');
  placar.replaceChildren();
  const issue1 = dados.tarefas.find((t) => t.numero === 1);
  const contagens = contexto.numero === 0
    ? [['Cards no time', 'pronto', time.length], ['Cards em revisão', 'revisao', issue1 ? issue1.prs.length : 0]]
    : [['Livre', 'livre'], ['Fazendo', 'fazendo'], ['Em revisão', 'revisao'], ['Pronto', 'pronto']].map(([nome, classe]) => [nome, classe, daSprint.filter((t) => situacao(t).nome === nome).length]);
  placar.classList.toggle('dois', contagens.length === 2);
  for (const [nome, classe, n] of contagens) {
    const caixa = el('div', null, 'placar-item ' + classe);
    caixa.appendChild(el('strong', String(n)));
    caixa.appendChild(el('span', nome));
    placar.appendChild(caixa);
  }
  const todas = document.getElementById('todas');
  todas.replaceChildren();
  // o squad de quem está usando aparece primeiro
  const ordem = meuSquad ? [meuSquad].concat(SQUADS.filter((s) => s !== meuSquad)) : SQUADS;
  for (const squad of ordem.concat([null])) {
    const lista = daSprint.filter((t) => t.squad === squad);
    if (!lista.length) continue;
    const devs = time.filter((d) => d.squad === squad).map((d) => '@' + d.github);
    todas.appendChild(el('h2', (squad ? 'Squad ' + squad : 'Para todos') + (squad && squad === meuSquad ? ' (o seu)' : '')));
    if (squad && devs.length) todas.appendChild(el('p', devs.join('  ·  '), 'sub'));
    const grade = el('div', null, 'grade');
    lista.sort((a, b) => a.numero - b.numero).forEach((t) => grade.appendChild(cartaoTarefa(t, false)));
    todas.appendChild(grade);
  }
  if (!daSprint.length) todas.appendChild(el('p', 'As tarefas desta sprint aparecem aqui depois da Sprint Planning.', 'vazio'));
}

async function iniciarTarefas() {
  const { atual } = await sprintAtual();
  const numero = atual ? atual.numero : null;
  if (atual) {
    document.getElementById('titulo-sprint').textContent = atual.nome;
    document.getElementById('aula-sprint').textContent = atual.aula;
    document.getElementById('objetivo-sprint').textContent = atual.objetivo;
  }
  const campo = document.getElementById('usuario');
  let contexto = null;
  let versao = null;

  function redesenhar() {
    const u = limparUsuario(campo.value);
    const eu = contexto.time.find((d) => d.github.toLowerCase() === u);
    contexto.meuSquad = eu ? eu.squad : null;
    desenharMinhas(u, contexto);
    desenharSprint(contexto);
  }

  async function carregar() {
    const [dados, time] = await Promise.all([
      lerJSON('dados/tarefas.json', { atualizado: null, tarefas: [] }),
      lerJSON('dados/time.json', []),
    ]);
    if (contexto && dados.atualizado === versao) return;
    versao = dados.atualizado;
    contexto = { dados, time, numero, daSprint: dados.tarefas.filter((t) => t.sprint === numero) };
    redesenhar();
  }

  document.getElementById('buscar').addEventListener('submit', (ev) => {
    ev.preventDefault();
    guardarUsuario(limparUsuario(campo.value));
    if (contexto) redesenhar();
  });
  campo.value = lerUsuario();
  await carregar();
  // o robô e a publicação levam 1 a 2 minutos: a página confere sozinha
  setInterval(() => { if (!document.hidden) carregar(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) carregar(); });
}

const pagina = document.body.dataset.pagina;
if (pagina === 'home') iniciarHome();
if (pagina === 'time') iniciarTime();
if (pagina === 'tarefas') iniciarTarefas();
if (pagina === 'comecar') iniciarComecar();
