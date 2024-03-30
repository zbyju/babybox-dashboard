# Snapshot Handler

Snapshot Handler service focuses on processing snapshots coming from babyboxes and requests coming from the frontend asking about those snapshots.

## How to run

_It is recommended that you go to the root of this repository and run the whole application using the Docker Compose method._

### Docker

#### Production

```sh
docker build -t babybox-dashboard-snapshot-handler .
docker run -p 8080:8080 babybox-dashboard-snapshot-handler
```

#### Development

```sh
docker build -f Dockerfile.dev -t babybox-dashboard-snapshot-handler-dev .
docker run -p 8080:8080 babybox-dashboard-snapshot-handler-dev
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
