FROM node:9-slim
WORKDIR /app
COPY . /app
CMD ["node", "api.bundle.js"]