FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY . .

RUN mkdir -p /app/data

EXPOSE 3001

CMD ["npm", "start"]