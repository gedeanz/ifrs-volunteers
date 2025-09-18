# IFRS Voluntariado API

API da P1 (Node.js + Express + MySQL + JWT + Swagger).

## Rodar
1) Copie `.env.example` para `.env` e ajuste as variáveis.
2) Crie o banco com `src/database/create_db.sql`.
3) `npm install`
4) `npm run dev` (ou `npm start`)
5) Docs: http://localhost:3000/api-docs

## Rotas principais
- `GET /events` (pública)
- `POST /auth/login` → retorna { token, user }
- `GET /dashboards` (autenticado)
- `GET /admin` (admin)

