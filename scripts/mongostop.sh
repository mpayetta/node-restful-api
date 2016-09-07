#!/bin/bash

docker stop mongo_1
docker rm mongo_1

echo "MongoDB stopped successfully and removed container"