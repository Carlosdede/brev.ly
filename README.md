# Brev.ly — Encurtador de Links

<img width="1236" height="605" alt="Brevy" src="https://github.com/user-attachments/assets/c9b8b638-2bc0-4472-acbb-c4442553d219" />


Brev.ly é uma aplicação full stack para encurtamento e gerenciamento de links. O projeto permite cadastrar URLs originais, definir um identificador personalizado para o link curto, listar os links criados, copiar a URL encurtada, acompanhar a quantidade de acessos, remover links e exportar os registros em CSV.

O repositório está organizado como um monorepo, contendo uma API REST em Node.js com Fastify e um frontend em React com Vite. A aplicação também possui configuração com Docker, Docker Compose, PostgreSQL, migrations com Drizzle ORM e pipeline de CI com GitHub Actions.

## Descrição curta do repositório

Aplicação full stack de encurtamento de links com React, Vite, Fastify, PostgreSQL, Drizzle ORM, Docker e GitHub Actions, incluindo criação, listagem, redirecionamento, contagem de acessos e exportação CSV via Cloudflare R2.

## Funcionalidades

- Cadastro de links com URL original e slug personalizado.
- Validação dos dados de entrada no backend.
- Verificação de duplicidade para links encurtados.
- Listagem dos links cadastrados.
- Redirecionamento automático ao acessar uma URL encurtada.
- Incremento da contagem de acessos no redirecionamento.
- Cópia do link curto para a área de transferência.
- Exclusão de links cadastrados.
- Exportação dos links para arquivo CSV.
- Upload do CSV para Cloudflare R2, compatível com API S3.
- Página de erro para links inexistentes ou inválidos.
- Ambiente dockerizado para frontend, backend, banco de dados e migrations.
- Pipeline de CI para build da API, build do frontend e build das imagens Docker.

## Tecnologias utilizadas

### Frontend

- React
- Vite
- TypeScript
- CSS
- Nginx para servir a build em produção

### Backend

- Node.js
- TypeScript
- Fastify
- Zod
- Drizzle ORM
- PostgreSQL
- AWS SDK S3 Client, utilizado para integração com Cloudflare R2

### Infraestrutura e ferramentas

- Docker
- Docker Compose
- GitHub Actions
- Cloudflare R2
- PostgreSQL 16 Alpine

## Estrutura do projeto

```txt
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── Web/
│   ├── src/
│   │   ├── assets/
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
├── server/
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.ts
│   │   │   ├── migrate.ts
│   │   │   ├── migrations/
│   │   │   └── schema.ts
│   │   ├── routes/
│   │   │   ├── create-link.ts
│   │   │   ├── delete-link.ts
│   │   │   ├── export-csv.ts
│   │   │   ├── get-original-url.ts
│   │   │   ├── increment-access.ts
│   │   │   └── list-links.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## Pré-requisitos

Para rodar o projeto localmente, é necessário ter instalado:

- Node.js 20 ou superior
- npm
- Docker
- Docker Compose

A integração com Cloudflare R2 é necessária apenas para a funcionalidade de exportação CSV. O restante da aplicação pode ser utilizado localmente sem configurar o R2, desde que a rota de exportação não seja chamada.

## Variáveis de ambiente

### Backend

Crie um arquivo `.env` dentro da pasta `server` com base no arquivo `.env.example`:

```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5432/brevly

CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

Descrição das variáveis:

| Variável | Descrição |
|---|---|
| `PORT` | Porta em que a API será executada. |
| `DATABASE_URL` | String de conexão com o PostgreSQL. |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta Cloudflare utilizada no R2. |
| `CLOUDFLARE_ACCESS_KEY_ID` | Chave de acesso do bucket R2. |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | Chave secreta do bucket R2. |
| `CLOUDFLARE_BUCKET` | Nome do bucket onde o CSV será salvo. |
| `CLOUDFLARE_PUBLIC_URL` | URL pública utilizada para acessar o arquivo exportado. |

### Frontend

Crie um arquivo `.env` dentro da pasta `Web` com base no arquivo `.env.example`:

```env
VITE_API_URL=http://localhost:3333
VITE_SHORT_BASE_URL=http://localhost:5173
VITE_FRONT_URL=http://localhost:5173
```

Descrição das variáveis:

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API. |
| `VITE_SHORT_BASE_URL` | URL exibida na interface para representar o link encurtado. |
| `VITE_FRONT_URL` | URL usada para montar o link copiado e acessado pelo usuário. |

Em desenvolvimento local, normalmente `VITE_SHORT_BASE_URL` e `VITE_FRONT_URL` podem apontar para `http://localhost:5173`.

## Como rodar com Docker Compose

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Esse comando irá subir:

- PostgreSQL na porta `5432`.
- Container de migrations para preparar o banco.
- API na porta `3333`.
- Frontend na porta `5173`.

Após subir os containers, acesse:

```txt
http://localhost:5173
```

A API ficará disponível em:

