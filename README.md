# Backend - Diary Study

API REST para gerenciamento de diário de estudos com Fastify, TypeScript e PostgreSQL.

## Stack

- **Framework**: Fastify v5
- **Linguagem**: TypeScript
- **Database**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT
- **Validação**: Zod
- **Testes**: Jest + Supertest

## Instalação

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Iniciar desenvolvimento
npm run dev
```

## Configuração

Crie um arquivo `.env` baseado no `.env.example`:

```env
DATABASE_URL="postgres://user:password@localhost:5432/dbname"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3000
NODE_ENV=development
```

## Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar novo usuário |
| POST | `/auth/login` | Fazer login |
| POST | `/auth/forgot-password` | Solicitar recuperação de senha |
| POST | `/auth/reset-password` | Redefinir senha |
| GET | `/auth/me` | Obter usuário atual |

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Listar usuários |
| GET | `/users/:id` | Obter usuário por ID |
| POST | `/users` | Criar usuário |
| PUT | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Deletar usuário |

### Matérias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/subjects` | Listar matérias |
| GET | `/subjects/:id` | Obter matéria por ID |
| POST | `/subjects` | Criar matéria |
| PUT | `/subjects/:id` | Atualizar matéria |
| DELETE | `/subjects/:id` | Deletar matéria |

### Estudos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/studies` | Listar sessões de estudo |
| GET | `/studies/:id` | Obter sessão por ID |
| POST | `/studies` | Criar sessão de estudo |
| PUT | `/studies/:id` | Atualizar sessão |
| DELETE | `/studies/:id` | Deletar sessão |

### Metas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/goals` | Listar metas |
| GET | `/goals/:id` | Obter meta por ID |
| POST | `/goals` | Criar meta |
| PUT | `/goals/:id` | Atualizar meta |
| DELETE | `/goals/:id` | Deletar meta |

### Anotações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/notes` | Listar anotações |
| GET | `/notes/:id` | Obter anotação por ID |
| POST | `/notes` | Criar anotação |
| PUT | `/notes/:id` | Atualizar anotação |
| DELETE | `/notes/:id` | Deletar anotação |

## Exemplos de Requisição

### Registrar Usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "password": "Senha123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "password": "Senha123"}'
```

### Criar Sessão de Estudo (Autenticado)

```bash
curl -X POST http://localhost:3000/studies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"hours": 2.5, "date": "2024-01-15T10:00:00Z"}'
```

### Listar Estudos com Filtros

```bash
curl -X GET "http://localhost:3000/studies?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## Desenvolvimento com Docker

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f app
```

## Testes

```bash
# Executar todos os testes
npm test

# Executar testes com coverage
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

## Documentação da API

Acesse `/docs` para ver a documentação Swagger:

```
http://localhost:3000/docs
```

## Estrutura do Projeto

```
src/
├── controllers/    # Handlers de requisição
├── services/       # Lógica de negócio
├── schemas/        # Validação Zod
├── middleware/     # Middleware auth
├── routes/         # Definição de rotas
└── lib/            # Cliente Prisma
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Compilar TypeScript |
| `npm run start` | Iniciar servidor em produção |
| `npm run db:generate` | Gerar cliente Prisma |
| `npm run db:push` | Sincronizar schema com DB |
| `npm run db:migrate` | Executar migrações |
| `npm run db:studio` | Abrir Prisma Studio |
