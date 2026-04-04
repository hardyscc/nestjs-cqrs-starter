# AGENTS.md

## Repository Overview

NestJS CQRS Microservices Starter — a monorepo demonstrating an advanced microservice architecture with GraphQL (Apollo Federation), Domain-Driven Design (DDD), and the Command Query Responsibility Segregation (CQRS) pattern using NestJS.

## Project Structure

```
apps/
  gateway/          # Apollo Federation gateway (GraphQL entry point, port 3000)
  service-user/     # User microservice (CQRS + EventStore + MySQL)
  service-account/  # Account microservice (CQRS + EventStore + MySQL)
libs/
  common/           # Shared library: domain events and interfaces
```

Each service follows DDD layers:

```
src/
  <domain>/
    commands/       # Command handlers (write side)
    queries/        # Query handlers (read side)
    events/         # Event handlers (async reactions to domain events)
    models/         # Domain entities / TypeORM entities
    sagas/          # Sagas (orchestrate cross-service workflows via events)
    dto/            # GraphQL input/output types
    resolvers/      # GraphQL resolvers
    <domain>.module.ts
```

## Common Commands

```bash
# Install dependencies
npm install

# Build all apps
npm run build

# Lint (zero warnings enforced)
npm run lint

# Format code
npm run format

# Run unit tests
npm test

# Run unit tests with coverage
npm run test:cov

# Run e2e tests (gateway)
npm run test:e2e

# Start a specific app in watch mode
nest start service-user --watch
nest start service-account --watch
nest start gateway --watch
```

## Architecture Conventions

- **CQRS**: All write operations go through `Command` → `CommandHandler`. All read operations go through `Query` → `QueryHandler`. Never mix reads and writes in the same handler.
- **Events**: Domain events are published after successful command execution and handled asynchronously by `EventHandler` classes. Cross-service events flow through EventStore persistent subscriptions.
- **Sagas**: Use NestJS CQRS `@Saga()` to react to events and dispatch new commands across service boundaries.
- **GraphQL**: All APIs are exposed via GraphQL resolvers using `type-graphql` decorators. The gateway federates schemas from each microservice.
- **TypeORM**: Entities use MySQL. Entity class names map to uppercase table names (e.g., `USER`, `ACCOUNT`).
- **Shared library**: Place reusable domain event definitions and interfaces in `libs/common/src`. Import using the `@hardyscc/common` path alias.

## Code Style

- TypeScript strict mode is enabled.
- ESLint with `@typescript-eslint` — zero warnings allowed (`--max-warnings 0`).
- Prettier is enforced via `lint-staged` on pre-commit (formats `*.ts` files).
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by `commitlint`).

## External Dependencies for Local Development

| Service    | Docker command |
|------------|----------------|
| MySQL 8    | `docker run -d -e MYSQL_ROOT_PASSWORD=Admin12345 -e MYSQL_USER=usr -e MYSQL_PASSWORD=User12345 -e MYSQL_DATABASE=development -e MYSQL_AUTHENTICATION_PLUGIN=mysql_native_password -p 3306:3306 --name some-mysql bitnami/mysql:8.0.19` |
| EventStore | `docker run --name some-eventstore -d -p 2113:2113 -p 1113:1113 eventstore/eventstore:release-5.0.9` |

After starting EventStore, create persistent subscriptions for cross-service event routing (see README.md for the `curl` commands).

## Testing

- Unit tests live alongside source files as `*.spec.ts`.
- E2E tests for the gateway are in `apps/gateway/test/`.
- Run `npm test` before opening a pull request.
