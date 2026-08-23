# Guia passo a passo — Sessão Contínua no ar de verdade

Este guia parte do zero: você só tem o arquivo `sessao-continua.zip` baixado
no computador. No final, seu app estará publicado na internet, com endereço
próprio, banco de dados real (Supabase) e dados que não se perdem.

Vamos usar 3 serviços gratuitos:
- **Supabase** → o banco de dados (onde ficam suas contas e filmes salvos)
- **GitHub** → onde o código do projeto fica guardado/versionado
- **Vercel** → onde o site realmente "roda" e fica acessível por uma URL

Siga na ordem. Não pule etapas.

---

## Parte 0 — Preparar o computador

### 0.1. Instalar o Node.js (se ainda não tiver)
1. Acesse https://nodejs.org
2. Baixe a versão **LTS** (a recomendada, botão da esquerda)
3. Instale normalmente (Avançar, Avançar, Concluir)
4. Para confirmar que funcionou, abra o **Terminal** (Mac/Linux) ou
   **Prompt de Comando/PowerShell** (Windows) e digite:
   ```bash
   node -v
   ```
   Deve aparecer algo como `v20.x.x`. Se aparecer isso, está certo.

### 0.2. Instalar o Git (se ainda não tiver)
1. Acesse https://git-scm.com/downloads
2. Baixe e instale para o seu sistema (pode aceitar todas as opções padrão)
3. Confirme digitando no terminal:
   ```bash
   git --version
   ```

### 0.3. Extrair o zip
1. Encontre o arquivo `sessao-continua.zip` que você baixou
2. Clique com o botão direito nele → **Extrair tudo** (Windows) ou dê
   dois cliques (Mac) → escolha uma pasta fácil de achar, por exemplo
   `Documentos/sessao-continua`
3. Dentro dela deve existir uma pasta chamada `movie-hub` — é o projeto

### 0.4. Abrir o terminal dentro da pasta do projeto
- **Windows**: abra a pasta `movie-hub` no Explorador de Arquivos, clique na
  barra de endereço, digite `cmd` e aperte Enter — isso abre o terminal já
  dentro da pasta certa
- **Mac**: clique com botão direito na pasta `movie-hub` → **Novos Termos
  do Finder** → ou abra o Terminal e digite `cd ` (com espaço) e arraste a
  pasta `movie-hub` para dentro da janela do terminal, depois Enter

A partir de agora, todo comando que eu disser "rode" deve ser digitado
nesse mesmo terminal.

### 0.5. Instalar as dependências do projeto
```bash
npm install
```
Isso vai baixar tudo que o projeto precisa para funcionar. Pode demorar
1–2 minutos. Ao final, aparecem várias linhas — é normal.

---

## Parte 1 — Criar o banco de dados no Supabase

### 1.1. Criar a conta
1. Acesse https://supabase.com
2. Clique em **Start your project** (ou "Sign in")
3. Crie a conta com GitHub ou e-mail (o mais simples é "Continue with GitHub",
   mas se ainda não tem GitHub, veja a Parte 3 primeiro e volte aqui depois)

### 1.2. Criar o projeto
1. Clique em **New project**
2. Escolha uma organização (se for a primeira vez, o Supabase cria uma para
   você automaticamente — pode manter o nome sugerido)
3. Preencha:
   - **Name**: `sessao-continua` (ou o nome que preferir)
   - **Database Password**: clique em **"Generate a password"** e depois
     copie e **guarde essa senha em algum lugar seguro** (um bloco de notas,
     por exemplo) — você vai precisar dela em poucos minutos
   - **Region**: escolha a mais próxima de você, ex: **South America (São
     Paulo)**
4. Clique em **Create new project**
5. Aguarde 1–2 minutos enquanto o Supabase prepara o banco (uma barra de
   progresso aparece)

### 1.3. Pegar as duas "connection strings" (endereços de conexão)
1. Com o projeto já criado e aberto, vá no ícone de engrenagem **Project
   Settings** (barra lateral esquerda, embaixo)
