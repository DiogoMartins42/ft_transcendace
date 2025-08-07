FROM node:24-alpine3.21

WORKDIR /app

RUN npm create vite@latest front-end -- --template vanilla-ts

WORKDIR /app/front-end

RUN npm install

RUN npm install tailwindcss @tailwindcss/vite

COPY ./for_copy .

EXPOSE 5173

CMD ["npm", "run", "dev"]