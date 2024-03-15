FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package* ./

# Install dependencies 
RUN npm install

# Copy the code
COPY . .

# Build for production 
RUN npm run build

# Expose the port 
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]

