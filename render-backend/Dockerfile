# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files first (to enable Docker cache)
COPY package*.json ./
COPY src/package*.json ./src/

# Install dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Expose all ports required for production
EXPOSE 3000 1234 8080

# Ensure the app binds to all interfaces (not just localhost)
ENV HOST=0.0.0.0

# Run the backend (Express app that proxies /yjs and /execution)
CMD ["node", "src/index.js"]
