FROM node:20-alpine

WORKDIR /app

COPY services/api_gateway/package*.json ./

COPY libs ./libs

RUN npm install --legacy-peer-deps

COPY services/api_gateway/src ./src
COPY services/api_gateway/tsconfig*.json ./
COPY services/api_gateway/nest-cli.json ./
COPY services/api_gateway/webpack.config.js ./

RUN npm run build

EXPOSE 4351

CMD ["npm", "run", "start:prod"]
