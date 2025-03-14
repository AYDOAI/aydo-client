# ============================================
# Development Stage
# ============================================
FROM node:18 AS dev

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# ============================================
# Testing Stage
# ============================================
FROM dev AS testing
# Copy application source code
COPY . .

# Run build script (adjust as necessary)
RUN npm run build:testing

# Setup Nginx for testing
FROM nginx AS production

# Copy custom nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy built files from the testing stage to the Nginx HTML directory
COPY --from=testing /usr/src/app/www/ /etc/nginx/html

# Expose port 80 for testing
EXPOSE 80
# ============================================
# Build APK for Android
# ============================================
FROM mingc/android-build-box:1.28.0 AS build-android
# Create app directory
WORKDIR /usr/src/app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies
RUN npm install --production=false
