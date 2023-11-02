FROM node:current-alpine3.15 as BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# gRPC port
EXPOSE 50051-50051

RUN yarn build

CMD ["yarn", "start"]
