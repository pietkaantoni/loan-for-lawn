ARG NODE_VERSION=24.15.0

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist

USER node

EXPOSE 3001

CMD ["node", "dist/index.js"]
