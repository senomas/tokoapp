FROM node:lts-slim

WORKDIR /app

ADD package.json /app/
ADD package-lock.json /app/

RUN npm install

ADD .eslintrc.cjs /app/
ADD tsconfig.json /app/
ADD .env.docker /app/.env
ADD svelte.config.js /app/
ADD tailwind.config.cjs /app/
ADD postcss.config.cjs /app/
ADD static /app/static
ADD src /app/src

RUN npm run build

CMD node build/index.js
