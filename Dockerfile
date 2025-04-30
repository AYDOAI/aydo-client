# ============================================
# Development Base Stage
# ============================================
FROM node:22.14.0 AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# ============================================
# Testing Build Stage
# ============================================
FROM base AS build-testing

COPY . .

# IMPORTANT: Build for testing
RUN npm run build:testing

# ============================================
# Production Build Stage
# ============================================
FROM base AS build-production

COPY . .

# Build for production
RUN npm run build

# ============================================
# NGINX Runtime for Testing
# ============================================
FROM nginx AS testing

COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy built testing files
COPY --from=build-testing /usr/src/app/www/ /etc/nginx/html

EXPOSE 80

# ============================================
# NGINX Runtime for Production
# ============================================
FROM nginx AS production

COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy built production files
COPY --from=build-production /usr/src/app/www/ /etc/nginx/html

EXPOSE 80

# ============================================
# Build APK for Android
# ============================================
FROM mingc/android-build-box:1.28.0 AS build-android

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production=false
