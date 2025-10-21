FROM node:20-bullseye

# Install dependencies including OpenSSL for certificate generation
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
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

# Create necessary directories
RUN mkdir -p /app/data /app/certs

# Generate self-signed SSL certificates if they don't exist
RUN if [ ! -f /app/certs/cert.pem ]; then \
    openssl req -x509 -newkey rsa:4096 \
    -keyout /app/certs/key.pem \
    -out /app/certs/cert.pem \
    -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=pongpong.duckdns.org" \
    -addext "subjectAltName=DNS:pongpong.duckdns.org,DNS:localhost,IP:127.0.0.1"; \
    echo "✅ Self-signed certificates generated"; \
    fi

# Set proper permissions
RUN chmod 600 /app/certs/key.pem && chmod 644 /app/certs/cert.pem

EXPOSE 3000

# Use different commands based on environment
CMD if [ "$NODE_ENV" = "development" ]; then \
    nodemon src/index.js; \
    else \
    npm start; \
    fi