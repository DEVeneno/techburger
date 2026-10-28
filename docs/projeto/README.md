# Projeto do TechBurger

Feito na **Sprint 3 (Projeto)**, a partir da análise da Sprint 2 (`docs/analise/`). Cada squad tem a sua pasta, e cada dev cuida de **um arquivo**.

| Arquivo | O que tem | Formato |
|---------|-----------|---------|
| `classes.drawio` | Diagrama de classes do módulo | Classes, atributos, métodos, associações com cardinalidade (Aulas 5 e 6) |
| `persona.md` | Persona do usuário principal do módulo | Ator, contexto, objetivo, frustrações, frase, o que muda na tela (Aula 10) |
| `wireframes.drawio` | Wireframes das telas principais do módulo | Pelo menos 2 telas, baixa fidelidade (Aula 10) |
| [`../../src/dados/<squad>.json`](../../src/dados/) | Dados de exemplo do módulo | Uma lista por classe; campos com os nomes dos atributos (Aula 11) |

## Quem é dono de cada classe

Quando o seu módulo usa uma classe de outro squad, desenhe-a **em cinza e tracejada**, com o **mesmo nome** e só os atributos de que você precisa.

| Classe | Squad dono |
|--------|------------|
| Produto, Categoria | Cardápio |
| Carrinho, Pedido, ItemPedido | Carrinho |
| Pagamento | Pagamento |
| Etapas do pedido | Cozinha |
| Cliente | Cliente |

## Padrão de nomes

- Classe no singular, com inicial maiúscula: `Pedido`, `ItemPedido`.
- Atributo e método em camelCase, sem acento nem espaço: `precoUnitario`, `calcularTroco()`.
- Atributo calculado com `/` na frente no diagrama (`/total`) — e ele **não** vai para o JSON.
- Os nomes do diagrama são os nomes do JSON e, depois, do JavaScript. Ninguém inventa outro no meio do caminho.

## Como editar os diagramas (.drawio)

1. Na página da Sprint, clique em **Abrir no draw.io**: o ponto de partida do seu squad abre no navegador.
2. Desenhe. Para salvar: **Arquivo › Salvar como › Dispositivo**, com o nome exato (`classes.drawio` ou `wireframes.drawio`).
3. Clique em **Enviar**, arraste o arquivo e clique em **Propose changes**. O arquivo novo substitui o ponto de partida.
