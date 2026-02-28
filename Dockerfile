# libra apps/api - Bun-based API for DigitalOcean App Platform
FROM oven/bun:1.2-alpine
WORKDIR /app

# Copy monorepo structure (root + packages + api)
COPY package.json pnpm-lock.yaml* bun.lock* ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# prisma generate reads the schema (which uses env("DATABASE_URL")).
# Provide a dummy value at build time so the build succeeds without a real DB.
# The real DATABASE_URL is injected at runtime by the platform.
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN cd packages/database && bunx prisma generate

WORKDIR /app/apps/api

# App Platform injects PORT (default 8080)
EXPOSE 8080

# Run migrations from the database package dir (prisma.config.ts must be in CWD for Prisma v7),
# then start the API from its own dir.
CMD cd /app/packages/database && bunx prisma migrate deploy && cd /app/apps/api && bun run src/index.ts
