# Dados do app (JSON)

Aqui ficam os dados de exemplo do app, um arquivo por squad, feitos na **Sprint 3 (Projeto)**. O JavaScript lê estes arquivos na Sprint 5, e os testes da Sprint 7 usam os mesmos exemplos.

| Arquivo | Squad |
|---------|-------|
| `cardapio.json` | Cardápio |
| `carrinho.json` | Carrinho |
| `pagamento.json` | Pagamento |
| `cozinha.json` | Cozinha |
| `cliente.json` | Cliente |

Os arquivos nascem do **diagrama de classes** do squad (`docs/projeto/<squad>/classes.drawio`): cada classe vira uma lista, cada exemplar vira um objeto e cada atributo vira um campo com o **mesmo nome**.

```json
{
  "produtos": [
    { "id": 3, "nome": "X-Burger", "categoriaId": 1, "preco": 22.5, "disponivel": true }
  ]
}
```

Regras:

- Um objeto por arquivo, com uma lista por classe.
- Nomes de campos iguais aos atributos do diagrama (camelCase, sem acento).
- Números sem aspas e com ponto decimal (`22.5`), nunca `"R$ 22,50"` (lembra da falha semântica da Aula 11?).
- Ligação entre classes pelo id (`"produtoId": 3`); data e hora como `"2026-11-06T19:32"`.
- Atributos derivados (`/total`, `/subtotal`) **não** entram: o app calcula.
- Nada de dado pessoal de verdade: nomes, telefones e e-mails fictícios.
- Antes do pull request, cole o arquivo num validador (ex.: https://jsonlint.com). Se o JSON estiver inválido, o robô avisa no PR.
