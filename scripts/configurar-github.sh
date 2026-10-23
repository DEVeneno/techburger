#!/usr/bin/env bash
# Configuração inicial do repositório (rodar uma vez, pelo professor, com o gh logado).
# Uso: bash scripts/configurar-github.sh
set -euo pipefail
REPO="aprendendodev/techburger"

etiqueta() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force; }

etiqueta historia        1F497D "História de usuário"
etiqueta bug             C00000 "Algo não funciona como deveria"
etiqueta bloqueado       E46C0A "Travado: precisa de ajuda"
etiqueta fazendo        D4A72C "Alguém está fazendo (o robô coloca com /eu-pego)"
etiqueta squad-cardapio  F6C26B "Squad Cardápio"
etiqueta squad-carrinho  F6C26B "Squad Carrinho"
etiqueta squad-pagamento F6C26B "Squad Pagamento"
etiqueta squad-cozinha   F6C26B "Squad Cozinha"
etiqueta squad-cliente   F6C26B "Squad Cliente"
for n in 0 1 2 3 4 5 6 7 8; do etiqueta "sprint-$n" DAE8FC "Sprint $n"; done

gh issue create --repo "$REPO" --label sprint-0 \
  --title "Sprint 0: cada dev adiciona o seu card na pasta equipe" \
  --body "$(cat <<'EOF'
**Como** dev da AprendendoDev, **quero** ter o meu card na pasta \`equipe/\`, **para** aparecer na página Time do portal.

**Critério de aceite:** Dado o arquivo \`equipe/seu-usuario.md\` no formato do \`_modelo.md\`, Quando o pull request recebe o merge, Então o card aparece em aprendendodev.com.br/time.html.

Esta Issue é de **todos**: no seu pull request, escreva **Parte de #1** (e não "Closes #1").

Passo a passo: https://aprendendodev.com.br/guias.html#primeiro-pr
EOF
)"
echo "Pronto: etiquetas e Issue #1 criadas."
