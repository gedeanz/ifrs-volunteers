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
PORT=3000
JWT_SECRET=troque-esta-chave
LOG_LEVEL=info
NODE_ENV=development
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/ifrs_volunteers_db"
```
### `web/.env` (copiar de `.env.example`)
```bash
VITE_API_URL=http://localhost:3000
```

## Banco de dados (API)

Com o Prisma (versão `6.19.0`) não é mais necessário rodar scripts SQL manualmente.

As migrations e o seed da base são executados com os comandos descritos na seção **Como rodar**, onde está o fluxo completo: instalar dependências, aplicar migrations, rodar o seed e subir a API.

> ⚠️ **Importante:** se precisar reinstalar manualmente, use `npm install --save-dev prisma@6.19.0` e `npm install @prisma/client@6.19.0`. Versões 7.x possuem mudanças que quebram o fluxo configurado para esta prova.

**Seed padrão (`npm run seed`):**
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

# Banco de dados
cd api # Na pasta api
npx prisma migrate dev # Cria o banco e popula as tabelas com prisma

# (Na raíz do projeto) subir a API - porta 3000
npm run dev:api

# (Na raíz do projeto) em outro terminal: subir o front - porta 5173
npm run dev:web
```
* Se precisar popular o banco manualmente (sem o npx prisma migrate dev), use `npm run seed`.

- Swagger UI: **http://localhost:3000/api-docs**
- Front: **http://localhost:5173**

---

### B) Rodando separadamente por pasta

#### API (back-end)
```bash
cd api
npm install
npx prisma migrate dev    # Cria o banco e popula as tabelas com prisma
npm run dev               # sobe em http://localhost:3000
```
* Se precisar popular o banco manualmente (sem o npx prisma migrate dev), use `npm run seed`.

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

## Testes da API (Jest, Supertest e REST Client)

- Arquivo REST Client:
  - `api/tests/tests.rest` — suite de testes manuais com os principais endpoints da API, incluindo cenários de sucesso e erro.

### Como usar o REST Client
1. Instale a extensão "REST Client" no VS Code.
2. Abra o arquivo `api/tests/tests.rest`.
3. Execute cada requisição clicando em "Send Request".
4. Após o login, copie o token retornado e cole nas variáveis `@tokenAdmin` ou `@tokenUser` no início do arquivo.

### Testes automatizados com Jest e Supertest (API)

- Estrutura de pastas:
  - `api/tests/unit/` — testes **unitários** das regras de negócio (ex.: `AuthService`, `EventService`, `RegistrationService`).
  - `api/tests/integration/` — testes de **integração HTTP** com Supertest para rotas como `/auth/login`, `/events` e `/volunteers`.

- Comandos principais (executar dentro de `api/`):
  - `npm test` — roda **todas** as suítes (unitários + integração).
  - `npm run test:unit` — roda apenas os testes unitários em `tests/unit`.
  - `npm run test:integration` — roda apenas os testes de integração em `tests/integration`.

> 💡 Para os testes de integração, é necessário ter o banco migrado e com dados de seed:
> ```bash
> cd api
> npx prisma migrate dev
> npm run seed
> npm run test:integration
> ```

---

## Teste E2E (Selenium - Login)

- Arquivo de teste:
  - `web/tests/e2e/login.test.js` — automatiza **dois cenários** na tela de login:
    1. Login **inválido** → exibe a mensagem de erro retornada pela API.
    2. Login **válido** → acessa o dashboard protegido após autenticar com sucesso.

### Como executar o teste E2E

1. Inicie a API e o front-end:
   ```bash
   # terminal 1 (API)
   cd api
   npm run dev

   # terminal 2 (web)
   cd web
   npm run dev
   ```
 2. Em um terceiro terminal, na raiz do projeto, execute:
   ```bash
   node web/tests/e2e/login.test.js
   ```
 3. O Selenium abrirá o Chrome e executará automaticamente:
    - **Cenário 1:** login inválido → deve aparecer no terminal algo como:
      - `Cenário 1: login inválido → deve exibir mensagem de erro`
      - `Mensagem de erro exibida corretamente!`
    - **Cenário 2:** login válido com `user@ifrs.edu` / `123456` → deve aparecer no terminal algo como:
      - `Cenário 2: login válido → deve navegar para o dashboard`
      - `Login realizado e dashboard exibido com sucesso!`
      - `Teste finalizado sem erros!`

> Alguns avisos/erros internos do Chrome ou do WebDriver podem aparecer no terminal (ex.: mensagens de sandbox, métricas de carregamento, etc.), mas **não impactam o resultado do teste**. O importante é que as mensagens acima sejam exibidas.

---

## Logs estruturados da API (Winston)

- Logger configurado em `api/src/config/logger.js`, gerando logs estruturados em JSON para **console** e arquivo `api/logs/app.log`.
- Middlewares principais em `api/src/middlewares`:
  - `requestLogger.js` — registra informações de cada requisição HTTP (rota, método, status, tempo de resposta, usuário, etc.).
  - `errorHandler.js` — tratamento centralizado de erros, retornando sempre `{ error: 'mensagem' }` com o status adequado.
- Variáveis de ambiente usadas:
  - `LOG_LEVEL` (ex.: `info`, `warn`, `error`).
  - `NODE_ENV` (ex.: `development`, `production`) — controla o formato e destino dos logs.

---

## Documentação Adicional
- **Swagger UI** — `http://localhost:3000/api-docs` (documentação interativa)