#!/bin/sh
projPath="/home/ncawork/ncaserver/ddl/"
workPath="/home/ncawork/databaseddl/ddl/"
for file in `ls $projPath`
do
     if [ ! -f "$workPath$file" ]; then
	      echo "ececute $workPath$file"
        cp $projPath$file $workPath$file
        mysql -h127.0.0.1 -P33306 -uroot -p123456 -Dncadata<$workPath$file 1>>/home/ncawork/databaseddl/sql.log 2>>/home/ncawork/databaseddl/error.log
     fi
done
