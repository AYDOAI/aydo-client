FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем весь проект
COPY . /usr/src/app

# Устанавливаем Angular CLI глобально
RUN npm install -g @angular/cli

# Устанавливаем зависимости проекта
RUN npm install

# Документируем порт (например, Angular по умолчанию использует 4200)
EXPOSE 4200

# Запускаем приложение
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
