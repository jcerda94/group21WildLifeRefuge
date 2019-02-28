FROM node:alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm --quiet install

COPY img ./img
COPY public ./public
COPY src ./src
COPY sslcerts ./sslcerts
COPY index.js ./

RUN npm run build

ENTRYPOINT [ "node" ]
CMD [ "index.js" ]
