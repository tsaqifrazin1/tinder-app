FROM --platform=linux/amd64 node:alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm build

# RUN pnpm typeorm:db:create

EXPOSE 3000

CMD ["pnpm", "start"]