FROM alpine:latest

RUN apk add nodejs npm git

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

CMD ["node", "./bin/www"]

EXPOSE 8080 8080