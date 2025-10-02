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
> Cria o DB `ifrs_volunteers_db`, as tabelas `events` e `volunteers`, e insere dados de exemplo.

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

### 🔓 Rotas Públicas
- `GET /events` — lista todos os eventos
- `GET /events/:id` — busca evento por ID
- `POST /auth/login` — autentica e retorna `{ token, user }`
- `POST /volunteers` — **cadastro público** (qualquer pessoa pode se cadastrar)
- `GET /ping` — health check

### 🔐 Rotas Autenticadas (User)
- `GET /dashboards` — dashboard com métricas
- `GET /volunteers/:id` — ver **próprio** perfil (user vê apenas seu ID, admin vê qualquer)
- `PUT /volunteers/:id` — editar **próprio** perfil (user edita apenas seu ID, admin edita qualquer)
- `DELETE /volunteers/:id` — deletar **próprio** perfil (user deleta apenas seu ID, admin deleta qualquer)

### 👑 Rotas Admin
- `GET /volunteers` — listar todos os voluntários
- `POST /events` — criar evento
- `PUT /events/:id` — editar evento
- `DELETE /events/:id` — deletar evento (retorna `{ message: "Evento removido com sucesso" }`)
- `GET /admin` — métricas administrativas

**Autenticação/Autorização**
- JWT **Bearer** (header `Authorization: Bearer <token>`)
- Payload inclui `{ id, email, role }`
- Middleware: `authenticate` (valida token) e `authorize('admin')` (restringe por role)
- Swagger com `bearerAuth` configurado (`/api-docs`)

**Credenciais de exemplo (seed)**
- Admin: `admin@ifrs.edu` / `123456`
- User: `user@ifrs.edu` / `123456`
- Outros: `maria@ifrs.edu`, `pedro@ifrs.edu` (senha: `123456`)

---

## Front-end (web)

- **Login** → chama `POST /auth/login`, salva `{token,user}` no **AuthContext** (e no `localStorage`)
- **Rotas:**
  - `/` → **Eventos** (público, consome `GET /events`)
  - `/login` → formulário de login
  - `/dashboards` → **protegida** (exige login, consome `GET /dashboards`)
  - `/admin` → **protegida/admin** (exige `role=admin`, consome `GET /admin` e possui form para `POST /events`)
- **Guards:** `RequireAuth` e `RequireRole` (React Router)  
- **Axios:** interceptor adiciona `Authorization: Bearer <token>` automaticamente
- **Ícones:** Lucide React (componentes `<MapPin>`, `<Calendar>`, `<LogOut>`)

**Estilização**
- CSS global minimalista (`web/src/index.css`)
- Variáveis CSS para cores e espaçamentos
- Design responsivo e acessível

---

## Testes da API

Arquivos REST Client disponíveis:
- `api/request/volunteers.rest` — testes completos de CRUD de volunteers e events
- `api/request/events.rest` — testes básicos de eventos

### Exemplo rápido

```http
@baseURL = http://localhost:3000

### 1. Cadastro público (sem token)
POST {{baseURL}}/volunteers
Content-Type: application/json

{
  "name": "Novo Voluntário",
  "email": "novo@ifrs.edu",
  "phone": "(54) 99999-0000",
  "password": "123456"
}

### 2. Login
POST {{baseURL}}/auth/login
Content-Type: application/json

{
  "email": "admin@ifrs.edu",
  "password": "123456"
}

### 3. Listar eventos (público)
GET {{baseURL}}/events

### 4. Dashboard (autenticado)
@token = COLE_O_TOKEN_AQUI
GET {{baseURL}}/dashboards
Authorization: Bearer {{token}}

### 5. Criar evento (admin)
POST {{baseURL}}/events
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Feira de Adoção",
  "description": "Adote um pet",
  "event_date": "2025-10-26 09:00:00",
  "location": "Praça Centenário",
  "capacity": 75
}
```

---

## Documentação Adicional
- **Swagger UI** — `http://localhost:3000/api-docs` (documentação interativa)