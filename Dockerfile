FROM node:alpine3.15

WORKDIR /code
COPY package.json /code
COPY /node_modules /code
RUN npm install
COPY . /code

CMD ["npm", "start"]