FROM node:20-alpine

WORKDIR /app

# Copy root package.json and workspace config
COPY package*.json ./
COPY tsconfig.json ./

# Copy libs first
COPY libs ./libs

# Copy service package.json
COPY services/api_gateway/package*.json ./services/api_gateway/

# Copy service source code and config
COPY services/api_gateway/src ./services/api_gateway/src
COPY services/api_gateway/tsconfig*.json ./services/api_gateway/
COPY services/api_gateway/nest-cli.json ./services/api_gateway/
COPY services/api_gateway/webpack.config.js ./services/api_gateway/

# Install dependencies with workspace support
RUN npm install --legacy-peer-deps

# Build from service directory
WORKDIR /app/services/api_gateway
RUN npm run build

EXPOSE 4351

CMD ["npm", "run", "start:prod"]
