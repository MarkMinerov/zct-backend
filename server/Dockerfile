FROM node:latest

COPY . .
RUN npm i
RUN cd ./cef && npm i && npm run build && mv dist .. && cd ..

CMD ["npm", "run", "prod"]