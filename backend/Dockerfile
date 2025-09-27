FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install dependencies based on environment
RUN if [ "$NODE_ENV" = "development" ]; then \
      npm ci && npm install -g nodemon; \
    else \
      npm ci --omit=dev; \
    fi

RUN npm rebuild better-sqlite3

# Copy source code
COPY . .

RUN mkdir -p /app/data

EXPOSE 3000

# Use different commands based on environment
CMD if [ "$NODE_ENV" = "development" ]; then \
      nodemon src/index.js; \
    else \
      npm start; \
    fi