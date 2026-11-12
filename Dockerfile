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

LABEL org.opencontainers.image.title="quiznova-web" \
  org.opencontainers.image.description="QuizNova Single Page Application" \
  org.opencontainers.image.url="https://quiznova.dev" \
  org.opencontainers.image.source="https://github.com/quiz-nova/quiznova-web" \
  org.opencontainers.image.vendor="QuizNova" \
  org.opencontainers.image.licenses="All rights reserved"

# Replace default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets
COPY --from=build /app/dist/quiznova-web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
