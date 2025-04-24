FROM node:22

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV CI=true

RUN pnpm install --frozen-lockfile
RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "start"]