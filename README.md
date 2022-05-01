# Babybox Dashboard

This repository is a monorepo (using turborepo) for the Babybox Dashboard project.

All babyboxes send data (status, temperatures, voltages) to a server. This project focuses on receiving and storing the data; analyzing it; visualising it.

## Monorepo

This turborepo uses [pnpm](https://pnpm.io) as a packages manager. It includes the following packages/apps:

### Apps

These are the individual microservices in this app:

- `data-receiver`: a Node.js backend application that receives data from babyboxes and sends them to various middlewares
- `data-api`: a GraphQL API for accessing data from the database

### Packages

These are the shared packages for this monorepo:

- `shared`: includes all of the code that can be shared by the apps. This package includes:
    - utils: utility files
    - types: TypeScript types
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `config`: `eslint` configurations

### Dependency

All of the dependecies for individual apps/packages can be found in the `package.json` file. Generally this project uses:

- **TypeScript**
- Node.js
- Vue 3
- InfluxDB
- MongoDB
- Redis
- Docker
- Turborepo
- pnpm


## Setup

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Development

To develop all apps and packages, run the following command:

```
pnpm dev
```
