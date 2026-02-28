# libra apps/api - Bun-based API for DigitalOcean App Platform
FROM oven/bun:1.2-alpine
WORKDIR /app

# Copy monorepo structure (root + packages + api)
COPY package.json pnpm-lock.yaml* bun.lock* ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# Generate Prisma client (DATABASE_URL is not needed for generate, but
# prisma.config.ts loads dotenv so we supply a dummy to avoid any env errors)
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    cd packages/database && bunx prisma generate

WORKDIR /app/apps/api

# App Platform injects PORT (default 8080)
EXPOSE 8080

# Run migrations and start API (DATABASE_URL set at runtime)
CMD bunx prisma migrate deploy --schema=../../packages/database/prisma/schema.prisma && bun run src/index.ts
