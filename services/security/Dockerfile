FROM node:20-alpine

WORKDIR /app

# Copy root package.json and workspace config
COPY package*.json ./
COPY tsconfig.json ./

# Copy libs first
COPY libs ./libs

# Copy service package.json
COPY services/security/package*.json ./services/security/

# Copy service source code and config
COPY services/security/src ./services/security/src
COPY services/security/tsconfig*.json ./services/security/
COPY services/security/nest-cli.json ./services/security/

# Install dependencies with workspace support
RUN npm install --legacy-peer-deps

# Build from service directory
WORKDIR /app/services/security
RUN npm run build

EXPOSE 4351

CMD ["npm", "run", "start:prod"]
