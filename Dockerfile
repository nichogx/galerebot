FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /code
COPY ./src/ /code/src/
COPY *.json /code/

RUN yarn install
RUN yarn build
RUN rm -rf ./src
RUN rm -rf tsconfig.json

CMD ["node", "/code/build/src/index.js"]
