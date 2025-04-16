# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build && \
	npm prune --omit-dev --legacy-peer-deps && \
	npx drizzle-kit generate && \
	npx drizzle-kit migrate

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/local.db .

ENV NODE_ENV=dev
ENV PORT=3000
EXPOSE 3000

CMD ["node", "build"]
