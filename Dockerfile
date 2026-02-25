# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files (only package.json, not lock file for cross-platform builds)
COPY package.json ./

# Install all dependencies (including dev for build)
RUN npm install

# Copy source files
COPY . .

# Build the frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built frontend from builder
COPY --from=builder /app/dist ./dist

# Copy server and tracing files
COPY server.ts ./
COPY tracing.ts ./
COPY src/tic-tac-toe.ts ./src/

EXPOSE 5050

CMD ["npm", "start"]
