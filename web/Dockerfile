FROM node:16.14.2-alpine

WORKDIR /app

ADD .package.json /app/package.json
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
