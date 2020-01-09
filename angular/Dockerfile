FROM node:12.2.0

# set working directory
WORKDIR /angular

# add `/angular/node_modules/.bin` to $PATH
ENV PATH /angular/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /angular/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9 --unsafe
EXPOSE 49153
# add app
ADD . /angular
