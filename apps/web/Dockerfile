FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package.json yarn.lock ./

# Install dependencies 
RUN yarn install

# Copy the code
COPY . .

# Build for production 
RUN yarn build

# Expose the port 
EXPOSE 3000

# Start the production server
CMD ["yarn", "start"]

