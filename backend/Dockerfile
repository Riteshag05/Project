FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build frontend
RUN npm run build

# Backend build stage
FROM node:20-alpine as backend-build

# Set working directory
WORKDIR /app

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy backend source code
COPY backend/ .

# Build backend
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Create separate directories for frontend and backend
RUN mkdir -p /app/frontend /app/backend

# Copy frontend build from build stage
COPY --from=build /app/dist /app/frontend

# Copy backend build from backend-build stage
COPY --from=backend-build /app/dist /app/backend
COPY --from=backend-build /app/node_modules /app/backend/node_modules
COPY --from=backend-build /app/package.json /app/backend/

# Copy .env file for backend
COPY backend/.env /app/backend/

# Install serve to serve frontend
RUN npm install -g serve

# Copy docker entrypoint script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Expose ports
EXPOSE 3000 5000

# Set entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]