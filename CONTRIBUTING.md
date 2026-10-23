# Como contribuir — as regras do time

Bem-vindo(a) à AprendendoDev! Aqui estão as regras que todo dev segue. Elas valem para todas as sprints.

## 1. O caminho de toda contribuição

```
Issue  →  fork  →  branch  →  commits  →  pull request  →  review  →  merge
```

1. **Issue** — todo trabalho começa num cartão do quadro. Se não está no quadro, não existe.
2. **Fork** — a sua cópia do repositório (`seu-usuario/techburger`). Faça uma vez só.
3. **Branch** — uma branch por tarefa, com nome que diz o que é: `carrinho-pedido-minimo`.
4. **Commits** — pequenos, com mensagem **verbo + o quê**: `Adiciona aviso de pedido mínimo`.
5. **Pull request** — preencha o modelo: qual Issue resolve (`Closes #12`) e qual diagrama segue.
6. **Review** — o Tech Lead do squad revisa primeiro; depois, o professor.
7. **Merge** — o professor junta ao `main`, a Issue fecha e o site é atualizado.

> **Uma tarefa = uma branch = um pull request.**

### Antes de abrir um PR com o seu fork desatualizado

Os colegas vão fazendo merge no `main` da empresa. Antes de começar uma tarefa nova, atualize o seu fork: na página do **seu** fork, clique em **Sync fork › Update branch**.

## 2. Mensagens de commit

| Boa | Ruim |
|-----|------|
| `Adiciona aviso de pedido mínimo` | `ajustes` |
| `Corrige soma do total com desconto PIX` | `aaa` |
| `Cria diagrama de atividades do carrinho` | `agora vai` |

## 3. Cada um mexe no que é seu

Para não haver **conflito** (duas mudanças na mesma linha do mesmo arquivo), cada squad tem os seus arquivos:

| Squad | Diagramas | Código |
|-------|-----------|--------|
| Cardápio | `docs/diagramas/cardapio/` | `src/js/cardapio.js`, `src/css/cardapio.css` |
| Carrinho | `docs/diagramas/carrinho/` | `src/js/carrinho.js`, `src/css/carrinho.css` |
| Pagamento | `docs/diagramas/pagamento/` | `src/js/pagamento.js`, `src/css/pagamento.css` |
| Cozinha | `docs/diagramas/cozinha/` | `src/js/cozinha.js`, `src/css/cozinha.css` |
| Cliente | `docs/diagramas/cliente/` | `src/js/cliente.js`, `src/css/cliente.css` |

Arquivos compartilhados (`src/index.html`, `src/css/geral.css`, `src/dados/`, `docs/requisitos.md`): **só a sua parte**, e combinando com os outros squads na Issue. Achou um erro no módulo de outro squad? **Abra uma Issue** para ele, não corrija por conta própria.

## 4. Definição de Pronto

Uma tarefa só está **pronta** quando:

- [ ] faz o que o **critério de aceite** pede — testado no navegador;
- [ ] segue o **diagrama** e os nomes do modelo (classes, telas, campos);
- [ ] tem **pull request ligado à Issue** e revisado por um colega;
- [ ] **não quebra** o que já funcionava nem mexe em arquivo de outro squad sem combinar;
- [ ] foi **aceita pelo PO** na Sprint Review.

## 5. Histórias de usuário

Toda Issue de tarefa é uma história com critério de aceite:

> **Como** cliente, **quero** ser avisado do pedido mínimo, **para** não perder tempo no pagamento.
>
> **Dado** um carrinho com R$ 12,00, **Quando** tento finalizar, **Então** o app impede e mostra "Faltam R$ 3,00 para o pedido mínimo".

Use o botão **New issue › História de usuário**: o formulário já pede tudo isso.

## 6. Convivência

- **Respeito:** a crítica é ao código, nunca à pessoa.
- **Pedido de mudança no review não é bronca:** é assim que as empresas garantem qualidade. Ajuste na mesma branch e o PR se atualiza sozinho.
- **Usou internet ou inteligência artificial?** Tudo bem, desde que você saiba explicar cada linha que entregou.
- **Travou 15 minutos?** Pesquise, pergunte ao squad, depois ao professor, e registre a dúvida na Issue.
- **Vai faltar?** Avise num comentário da Issue. A tarefa volta para o backlog e você pode entregar de casa até o início da sprint seguinte.

## 7. Privacidade

O repositório é **público**. Nunca coloque CPF, matrícula, telefone, endereço, sobrenome ou senha em nenhum arquivo, Issue ou comentário.
