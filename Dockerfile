FROM node:18-alpine
ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

COPY --chown=node:node . .
RUN yarn build

USER node
CMD ["yarn", "start"]