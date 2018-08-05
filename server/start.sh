#!/bin/bash
docker run --rm -p 0.0.0.0:9090:9090 -p 127.0.0.1:9229:9229 --name ncaserver --link ncadb:ncadb --link ncaredis:ncaredis -v $PWD:/webapp -w /webapp -it node:7.9.0 npm run debug
