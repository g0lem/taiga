FROM ubuntu
ENV root /taiga
WORKDIR ${root}   # WORKDIR /bar


RUN apt-get install -y nodejs mongodb
RUN add-apt-repository ppa:chris-lea/node.js
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y nodejs
RUN npm install
RUN service mongodb start
RUN npm start