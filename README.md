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
**SQLite** + **NextAuth** + **TailwindCSS**.

---

## 1. Rodando localmente

### Pré-requisitos
- Node.js 18 ou superior
- Uma API key gratuita do TMDB (passo a passo abaixo)

### Passo a passo

```bash
# 1. instale as dependências
npm install

# 2. copie o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o `.env` e preencha:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="gere-um-valor-abaixo"
NEXTAUTH_URL="http://localhost:3000"
TMDB_API_KEY="sua-chave-aqui"
```

Para gerar o `NEXTAUTH_SECRET`, rode no terminal:

```bash
openssl rand -base64 32
```

### Como conseguir a API key do TMDB (gratuita)

1. Crie uma conta em https://www.themoviedb.org/signup
2. Vá em **Configurações → API** (ou acesse diretamente
   https://www.themoviedb.org/settings/api)
3. Clique em **"Create"** / **"Solicitar uma API Key"**, escolha o tipo
   **"Developer"** e preencha o formulário (pode usar "uso pessoal" como
   finalidade)
4. Copie o valor de **"API Key (v3 auth)"** e cole no `.env` em `TMDB_API_KEY`

### Criar o banco e subir o app

```bash
# cria o arquivo dev.db com as tabelas do schema
npm run db:push

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

## 3. Deploy (colocar no ar de verdade)

Ponto de atenção importante sobre o banco: **SQLite é um arquivo em disco**.
Em plataformas *serverless* (como a Vercel), o sistema de arquivos é
temporário e o arquivo do banco seria apagado a cada novo deploy/instância —
ou seja, o app até funciona, mas você perderia os dados salvos com o tempo.

Duas opções boas:

### Opção A — manter SQLite, hospedar em um serviço com disco persistente
Plataformas como **Render**, **Railway** ou **Fly.io** oferecem disco
persistente de graça/baixo custo. Nelas o SQLite funciona normalmente:
1. Suba o repositório do GitHub na plataforma escolhida.
2. Configure um *volume*/disco persistente apontando para a pasta do projeto
   (ou para onde `DATABASE_URL` aponta).
3. Configure as variáveis de ambiente (`DATABASE_URL`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL` com a URL pública, `TMDB_API_KEY`).
4. Comando de build: `npm run build` · comando de start: `npm run start`.

### Opção B — deploy na Vercel trocando para Postgres
A Vercel é a forma mais simples de publicar um app Next.js, mas exige um
banco externo:
1. Crie um banco Postgres grátis (ex: [Neon](https://neon.tech) ou
   [Supabase](https://supabase.com)).
2. No `prisma/schema.prisma`, troque `provider = "sqlite"` por
   `provider = "postgresql"`.
3. Rode `npm run db:push` uma vez apontando `DATABASE_URL` para o Postgres,
   para criar as tabelas.
4. Importe o repositório na Vercel (https://vercel.com/new), configure as
   mesmas variáveis de ambiente do `.env` e publique.

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
