FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm build-ts

COPY . /app

CMD ["node", "./dist/server.js"]

EXPOSE 8080 8080