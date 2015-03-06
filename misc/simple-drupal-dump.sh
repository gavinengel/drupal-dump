#!/bin/bash
# version 2015-03-06
# inspired by B2 
# example:
# ./simple-drupal-dump.sh somedatabase someusername somepassword

DUMP_DB=$1;
DUMP_USER=$2;
DUMP_PASS=$3;

# first: get cache tables, so that they can be dumped as schema only
tables=$(mysql -u ${DUMP_USER} --password="${DUMP_PASS}" -N <<< "show tables from ${DUMP_DB}" | grep -E "^cache|^table|^watchdog|^sessions" | xargs); 
# second: dump only schema for cache tables 
mysqldump --skip-events -u $DUMP_USER --password="${DUMP_PASS}" -d $DUMP_DB $tables > $DUMP_DB.sql; 
# third: get non cache tables
tables=$(mysql -u ${DUMP_USER} --password="${DUMP_PASS}" -N <<< "show tables from ${DUMP_DB}" | grep -Ev "^cache|^table|^watchdog|^sessions" | xargs); 
# fourth: dump data, but none of the cache tables ...:
mysqldump --skip-events -u $DUMP_USER --password="${DUMP_PASS}" $DUMP_DB $tables >> $DUMP_DB.sql; 
rm -f ${DUMP_DB}.sql.gz; gzip ${DUMP_DB}.sql; echo "Saved: ${DUMP_DB}.sql.gz";

exit
