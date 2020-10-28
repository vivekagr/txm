FROM node:15.0.1-alpine3.11

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app

EXPOSE 5000 35729
