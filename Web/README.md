# URL Shortener — Web

Frontend em React + Vite para o projeto **Encurtador de Links / brev.ly**.

## Rotas conectadas ao backend

Backend esperado rodando em `http://localhost:3333`:

- `POST /links` cria link
- `GET /links` lista links
- `GET /links/:shortUrl` busca link original
- `PATCH /links/:id/access` incrementa acessos no redirecionamento
- `DELETE /links/:id` remove link
- `POST /links/export` gera CSV

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do front-end com base no `.env.example`:

```env
VITE_API_URL=http://localhost:3333
VITE_SHORT_BASE_URL=https://brev.ly
VITE_FRONT_URL=http://localhost:5173