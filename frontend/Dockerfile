FROM node:24-alpine3.21

WORKDIR /app/front-end

# Copy package.json first if it exists in your frontend directory
COPY package*.json ./

# Install dependencies if package.json exists, otherwise create vite project
RUN if [ -f "package.json" ]; then \
      npm install; \
    else \
      cd /app && \
      npm create vite@latest front-end -- --template vanilla-ts && \
      cd front-end && \
      npm install; \
    fi

# Install additional dependencies
RUN npm install tailwindcss @tailwindcss/vite

# Copy your custom files
COPY ./for_copy .

EXPOSE 5173

# Run dev server with proper host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]