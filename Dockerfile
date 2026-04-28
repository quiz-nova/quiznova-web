FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build browser-only assets for a non-SSR deployment.
RUN npm run build -- --configuration development --output-path=dist

FROM nginx:1.28-alpine AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/

EXPOSE 4200
