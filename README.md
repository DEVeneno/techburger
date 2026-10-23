# TechBurger — app de pedidos

Projeto da **AprendendoDev**, a empresa de software da turma 103513 do curso Técnico em Desenvolvimento de Sistemas (SENAI), na disciplina Modelagem de Sistemas.

Vamos construir **do zero** o app de pedidos do TechBurger: primeiro modelar (regras de negócio, requisitos, histórias, diagramas UML, wireframes), depois programar em HTML, CSS e JavaScript, e por fim publicar.

- **Portal da empresa:** [aprendendodev.com.br](https://aprendendodev.com.br) — sprint atual, time, "minha tarefa" e guias passo a passo
- **O app publicado:** [aprendendodev.com.br/app](https://aprendendodev.com.br/app)
- **Quadro de tarefas:** aba **Projects** desta organização
- **Como contribuir:** leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes do seu primeiro pull request

## O cliente

O TechBurger é uma hamburgueria. A gerente, Fernanda, quer um app para os clientes pedirem pelo celular. O app precisa respeitar as 8 regras de negócio do TechBurger:

| # | Regra | Squad |
|---|-------|-------|
| 1 | Pedido pelo app só a partir de R$ 15,00 | Carrinho |
| 2 | Fidelidade: 1 ponto a cada R$ 10,00; 100 pontos = combo grátis | Cliente |
| 3 | O pedido só vai para a cozinha com o pagamento confirmado | Pagamento e Cozinha |
| 4 | 5% de desconto no PIX pelo app | Pagamento |
| 5 | Entrega só até 5 km; fora disso, retirada no balcão | Cliente |
| 6 | Item em falta: o sistema sugere um substituto | Cardápio |
| 7 | Pedido com mais de 10 itens exige confirmação de um gerente | Carrinho |
| 8 | 3 ou mais cancelamentos no mês: bloqueio no app por 15 dias | Cliente |

## O time

- **Product Owner e Scrum Master:** o professor
- **Devs:** 19 pessoas em 5 squads — Cardápio, Carrinho, Pagamento, Cozinha e Cliente. Os cards de cada um ficam na pasta [`equipe/`](equipe/)
- **Tech Lead:** um dev de cada squad, em rodízio a cada sprint

## O roadmap

| Aula | Sprint | Entregas |
|------|--------|----------|
| 13 · 27/10 | Kickoff (Sprint 0) | Conta no GitHub e o card de cada dev |
| 14 · 30/10 | 1 · Descoberta | Canvas, entrevista com a cliente, regras de negócio, RF e RNF |
| 15 · 05/11 | 2 · Análise | Histórias com critério de aceite, casos de uso, backlog ordenado |
| 16 · 06/11 | 3 · Projeto | Classes e cardinalidade, dados em JSON, persona e wireframes |
| 17 · 12/11 | 4 · Fluxos e telas | Atividades e sequência; telas em HTML e CSS |
| 18 · 13/11 | 5 · Funcionalidades | As regras de negócio em JavaScript |
| 19 · 17/11 | 6 · Integração | Pagamento simulado, cozinha, status e dados |
| 20 · 19/11 | 7 · Qualidade | Testes dos critérios de aceite, UX, acessibilidade, correções |
| 21 · 27/11 | 8 · Release 1.0 | App no ar, demonstração e retrospectiva final |

## As pastas

| Pasta | O que tem |
|-------|-----------|
| [`docs/`](docs/) | A modelagem: requisitos e diagramas (`.drawio`) |
| [`equipe/`](equipe/) | Um card por dev (`seu-usuario.md`) |
| [`src/`](src/) | O código do app: HTML, CSS, JavaScript e dados em JSON |
| [`portal/`](portal/) | O site da empresa (mantido pelo professor) |
| `.github/` | Modelos de Issue e de pull request e a publicação automática do site |

## Como ver o app no seu computador

Não precisa instalar nada: baixe o repositório (botão **Code › Download ZIP**) e abra `src/index.html` no navegador. Ou abra direto no navegador, sem baixar: aperte a tecla `.` nesta página para abrir o editor **github.dev**.

## Privacidade

Este repositório é **público**. Nada de CPF, matrícula, telefone, endereço ou sobrenome nos arquivos.
