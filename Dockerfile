# Stage 1: Build environment
FROM node:24.15.0-alpine AS builder

RUN corepack enable pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Stage 2: Production environment
FROM node:24.15.0-alpine AS production

RUN corepack enable pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production

CMD ["node", "dist/main"]