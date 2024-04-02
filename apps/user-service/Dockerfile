# Use the official Bun image as a base
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and bun.lockb files and install dependencies
COPY package.json bun.lockb ./
RUN bun install --production

# Copy the rest of your application code
COPY . .

# Build your app (if you have a build script in your package.json)
# RUN bun run build

# Start the application
CMD ["bun", "start"]

