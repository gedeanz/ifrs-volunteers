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

Execute o script SQL no MySQL:
```
api/src/database/create_db.sql
```
> Cria o DB `ifrs_volunteers_db`, as tabelas `events`, `volunteers` e `event_registrations`, e insere eventos de exemplo.

**Seed automático:** Ao iniciar a API pela primeira vez, os usuários são criados automaticamente com senhas criptografadas (bcrypt):
- `admin@ifrs.edu` / `123456` (admin)
- `user@ifrs.edu` / `123456` (user)  
- `maria@ifrs.edu` / `123456` (user)
- `pedro@ifrs.edu` / `123456` (user)

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
- `POST /events/:id/register` — **inscrever-se em evento**
- `DELETE /events/:id/register` — **cancelar inscrição em evento**
- `GET /my-registrations` — **listar minhas inscrições**

### 👑 Rotas Admin
- `GET /volunteers` — listar todos os voluntários
- `POST /events` — criar evento
- `PUT /events/:id` — editar evento
- `DELETE /events/:id` — deletar evento (retorna `{ message: "Evento removido com sucesso" }`)
- `GET /admin` — métricas administrativas
- `GET /events/:id/registrations` — **listar inscritos em um evento**

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
  - `/` → **Eventos** (público, lista eventos com botões de inscrição para usuários logados)
  - `/login` → formulário de login
  - `/register` → cadastro público de voluntários
  - `/dashboards` → **protegida** (dashboard com estatísticas e minhas inscrições)
  - `/profile` → **protegida** (perfil do usuário com edição e exclusão de conta)
  - `/admin` → **protegida/admin** (métricas administrativas)
  - `/volunteers` → **protegida/admin** (gerenciar voluntários - CRUD completo)
  - `/events-manage` → **protegida/admin** (gerenciar eventos - CRUD completo)
- **Guards:** `RequireAuth` e `RequireRole` (React Router)  
- **Axios:** interceptor adiciona `Authorization: Bearer <token>` automaticamente
- **Ícones:** Lucide React (componentes `<MapPin>`, `<Calendar>`, `<LogOut>`, etc)

### Funcionalidades Principais

**Sistema de Inscrições em Eventos:**
- Usuários logados podem se inscrever/cancelar inscrição em eventos
- Contador de vagas disponíveis em tempo real
- Badge dinâmico (verde quando há vagas, vermelho quando esgotado)
- Botão "Esgotado" desabilitado quando não há vagas
- Validação de limite de vagas e inscrições duplicadas
- Dashboard mostra eventos inscritos do usuário

**Gerenciamento Admin:**
- CRUD completo de eventos (criar, editar, deletar)
- CRUD completo de voluntários (criar, editar, deletar)
- Modal de confirmação unificado para exclusões
- Validação de datas (impede criar eventos no passado)
- Formulários com validação em tempo real

**Perfil do Usuário:**
- Visualização e edição de dados pessoais
- Alteração de senha
- Exclusão de conta com confirmação

**Estilização**
- CSS global com variáveis CSS (`web/src/styles.css`)
- Design system consistente (cores IFRS, espaçamentos, tipografia)
- Layout responsivo com grid
- Componentes reutilizáveis (cards, modals, forms, alerts)

---

## Testes da API

Arquivo REST Client disponível:
- `api/tests/tests.rest` — **suite completa de testes** com todos os endpoints, validações e casos de erro

### Como usar:
1. Instale a extensão "REST Client" no VS Code
2. Abra o arquivo `api/tests/tests.rest`
3. Execute cada requisição clicando em "Send Request"
4. Após o login, copie o token e cole nas variáveis `@token` ou `@tokenUser`

---

## Documentação Adicional
- **Swagger UI** — `http://localhost:3000/api-docs` (documentação interativa)