FROM node

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install -g json-server

COPY . .

RUN npm run init

EXPOSE 3000

CMD ["npm", "start"]