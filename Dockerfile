FROM node
WORKDIR /usr/src
RUN npm config set registry https://registry.npm.taobao.org
RUN npm i typescript -g
RUN npm i browserify -g
RUN npm i
EXPOSE 3000
CMD ["npm", "start"]