FROM ghcr.io/puppeteer/puppeteer:22.10.0

# Set environment variables for Docker
ENV DOCKER_ENV=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY services/scrapper/package*.json ./
COPY libs ./libs

RUN npm install --legacy-peer-deps

COPY services/scrapper/src ./src
COPY services/scrapper/tsconfig*.json ./
COPY services/scrapper/nest-cli.json ./
COPY services/scrapper/webpack.config.js ./

RUN npm run build

EXPOSE 4352

CMD ["npm", "run", "start:prod"]
