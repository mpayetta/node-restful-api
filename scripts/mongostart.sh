#!/bin/bash

docker stop mongo_1
docker rm mongo_1
nohup docker run -p 27018:27017 -v /data/mongodb/db:/data/db --name mongo_1 mongo mongod &