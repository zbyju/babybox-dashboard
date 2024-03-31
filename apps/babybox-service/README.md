# Babybox Service

Babybox service focuses on maintaining information about babyboxes - it exposes a REST API for creating, updating and querying babybox information. Babyboxes are automatically created when there is a snapshot with a babybox using a slug that hasn't been stored yet.

## How to run

_It is recommended that you go to the root of this repository and run the whole application using the Docker Compose method._

### Docker

#### Production

```sh
docker build -t babybox-dashboard-babybox-service .
docker run -p 8080:8080 babybox-dashboard-babybox-service
```

#### Development

```sh
docker build -f Dockerfile.dev -t babybox-dashboard-babybox-service-dev .
docker run -p 8080:8080 babybox-dashboard-babybox-service-dev
```

### Manual

```sh
# Production Run
go run ./cmd/server/

# Development Run
air

# Run tests
go test
```
