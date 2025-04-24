FROM node:22

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV CI=true

RUN pnpm install --frozen-lockfile
RUN npx prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start"]