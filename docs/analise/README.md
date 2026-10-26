# Análise do TechBurger

Feita na **Sprint 2 (Análise)**, a partir dos requisitos da Sprint 1 (`docs/requisitos/`). Cada squad tem a sua pasta, e cada dev cuida de **um arquivo**.

| Arquivo | O que tem | Formato |
|---------|-----------|---------|
| `casos-de-uso.drawio` | Diagrama de casos de uso do módulo | Atores, casos de uso, fronteira, «include» e «extend» (Aula 4) |
| `caso-de-uso.md` | Descrição do caso de uso principal do módulo | Atores, pré-condição, fluxo principal, fluxos alternativos, pós-condição |
| `historias.md` | Histórias de usuário e o backlog do módulo | Como / quero / para + origem + MoSCoW + tamanho, em ordem |
| `criterios.md` | Critérios de aceite das histórias | Dado / Quando / Então (Aula 13) |

## Códigos dos IDs

| Item | Formato | Exemplo |
|------|---------|---------|
| Caso de uso | `UC-<squad>-NN` | UC-CAR-01 Finalizar Pedido |
| História | `HU-<squad>-NN` | HU-CAR-01 |
| Critério de aceite | `CA-<squad>-NN.N` (história + número) | CA-CAR-01.2 = 2º critério da HU-CAR-01 |

Códigos dos squads: `CAD`, `CAR`, `PAG`, `COZ`, `CLI` (os mesmos da Sprint 1).

## Como editar o diagrama (.drawio)

1. Na página da Sprint, clique em **Abrir no draw.io**: o ponto de partida do seu squad abre no navegador.
2. Desenhe. Para salvar: **Arquivo › Salvar como › Dispositivo**, com o nome `casos-de-uso.drawio`.
3. Clique em **Enviar** (ou abra a pasta do seu squad no GitHub e use **Add file › Upload files**), arraste o arquivo e clique em **Propose changes**. O arquivo novo substitui o ponto de partida.

Toda linha aponta para a origem: um RF ou uma RN da Sprint 1. Os IDs nunca mudam depois do merge: as classes (Sprint 3) e o código (Sprints 4 e 5) vão apontar para eles.
