
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN  npm install

COPY  . .

ENV PORT=4000

ENV HOST='0.0.0.0'

ENV URL_API="http://localhost:4000/usuarios/"

EXPOSE ${PORT}

CMD ["npm", "run", "start"]