FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:testing

FROM nginx AS production

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/www/ /etc/nginx/html

EXPOSE 80

