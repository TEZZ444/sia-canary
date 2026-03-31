FROM node:20-bookworm-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
