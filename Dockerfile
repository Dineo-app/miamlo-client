# 1) Builder stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files & install dev+prod deps, ignoring peer errors
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --silent

# Copy source
COPY . .

# Build with production environment using the dedicated build:prod script
# This script loads env/.env.production and builds with the correct environment
RUN npm run build:prod

# 2) Production stage
FROM node:18-alpine
WORKDIR /usr/src/app

# Install static server
RUN npm install -g serve --silent

# Copy the Vite output (dist/)
COPY --from=builder /usr/src/app/dist ./dist

# Expose & serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]