FROM mhart/alpine-node:latest

MAINTAINER Mauricio Payetta <mauricio@bithive.io>

# Install native build dependencies for bcrypt, mongoose
RUN apk add --no-cache make gcc g++ python

# Copy package.json and install dependencies
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

# Copy server code and move dependencies to app dir
WORKDIR /opt/app
ADD . /opt/app
RUN mv /tmp/node_modules /opt/app/

# API will listen on port 3000
EXPOSE 3000

CMD ["npm", "start"]
