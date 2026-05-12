# URL Shortener — Server

API REST para encurtamento de URLs, construída com Fastify, Drizzle ORM e PostgreSQL.

## Tecnologias

- **TypeScript**
- **Fastify** — framework HTTP
- **Drizzle ORM** — ORM para PostgreSQL
- **PostgreSQL** — banco de dados
- **Cloudflare R2 / AWS S3** — armazenamento de CSV

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/links` | Cria um novo link |
| `GET` | `/links` | Lista todos os links |
| `GET` | `/links/:shortUrl` | Busca URL original pela encurtada |
| `DELETE` | `/links/:id` | Remove um link |
| `PATCH` | `/links/:id/access` | Incrementa contagem de acessos |
| `POST` | `/links/export` | Gera e sobe CSV para CDN |

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Subir banco de dados
docker-compose up -d

# 4. Gerar e rodar migrations
npx drizzle-kit generate
npm run db

# 5. Iniciar em desenvolvimento
npm run dev
```
