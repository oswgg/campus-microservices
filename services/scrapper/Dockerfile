FROM ghcr.io/puppeteer/puppeteer:22.10.0

ENV DOCKER_ENV=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Switch to root to manage permissions
USER root

WORKDIR /app

# Copy root package.json and workspace config
COPY package*.json ./
COPY tsconfig.json ./

# Copy libs first
COPY libs ./libs

# Copy service package.json
COPY services/scrapper/package*.json ./services/scrapper/

# Copy service source code and config
COPY services/scrapper/src ./services/scrapper/src
COPY services/scrapper/tsconfig*.json ./services/scrapper/
COPY services/scrapper/nest-cli.json ./services/scrapper/

# Change ownership to the puppeteer user
RUN chown -R pptruser:pptruser /app

# Switch back to puppeteer user
USER pptruser

# Install dependencies with workspace support
RUN npm install --legacy-peer-deps

# Build from service directory
WORKDIR /app/services/scrapper
RUN npm run build

EXPOSE 4352

CMD ["npm", "run", "start:prod"]
