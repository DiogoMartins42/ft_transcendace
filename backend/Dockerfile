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
RUN if [ "$NODE_ENV" = "development" ]; then \
      npm ci; \
    else \
      npm ci --omit=dev; \
    fi

RUN npm rebuild better-sqlite3
COPY . .

RUN mkdir -p /app/data

EXPOSE 3001

CMD ["npm", "start"]