2. Clique em **Database**
3. Role até a seção **Connection string**
4. Você vai ver abas: clique na aba **URI**
5. Tem uma opção "Connection pooling" — precisamos de **duas** strings:

   **a) String com pooling (porta 6543)** — marque a opção **"Use
   connection pooling"** se aparecer, ou procure a que tem `pooler` no
   endereço e termina com `:6543/postgres`. Copie essa string inteira.

   **b) String direta (porta 5432)** — desmarque "connection pooling" (ou
   procure a versão sem pooler, terminando em `:5432/postgres`). Copie essa
   também.

   Ambas vêm com `[YOUR-PASSWORD]` escrito nelas — você vai trocar isso pela
   senha que copiou no passo 1.2.

> 💡 Se a tela do Supabase estiver com nomes um pouco diferentes (a
> plataforma muda o texto de vez em quando), procure por "Connection
> string", "Connection pooling" ou "Transaction pooler" — é sempre nessa
> mesma tela de **Database**, dentro de **Project Settings**.

### 1.4. Configurar o arquivo `.env` do projeto
1. Dentro da pasta `movie-hub`, copie o arquivo `.env.example` e renomeie a
   cópia para `.env` (exatamente esse nome, com o ponto na frente)
   - Windows: pode copiar/colar o arquivo e renomear pelo Explorador
   - Ou, no terminal:
     ```bash
     cp .env.example .env
     ```
2. Abra o arquivo `.env` em um editor de texto simples (Bloco de Notas, ou
   o Notepad++, ou o VS Code se tiver)
3. Preencha assim:

   ```env
   DATABASE_URL="cole aqui a string COM pooling (porta 6543), trocando [YOUR-PASSWORD] pela sua senha"
   DIRECT_URL="cole aqui a string SEM pooling (porta 5432), trocando [YOUR-PASSWORD] pela sua senha"

   NEXTAUTH_SECRET="cole aqui um valor aleatório (veja abaixo como gerar)"
   NEXTAUTH_URL="http://localhost:3000"

   TMDB_API_KEY="cole aqui sua chave do TMDB (veja Parte 2)"
   ```

4. Para gerar o `NEXTAUTH_SECRET`, rode no terminal:
   ```bash
   openssl rand -base64 32
   ```
   Copie o texto que aparecer e cole no lugar de `"cole aqui..."`.
   (Se seu terminal não reconhecer `openssl`, pode usar qualquer gerador de
   senha forte online, ou usar essa frase aleatória mesmo, só trocando
   algumas letras — o importante é ser longo e não previsível.)

5. Salve o arquivo.

### 1.5. Criar as tabelas no banco
Ainda no terminal, dentro da pasta `movie-hub`:
```bash
npx prisma db push
```
Isso lê o arquivo `prisma/schema.prisma` do projeto e cria as tabelas
(`User` e `Title`) dentro do seu banco no Supabase. Se aparecer "Your
database is now in sync with your schema", deu certo.

> Se der erro de conexão aqui, o motivo quase sempre é a senha errada ou
> mal colada no `.env` — volte no passo 1.4 e confira com calma.

---

## Parte 2 — Pegar a API key gratuita do TMDB

1. Crie uma conta em https://www.themoviedb.org/signup
2. Confirme seu e-mail (o TMDB manda um link de confirmação)
3. Acesse https://www.themoviedb.org/settings/api
4. Clique em **"Create"** (ou "Solicitar uma API Key")
5. Escolha o tipo **"Developer"**
6. Preencha o formulário curto que aparece — em "finalidade de uso" pode
   descrever como "aplicativo pessoal para registrar filmes assistidos"
7. Ao final, copie o valor de **"API Key (v3 auth)"**
8. Cole esse valor no seu `.env`, em `TMDB_API_KEY`

---

## Parte 3 — Testar localmente (antes de publicar)

Ainda no terminal, dentro de `movie-hub`:
```bash
npm run dev
```
Vai aparecer uma mensagem tipo "Local: http://localhost:3000". Abra esse
endereço no navegador. Crie sua conta de teste e adicione um filme para
confirmar que a capa, o streaming e a nota funcionam. Se funcionar aqui,
vai funcionar publicado também.

Para parar o servidor depois, volte ao terminal e aperte `Ctrl + C`.

---

## Parte 4 — Publicar o código no GitHub

### 4.1. Criar a conta no GitHub
1. Acesse https://github.com/signup e crie sua conta (se ainda não tiver)

