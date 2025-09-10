FROM node:20-alpine

WORKDIR /app

COPY services/professors/package*.json ./

COPY libs ./libs

RUN npm install --legacy-peer-deps

COPY services/professors/src ./src
COPY services/professors/tsconfig*.json ./
COPY services/professors/nest-cli.json ./
COPY services/professors/webpack.config.js ./

RUN npm run build

EXPOSE 4352

CMD ["npm", "run", "start:prod"]