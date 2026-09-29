# Explicit Node LTS release and Alpine base version
FROM node:20.18.0-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5002

CMD ["node", "server.js"]