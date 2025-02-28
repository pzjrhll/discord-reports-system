FROM node:22.7.0

WORKDIR /app

COPY package.json package-lock.json .

RUN npm i

COPY ./src ./src

ENTRYPOINT ["node", "src/bot.js"]