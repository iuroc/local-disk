FROM node
ADD . /usr/src
WORKDIR /usr/src
RUN yarn config set registry http://registry.npm.taobao.org/
RUN yarn add typescript -g
RUN yarn add browserify -g
RUN yarn add
EXPOSE 3000
CMD ["npm", "start"]