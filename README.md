<div align="center">
  <h1>🚀 NestJS Enterprise Boilerplate</h1>
  <p>A robust, scalable, and highly-opinionated enterprise-grade boilerplate for building modern server-side applications using NestJS, Fastify, and PostgreSQL.</p>

  <p>
    <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"></a>
    <a href="https://fastify.io" target="_blank"><img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify"></a>
    <a href="https://www.postgresql.org" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
    <a href="https://pnpm.io" target="_blank"><img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"></a>
    <a href="https://swagger.io" target="_blank"><img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger"></a>
    <a href="https://prometheus.io" target="_blank"><img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" alt="Prometheus"></a>
  </p>
</div>

## ✨ Features

- **Blazing Fast**: Uses **Fastify** as the underlying HTTP adapter for maximum performance.
- **Enterprise Architecture**: Domain-Driven Design (DDD) & Modular Monolith architecture, preparing your codebase for future scalability and easy extraction to microservices.
- **Type-Safe Database**: Fully integrated **TypeORM** with **PostgreSQL**.
- **Observability out of the box**:
  - **Structured Logging**: Pre-configured `nestjs-pino` and `pino-pretty` for highly readable local logs and structured JSON logs for production.
  - **Metrics**: **Prometheus** metrics export pre-configured (`@willsoto/nestjs-prometheus`).
  - **Grafana**: Ready-to-use Grafana dashboard configured via Docker Compose.
- **API Documentation**: Automated **Swagger / OpenAPI 3.0** documentation setup.
- **Command Query Responsibility Segregation (CQRS)**: NestJS CQRS module included to enforce clear separation of concerns.
- **Validation**: Global pipes set up with `class-validator` and `class-transformer`.
- **Infrastructure Ready**: Comprehensive `docker-compose.yaml` to instantly spin up the API, Database, Prometheus, and Grafana.
- **Developer Experience (DX)**:
  - **Strict Linting**: `eslint` (flat config) and `prettier`.
  - **Git Hooks**: Pre-configured `husky` + `commitlint` + `lint-staged` for code quality on commit.
  - **Testing**: Pre-configured **Jest** setups for unit and end-to-end testing.
  - **Path Aliases**: Clean imports mapped natively in `package.json` (`#app`, `#modules`, `#infra`, etc.).

---

## 🏗 Architecture & Folder Structure

The application follows a structured modular architecture:

```
src/
├── app/             # Main Application Module unifying all global imports
├── apps/            # For specific app contexts (e.g., workers, crons)
├── config/          # Centralized configuration (App, DB, Swagger, Metrics)
├── core/            # Global/Core utilities: Filters, Guards, Decorators, Interceptors, Logger
├── infra/           # Infrastructure layer: Database, External Services, Metrics providers
└── modules/         # Business Logic Domains / Use Cases
    └── users/       # Example Domain Module (Controllers, Services, CQRS Handlers)
```

**Path Aliases:**
Instead of relative `../../../` paths, the project uses native Node.js package imports defined in `package.json`:
- `#app/*` -> `src/app/*`
- `#apps/*` -> `src/apps/*`
- `#config/*` -> `src/config/*`
- `#core/*` -> `src/core/*`
- `#infra/*` -> `src/infra/*`
- `#modules/*` -> `src/modules/*`

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `>=24.15.0`
- **pnpm**: `>=10.33.2`
- **Docker & Docker Compose** (for infrastructure)

### 2. Installation

Clone the repository and install dependencies using `pnpm`:

```bash
# Install dependencies
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the `keys/` directory based on the default values needed for the infrastructure.

```bash
# Example keys/.env variables
APP_PORT=5555
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=enterprise_db
```

### 4. Running the Infrastructure (Docker Compose)

Spin up PostgreSQL, Prometheus, and Grafana with one command:

```bash
# Start all infrastructure dependencies (DB, Prometheus, Grafana)
pnpm run infra:up

# Start only the database
pnpm run infra:db:up
```

### 5. Running the Application

```bash
# Development mode
pnpm run start

# Watch mode (Hot Reload)
pnpm run start:dev

# Production mode
pnpm run start:prod
```

Once running, you can access:
- **API Base URL**: `http://localhost:5555/api/v1`
- **Swagger Documentation**: `http://localhost:5555/api/docs`
- **Prometheus Metrics**: `http://localhost:5555/metrics`

---

## 💾 Database Migrations (TypeORM)

TypeORM is configured to handle schema migrations smoothly.

```bash
# Generate a new migration based on entity changes
pnpm run migration:generate --name=AddUsersTable

# Create an empty migration file
pnpm run migration:create --name=ManualMigration

# Run pending migrations
pnpm run migration:run

# Revert the last applied migration
pnpm run migration:revert
```

---

## 🐳 Docker Infrastructure Services

The boilerplate provides an `infra/docker-compose.yaml` file to simplify local development and deployment. 

Available scripts:
- `pnpm run infra:up` - Starts all services (API, Postgres, Prometheus, Grafana).
- `pnpm run infra:down` - Stops and removes all containers.
- `pnpm run infra:logs` - Streams logs from all containers.

**Included Services in Docker Compose:**
1. **API**: The NestJS application itself.
2. **Postgres**: Application database (`postgres:15-alpine`).
3. **Prometheus**: Scrapes metrics from the API on port `9090`.
4. **Grafana**: Visualization of metrics on port `9030`.

---

## 🧪 Testing

Jest is pre-configured for both Unit and E2E testing.

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run end-to-end tests
pnpm run test:e2e

# Generate test coverage report
pnpm run test:cov
```

---

## 📝 Code Quality & Git Hooks

This boilerplate strictly enforces code quality standards.
- **Husky** runs Git Hooks.
- **Commitlint** enforces Conventional Commits standard (e.g., `feat: add new user module`, `fix: correct database typo`).
- **Lint-Staged** runs ESLint and Prettier on staged files before they are committed.

```bash
# Manually run linter
pnpm run lint

# Manually run formatter
pnpm run format
```

---

## 📄 License

This project is licensed under the **UNLICENSED** license. Please update it according to your company's guidelines.
