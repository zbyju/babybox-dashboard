# Babybox Dashboard

Babybox Dashboard is a microservice application that provides a platform for managing data around managing babyboxes. It mainly focuses on retrieving structured data from babyboxes and provide them to the staff in a useful way (using visualization, aggregation and analytical techniques). The application also manages additional information about each babybox (location, configuration, contact information). There is also information about maintenances. The application generates notifications for users.

## How to run

This application can be either ran manually, or using docker (specifically docker compose).

### Docker

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
