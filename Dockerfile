FROM node:16

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Ensure devDependencies are installed
RUN npm install -g pnpm && NODE_ENV=development pnpm install

# Explicitly install vite
RUN pnpm add vite --save-dev

COPY . .

RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "preview"]