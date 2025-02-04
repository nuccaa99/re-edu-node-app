FROM node:23-alpine

WORKDIR /app

COPY . .

RUN npm i --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "start:dev"]