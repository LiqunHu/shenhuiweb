#!/bin/bash
docker kill $(docker ps -a -q)

docker rm $(docker ps -a -q)

docker run --rm -p 0.0.0.0:33306:3306 --name mvnndb -v $PWD/mysql/logs:/logs -v $PWD/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7

sleep 20

docker run --rm -it --link mvnndb:mvnndb -v $PWD/sql:/sql  mysql:5.7 bash -c "mysql -hmvnndb -uroot -p123456</sql/sequence.sql"

docker run --rm --name mvnnredis -d redis:3.2.8

rm -rf node_modules

docker run --rm -v $PWD:/webapp -w /webapp node:8.1 npm install

docker run --rm --link mvnndb:mvnndb --link mvnnredis:mvnnredis -v $PWD:/webapp -w /webapp node:8.1 node init-db

docker run --rm --link mvnndb:mvnndb --link mvnnredis:mvnnredis -v $PWD:/webapp -w /webapp node:8.1 node init-data

docker run --rm -p 0.0.0.0:9090:9090 -p 127.0.0.1:9229:9229 --name mvnnserver --link mvnndb:mvnndb --link mvnnredis:mvnnredis -v $PWD:/webapp -w /webapp -it node:8.1 npm run debug
