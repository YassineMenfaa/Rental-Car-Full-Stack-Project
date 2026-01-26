# --- Stage 1: Build the Angular Application ---
FROM node:20 AS build
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application (output path will be /app/dist/frontend/browser)
RUN npm run build -- --configuration production

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy the build output from Stage 1
COPY --from=build /app/dist/frontend/browser .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