```txt
http://localhost:3333
```

Para parar os containers:

```bash
docker compose down
```

Para parar os containers e remover o volume do banco de dados:

```bash
docker compose down -v
```

## Como rodar localmente sem Docker para a aplicação

Também é possível rodar o frontend e o backend diretamente pela máquina, utilizando Docker apenas para o PostgreSQL.

### 1. Subir o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d postgres
```

### 2. Configurar e rodar o backend

Entre na pasta do backend:

```bash
cd server
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Execute as migrations:

```bash
npm run db
```

Inicie a API em modo desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

```txt
http://localhost:3333
```

### 3. Configurar e rodar o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd Web
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Inicie o frontend:

```bash
npm run dev
```

A aplicação estará disponível em:

```txt
http://localhost:5173
```

## Scripts disponíveis

### Backend

Dentro da pasta `server`:

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia a API em modo desenvolvimento com watch. |
| `npm run build` | Compila o projeto TypeScript para JavaScript. |
| `npm run start` | Executa a versão compilada da API. |
| `npm run db` | Executa as migrations do Drizzle. |

### Frontend

Dentro da pasta `Web`:

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o frontend em modo desenvolvimento. |
| `npm run build` | Compila o TypeScript e gera a build de produção com Vite. |
| `npm run preview` | Executa uma prévia local da build gerada. |

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/links` | Cria um novo link encurtado. |
| `GET` | `/links` | Lista todos os links cadastrados. |
| `GET` | `/links/:shortUrl` | Busca a URL original com base no link encurtado. |
| `PATCH` | `/links/:id/access` | Incrementa a contagem de acessos de um link. |
| `DELETE` | `/links/:id` | Remove um link pelo ID. |
| `POST` | `/links/export` | Exporta os links cadastrados em CSV e envia para o Cloudflare R2. |

## Exemplos de uso da API

### Criar um link

```bash
curl -X POST http://localhost:3333/links \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://www.google.com",
    "shortUrl": "google"
  }'
```

Resposta esperada:

```json
{
  "link": {
    "id": "uuid-do-link",
    "originalUrl": "https://www.google.com",
    "shortUrl": "google",
    "accessCount": 0,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### Listar links

```bash
curl http://localhost:3333/links
```

### Buscar link pela URL encurtada

```bash
curl http://localhost:3333/links/google
```

### Incrementar acesso

```bash
curl -X PATCH http://localhost:3333/links/uuid-do-link/access
```

### Remover link

```bash
curl -X DELETE http://localhost:3333/links/uuid-do-link
```

### Exportar CSV

```bash
curl -X POST http://localhost:3333/links/export
```

Essa rota depende das variáveis da Cloudflare R2 configuradas corretamente no backend.

## Banco de dados

O projeto utiliza PostgreSQL com Drizzle ORM.

A tabela principal é `links`, contendo os seguintes campos:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `text` | Identificador único do link. |
| `original_url` | `text` | URL original informada pelo usuário. |
| `short_url` | `varchar(100)` | Identificador personalizado do link encurtado. |
| `access_count` | `integer` | Quantidade de acessos ao link. |
| `created_at` | `timestamp` | Data de criação do registro. |

## Docker

O projeto possui Dockerfile separado para backend e frontend.

### Backend

O backend utiliza uma imagem baseada em Node.js 20 Alpine, instala as dependências, compila o TypeScript e executa a API a partir da pasta `dist`.

### Frontend

O frontend utiliza Node.js para gerar a build de produção e Nginx para servir os arquivos estáticos.

### Docker Compose

O `docker-compose.yml` da raiz orquestra os seguintes serviços:

| Serviço | Descrição |
|---|---|
| `postgres` | Banco de dados PostgreSQL. |
| `migrations` | Executa as migrations antes da API subir. |
| `api` | Backend Fastify. |
| `web` | Frontend React servido com Nginx. |

## CI com GitHub Actions

O pipeline de CI é executado em pushes e pull requests para a branch `main`.

O workflow realiza as seguintes etapas:

### Backend

- Checkout do repositório.
- Instalação do Node.js 20.
- Instalação das dependências com `npm ci`.
- Build da API com `npm run build`.
- Build da imagem Docker do backend.

### Frontend

- Checkout do repositório.
- Instalação do Node.js 20.
- Instalação das dependências com `npm ci`.
- Build do frontend com `npm run build`.
- Build da imagem Docker do frontend.

## Observações importantes

- As credenciais reais da Cloudflare não devem ser versionadas no repositório.
- Use os arquivos `.env.example` apenas como referência de configuração.
- Para rodar localmente, mantenha as variáveis sensíveis apenas nos arquivos `.env` locais.
- A exportação CSV depende da configuração correta do Cloudflare R2.
- O frontend consome a API definida em `VITE_API_URL`.
- O redirecionamento dos links acontece pelo próprio frontend, utilizando o slug presente na URL.

## Licença

Este projeto foi desenvolvido para fins de estudo, prática e avaliação técnica.
