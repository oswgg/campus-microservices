FROM node:20-alpine

WORKDIR /app

# Copy root package.json and workspace config
COPY package*.json ./
COPY tsconfig.json ./

# Copy libs first
COPY libs ./libs

# Copy service package.json
COPY services/professors/package*.json ./services/professors/

# Copy service source code and config
COPY services/professors/src ./services/professors/src
COPY services/professors/tsconfig*.json ./services/professors/
COPY services/professors/nest-cli.json ./services/professors/
COPY services/professors/webpack.config.js ./services/professors/

# Install dependencies with workspace support
RUN npm install --legacy-peer-deps

# Build from service directory
WORKDIR /app/services/professors
RUN npm run build

EXPOSE 4352

CMD ["npm", "run", "start:prod"]