### 4.2. Criar o repositório
1. Acesse https://github.com/new
2. **Repository name**: `sessao-continua`
3. Deixe como **Private** (privado) se preferir que ninguém mais veja o
   código, ou **Public** se não tiver problema
4. **Não marque** nenhuma das caixinhas de "Add a README", ".gitignore" ou
   "license" (o projeto já vem com esses arquivos)
5. Clique em **Create repository**
6. Na tela seguinte, o GitHub mostra um endereço parecido com
   `https://github.com/SEU-USUARIO/sessao-continua.git` — copie esse link

### 4.3. Enviar o código
De volta ao terminal, dentro da pasta `movie-hub`, rode um comando de cada
vez (o projeto já vem com o Git inicializado e o primeiro commit feito):

```bash
git branch -M main
git remote add origin COLE-AQUI-O-LINK-QUE-VOCE-COPIOU
git push -u origin main
```

Na primeira vez, o Git pode abrir uma janela pedindo para você logar na sua
conta do GitHub pelo navegador — é só autorizar.

Depois disso, atualize a página do seu repositório no GitHub: os arquivos
do projeto devem aparecer lá. 🎉 O `.env` com suas senhas **não** vai
aparecer — ele fica só no seu computador, de propósito.

---

## Parte 5 — Publicar de verdade com a Vercel

### 5.1. Criar a conta
1. Acesse https://vercel.com/signup
2. Escolha **Continue with GitHub** e autorize — assim a Vercel já enxerga
   seus repositórios

### 5.2. Importar o projeto
1. No painel da Vercel, clique em **Add New...** → **Project**
2. Encontre `sessao-continua` na lista e clique em **Import**

### 5.3. Configurar as variáveis de ambiente
Antes de clicar em Deploy, abra a seção **Environment Variables** e
adicione, uma de cada vez (nome à esquerda, valor à direita — os mesmos
valores que estão no seu `.env` local):

| Nome | Valor |
|---|---|
| `DATABASE_URL` | a string com pooling (porta 6543) do Supabase |
| `DIRECT_URL` | a string direta (porta 5432) do Supabase |
| `NEXTAUTH_SECRET` | o mesmo valor gerado antes |
| `NEXTAUTH_URL` | por enquanto deixe `https://sessao-continua.vercel.app` (ajustamos no passo 5.5) |
| `TMDB_API_KEY` | sua chave do TMDB |

### 5.4. Publicar
1. Clique em **Deploy**
2. Aguarde 1–3 minutos — a Vercel instala tudo e publica automaticamente
3. Ao final aparece "Congratulations!" com um botão para visitar o site

### 5.5. Ajustar a URL final
1. Copie a URL que a Vercel deu ao seu projeto (ex:
   `https://sessao-continua-abcxyz.vercel.app`)
2. Vá em **Settings → Environment Variables** do projeto na Vercel, edite
   `NEXTAUTH_URL` para ser exatamente essa URL (com `https://` na frente,
   sem barra no final)
3. Vá na aba **Deployments**, clique nos "..." do último deploy e escolha
   **Redeploy** para aplicar a variável atualizada

Pronto — acesse a URL, crie sua conta e comece a usar de qualquer
computador ou celular. 🎬

---

## O que fazer quando quiser mudar algo no código depois

1. Edite os arquivos localmente
2. No terminal, dentro de `movie-hub`:
   ```bash
   git add -A
   git commit -m "descreva o que você mudou"
   git push
   ```
3. A Vercel detecta o novo `push` no GitHub e publica a atualização
   automaticamente, em 1–2 minutos.

---

## Resolvendo problemas comuns

- **"Failed to connect" ao rodar `prisma db push`**: confira se copiou a
  senha certa (sem `[` `]` sobrando) nas duas variáveis do `.env`.
- **Tela em branco ou erro 500 na Vercel**: confira se todas as 5 variáveis
  de ambiente foram criadas lá, com os nomes exatamente iguais aos da
  tabela do passo 5.3.
- **Busca de filme não retorna nada**: confira se `TMDB_API_KEY` está
  correta e se sua conta no TMDB já confirmou o e-mail.
- **"E-mail ou senha incorretos" mesmo com a senha certa**: confira se
  `NEXTAUTH_URL` está com a URL certinha (sem barra `/` sobrando no final).
