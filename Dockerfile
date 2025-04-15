# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build && npx drizzle-kit generate && npx drizzle-kit migrate

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/local.db .

ENV NODE_ENV=dev
ENV PORT=3000
EXPOSE 3000

CMD ["node", "build"]
