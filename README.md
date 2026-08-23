# 🎟️ Sessão Contínua

Seu arquivo pessoal de filmes e séries assistidos: cadastro seguro, capa oficial
buscada automaticamente, streaming atual de onde assistir (Brasil) e nota
opcional para cada título.

- **Cadastro seguro**: senha com hash `bcrypt`, sessão via `next-auth` (JWT).
- **Capa oficial + sinopse**: busca em tempo real na base do [TMDB](https://www.themoviedb.org/).
- **Streaming atual**: ao abrir sua lista, o app consulta o TMDB de novo para
  mostrar em quais serviços (Netflix, Prime Video, etc.) o título está
  disponível no Brasil *agora* — não é uma foto congelada de quando você
  adicionou.
- **Nota opcional** (0 a 10) e comentário livre por título.

Stack: **Next.js 14** (App Router, front-end e back-end juntos) + **Prisma** +
**PostgreSQL (Supabase)** + **NextAuth** + **TailwindCSS**.

> 📌 Se você chegou aqui a partir do zip do projeto, o passo a passo
> completo e ilustrado (Supabase, GitHub e Vercel do zero) está no arquivo
> `GUIA-PASSO-A-PASSO.md` — este README é a versão resumida/técnica.

---

## 1. Rodando localmente

### Pré-requisitos
- Node.js 18 ou superior
- Uma conta gratuita no [Supabase](https://supabase.com) (banco de dados)
- Uma API key gratuita do [TMDB](https://www.themoviedb.org/)

### Passo a passo

```bash
# 1. instale as dependências
npm install

# 2. copie o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o `.env` e preencha `DATABASE_URL` e `DIRECT_URL` com as connection
strings do seu projeto Supabase (Project Settings → Database → Connection
string), `TMDB_API_KEY` com sua chave do TMDB, e gere o `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Criar as tabelas no banco e subir o app

```bash
# cria as tabelas do schema no Supabase
npx prisma db push

# roda em modo desenvolvimento
npm run dev
```

Acesse http://localhost:3000, crie sua conta e comece a marcar filmes e
séries como assistidos.

---

## 2. Publicando no GitHub

Este projeto já está pronto para ser versionado. Se você recebeu esta pasta
sem repositório Git ainda, rode:

```bash
git init
git add .
git commit -m "Sessão Contínua: primeiro commit"
```

Depois, crie um repositório vazio no GitHub (sem README/gitignore, para não
gerar conflito) em https://github.com/new e rode:

```bash
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/sessao-continua.git
git push -u origin main
```

> ⚠️ O `.env` está no `.gitignore` — suas chaves e segredo do NextAuth
> **nunca** vão parar no GitHub. Só o `.env.example` (sem valores reais) é
> versionado.

---

## 3. Deploy na Vercel (com Supabase)

1. Importe o repositório do GitHub em https://vercel.com/new
2. Em **Environment Variables**, adicione: `DATABASE_URL`, `DIRECT_URL`,
   `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (a URL pública que a Vercel vai te dar,
   ex: `https://sessao-continua.vercel.app`) e `TMDB_API_KEY`.
3. Clique em **Deploy**.

Como o banco já roda no Supabase (fora da Vercel), os dados persistem
normalmente entre deploys — sem o problema que existiria com SQLite em uma
plataforma serverless.

---

## Estrutura do projeto

```
app/
  api/          → rotas de back-end (auth, cadastro, busca, títulos)
  dashboard/    → página protegida com sua lista de assistidos
  login/, register/
  page.tsx      → landing page
components/     → SearchBox, TicketCard (o "ingresso" de cada título), Header
lib/
  auth.ts       → configuração do NextAuth
  prisma.ts     → cliente do Prisma
  tmdb.ts       → integração com a API do TMDB
prisma/
  schema.prisma → modelos User e Title
```

## Licença

MIT — use, modifique e publique à vontade.
