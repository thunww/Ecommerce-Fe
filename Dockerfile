# Build stage
FROM node:18 as build

WORKDIR /app

# Copy package.json only to generate a fresh package-lock.json
COPY package.json ./

# Clean up and install dependencies for the Docker environment
RUN npm cache clean --force
RUN npm install --force

# Copy source code (excluding node_modules due to .dockerignore)
COPY . .

# Copy .env.docker to .env
COPY .env.docker .env

# Build the app
RUN npm run build -- --mode docker

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 