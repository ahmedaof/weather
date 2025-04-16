FROM node:17.3.0-alpine

RUN mkdir /app/

WORKDIR /app/

COPY . .

RUN npm install 

RUN npm run build

EXPOSE 3000

CMD npm run migration:run && npm run start:prod

