# IFRS Volunteers (Repositório Único)

Monorepo da Prova P1 com **API (Node/Express/MySQL/JWT/Swagger)** e **Web (React/Vite/Router/Axios)**

## Estrutura

```
.
├─ api/   # Back-end (Express + MySQL + JWT + Swagger)
└─ web/   # Front-end (React + Vite + React Router + Axios)
```

## Variáveis de ambiente

### `api/.env` (copiar de `.env.example`)
```ini
DB_HOST=localhost
DB_USER=SEU_USUARIO
DB_PASSWORD=SEU_SEGREDO
DB_DATABASE=ifrs_volunteers_db
PORT=3000
JWT_SECRET=troque-esta-chave
```

### `web/.env` (copiar de `.env.example`)
```bash
VITE_API_URL=http://localhost:3000
```

## Banco de dados (API)
Executar o script de criação/seed:
```
api/src/database/create_db.sql
```
> Cria o DB `ifrs_volunteers_db`, a tabela `events` e insere 3 eventos de exemplo.

---

## Como rodar

Você pode rodar o projeto de duas formas: **(A) pela raiz com npm workspaces** ou **(B) entrando em cada pasta (api/web)**.

### A) Pela raiz (npm workspaces)

Na **raiz** do monorepo:

```bash
# instala dependências de api/ e web/ de uma vez (workspaces)
npm run install:all

# subir a API (porta 3000)
npm run dev:api

# em outro terminal: subir o front (porta 5173)
npm run dev:web
```

- Swagger UI: **http://localhost:3000/api-docs**
- Front: **http://localhost:5173**

---

### B) Rodando separadamente por pasta

#### API (back-end)
```bash
cd api
npm install
npm run dev               # sobe em http://localhost:3000
```

#### Web (front-end)
```bash
cd web
npm install
npm run dev               # sobe em http://localhost:5173
```

---

## Rotas principais (API)

- `GET /events` — **pública** (lista eventos)
- `POST /auth/login` — autentica e retorna `{ token, user }`
- `GET /dashboards` — **autenticado** (JWT)
- `GET /admin` — **admin** (JWT + role)
- `POST /events` — **admin** (cria evento; corpo mínimo: `title`, `event_date`, `location`)

**Autenticação/Autorização**
- JWT **Bearer** (header `Authorization: Bearer <token>`)
- payload inclui `{ email, role }`
- Middleware: `authenticate` (valida token) e `authorize('admin')` (restringe por role)
- Swagger com `bearerAuth` configurado (`/api-docs`)

**Credenciais de exemplo**
- Admin: `admin@ifrs.edu` / `123456`
- User : `user@ifrs.edu`  / `123456`

---

## Front-end (web)

- **Login** → chama `POST /auth/login`, salva `{token,user}` no **AuthContext** (e no `localStorage`).
- **Rotas:**
  - `/` → **Eventos** (público, consome `GET /events`)
  - `/dashboards` → **protegida** (exige login, consome `GET /dashboards`)
  - `/admin` → **protegida/admin** (exige `role=admin`, consome `GET /admin` e possui form simples para `POST /events`)
- **Guards:** `RequireAuth` e `RequireRole` (React Router)  
- **Axios:** interceptor adiciona `Authorization: Bearer <token>` automaticamente

---

## Testes rápidos

### REST Client (VS Code) — `api/request/events.rest`
```
@baseURL = http://localhost:3000

### Ping
GET {{baseURL}}/ping

### Listar eventos (público)
GET {{baseURL}}/events
Accept: application/json

### Login (pegar token)
POST {{baseURL}}/auth/login
Content-Type: application/json

{
  "email": "admin@ifrs.edu",
  "password": "123456"
}

### Dashboards (autenticado) — cole o token acima em {{token}}
@token = COLE_AQUI
GET {{baseURL}}/dashboards
Authorization: Bearer {{token}}

### Admin (apenas admin)
GET {{baseURL}}/admin
Authorization: Bearer {{token}}

### Criar evento (apenas admin)
POST {{baseURL}}/events
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Feira de Adoção",
  "description": "Cães e gatos no parque",
  "event_date": "2025-10-26 09:00:00",
  "location": "Praça Centenário",
  "capacity": 75
}
```
