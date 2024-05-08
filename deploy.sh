#!/bin/bash
# Example deployment script

echo "Pulling latest changes..."
git pull origin main

echo "Rebuilding and restarting Docker services..."
docker-compose up -d --build

echo "Deployment complete!"