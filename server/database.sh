#!/bin/bash
docker run --rm -p 127.0.0.1:33306:3306 --name testsql -v $PWD/mysql/logs:/logs -v $PWD/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql

docker run --rm -p 6379:6379 --name redis -d redis
