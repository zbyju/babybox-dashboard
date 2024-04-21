FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package* ./

# Install dependencies 
RUN npm install

# Copy the code
COPY . .

# Env
ENV NEXT_PUBLIC_URL_SNAPSHOT_HANDLER=http://snapshot-handler.localhost
ENV NEXT_PUBLIC_URL_BABYBOX_SERVICE=http://babybox-service.localhost
ENV NEXT_PUBLIC_URL_USER_SERVICE=http://user-service.localhost
ENV NEXT_PUBLIC_URL_NOTIFICATION_SERVICE=http://notification-service.localhost


# Build for production 
RUN npm run build

# Expose the port 
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]

