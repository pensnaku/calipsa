FROM alpine:latest

RUN apk add nodejs npm git

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm build-ts

COPY . /app

CMD ["node", "./dist/server.js"]

EXPOSE 8080 8080