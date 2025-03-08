# Stage 1: Сборка приложения
FROM node:18-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходники приложения
COPY . .

# Собираем приложение для production
RUN npm run build

# Stage 2: Запуск приложения в nginx
FROM nginx:stable-alpine

# Копируем собранное приложение из стадии build
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфигурационный файл nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"] 