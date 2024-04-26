# Babybox Dashboard

Babybox Dashboard is a microservice application that provides a platform for managing data around managing babyboxes. It mainly focuses on retrieving structured data from babyboxes and provide them to the staff in a useful way (using visualization, aggregation and analytical techniques). The application also manages additional information about each babybox (location, configuration, contact information). The application generates notifications for users. Another feature is analyzing battery quality of babyboxes.

## How to run

This application can be either ran manually, or using docker (specifically docker compose).

### Docker Compose

You can run the application in production or development mode.

In development mode the services automatically listen for changes and restart/refresh when those changes occur.

#### Production

```sh
docker compose up --build
```

#### Development

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml -p babybox-dashboard-dev up
```

### Docker

Each service has a Dockerfile and Dockerfile.dev that can be used to run a single individual service.

### Manually

You can run each service manually by following the README in its directory inside `/apps/`.
