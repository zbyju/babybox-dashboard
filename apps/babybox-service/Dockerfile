# Build stage
FROM golang:1.25 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o babybox-service ./cmd/server/main.go

# Final stage
FROM alpine:latest  

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

COPY --from=builder /app/babybox-service .

CMD ["./babybox-service"]

