FROM node:16.18.0

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN apt-get update -y && apt-get install -y openssl
# ENV NODE_ENV=production
# ENV LOG_LEVEL=error

# RUN pnpm run build

CMD ["pnpm", "run", "start"]
