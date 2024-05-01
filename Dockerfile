FROM node:20.12.1

WORKDIR /app

COPY . .
RUN npm install -g pnpm
RUN pnpm i
RUN pnpm build

EXPOSE 8080

CMD ["npm", "run", "preview"]