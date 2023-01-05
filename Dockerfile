# establece las dependencias de la instalación
FROM node:18-alpine as deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Construyr la aplicación
FROM node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN yarn build


# Correr la imagen para realizar instalación mediante el comando prod
FROM node:18-alpine as runner
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --prod
COPY --from=builder /app/dist ./dist


CMD [ "node", "dist/main" ]