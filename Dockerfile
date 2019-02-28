FROM node:alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm --quiet install

COPY img ./img
COPY public ./public
COPY src ./src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
