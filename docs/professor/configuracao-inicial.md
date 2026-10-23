# Configuração inicial (professor)

Passo a passo para deixar o repositório, o quadro e o site prontos antes da Aula 13.

## 1. Organização e repositório

1. Crie a organização **aprendendodev** (plano Free) em github.com/organizations/plan.
2. Crie o repositório **público** `aprendendodev/techburger` e envie este conteúdo (`git push`).
3. Rode `bash scripts/configurar-github.sh` para criar as etiquetas e a Issue #1.

## 2. Proteger o main

Em **Settings › Rules › Rulesets › New branch ruleset**:

- Nome: `main protegido` · Enforcement: **Active** · Target: **Default branch**
- Marque **Require a pull request before merging** com **1 approval** e **Require review from Code Owners**
- Marque **Block force pushes**
- Em **Bypass list**, adicione **Organization admin** (para o professor conseguir corrigir algo direto, se precisar)

## 3. Publicação do site (GitHub Pages)

1. **Settings › Pages › Build and deployment › Source: GitHub Actions**. A publicação roda sozinha a cada merge no `main` (`.github/workflows/site.yml`).
2. **Custom domain:** `aprendendodev.com.br` › Save. Depois que o DNS propagar, marque **Enforce HTTPS**.
3. Recomendado: verifique o domínio na organização (**Org Settings › Pages › Add a domain**), para ninguém mais conseguir usá-lo no GitHub.

### DNS no registro.br (Editar zona)

| Tipo | Nome | Valor |
|------|------|-------|
| A | (vazio / @) | 185.199.108.153 |
| A | (vazio / @) | 185.199.109.153 |
| A | (vazio / @) | 185.199.110.153 |
| A | (vazio / @) | 185.199.111.153 |
| CNAME | www | aprendendodev.github.io |

A propagação pode levar algumas horas. Endereços finais: portal em `aprendendodev.com.br`, app em `aprendendodev.com.br/app`.

## 4. Quadro (GitHub Projects)

1. Na organização, **Projects › New project › Board**, nome `TechBurger — Quadro`, visibilidade **Public**.
2. Edite o campo **Status** com as opções: `Backlog`, `A fazer`, `Fazendo`, `Em revisão`, `Pronto`.
3. Em **Workflows**, ative **Auto-add to project** (filtro `repo:aprendendodev/techburger is:issue`), **Item closed → Pronto** e **Pull request linked to issue → Em revisão**.
4. Em **Settings** do projeto, vincule o repositório `techburger`.

## 5. Em cada sprint

1. Atualize `portal/sprint.json` (número, nome, objetivo, próxima) com um commit no `main`.
2. Crie as Issues da sprint com o formulário **História de usuário**, a etiqueta `sprint-N` e a do squad, e atribua o responsável na planning.
3. Na review, faça o merge dos PRs aceitos; o site se atualiza sozinho.
