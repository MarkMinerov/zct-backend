FROM node:20.10.0

COPY . .
RUN npm i
RUN cd ./cef && npm i && npm run build && mv dist .. && cd ..

CMD ["npm", "run", "prod"]
# CMD ["echo", "hello"]