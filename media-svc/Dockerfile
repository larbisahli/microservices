FROM node:current-alpine3.15 as BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
COPY ./src/config ./

# Graphql port
EXPOSE 80-80

RUN yarn build

CMD ["yarn", "start"]
