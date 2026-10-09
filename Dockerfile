# Stage 1: Build Angular application
FROM node:24-alpine AS build

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source code and compile
COPY . .

ARG CONFIGURATION=production
RUN npx ng build --configuration ${CONFIGURATION}

# Stage 2: Serve with Nginx Alpine
FROM nginx:alpine

# Replace default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets
COPY --from=build /app/dist/quiznova-web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
