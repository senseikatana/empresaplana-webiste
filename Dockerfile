# syntax=docker/dockerfile:1

FROM node:22.12.0-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@12.4.1
ENV PATH="/usr/local/bin:$PATH"

FROM base AS build
WORKDIR /app
RUN pnpm config set store-dir /pnpm/store
COPY . .
ENV DATABASE_URL=postgresql://postgres:placeholder@localhost:5432/placeholder
ENV NITRO_PRESET=node_server
RUN pnpm install --frozen-lockfile
RUN pnpm run render:build

FROM node:22.12.0-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", "./.output/server/index.mjs"]