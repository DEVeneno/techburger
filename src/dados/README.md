# Dados do app (JSON)

Aqui ficam os dados do app em JSON — o mesmo formato da Aula 11. Os arquivos nascem do **diagrama de classes** da Sprint 3: cada classe vira um arquivo (ou uma lista dentro dele), e cada atributo vira um campo.

Exemplo do formato (não é o modelo final — quem decide os campos é o squad, a partir do diagrama):

```json
[
  { "id": 1, "nome": "X-Burger", "categoria": "Lanches", "preco": 22.5, "disponivel": true }
]
```

Regras:

- Nomes de campos iguais aos atributos do diagrama de classes.
- Valores em reais com ponto decimal (`22.5`), nunca em centavos sem combinar (lembra da falha semântica da Aula 11?).
- Arquivo compartilhado: cada squad mexe só nos seus arquivos e combina na Issue antes de mudar o de outro.
