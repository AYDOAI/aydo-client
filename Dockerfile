FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем весь проект
COPY . /usr/src/app

# Устанавливаем Angular CLI глобально
RUN npm install -g @angular/cli

# Устанавливаем зависимости проекта
RUN npm install

# Сборка проекта для режима тестирования
RUN npm run build:testing

# Документируем порт (можно указать другие порты, если нужно)
EXPOSE 4200

# Запускаем приложение
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
