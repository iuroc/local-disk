FROM node
ADD . /usr/src
WORKDIR /usr/src
RUN yarn add typescript -g
RUN yarn add browserify -g
RUN yarn i
EXPOSE 3000
CMD ["npm", "start"]