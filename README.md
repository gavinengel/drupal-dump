# drupal-dump
Dump & compress a Drupal database

[![npm version](https://badge.fury.io/js/drupal-dump.svg)](http://badge.fury.io/js/drupal-dump)

## Usage
```
  Usage: drupal-dump -u "dbuser" -p "dbpassword" -n "dbname"

	# Saves a gzip compressed SQL dump of Drupal database 
	# to: /home/gavin/tmp/dumps/<dbname>.sql.gz

  Dump & compress a Drupal database

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -u, --user <user>          MySQL username
    -p, --password <password>  MySQL password
    -n, --dbname <dbname>      MySQL database name
    -d, --dryrun               perform a trial run and output debugging
```

## Alternatives
These are alternative projects which can yield achieve a similar result:
* https://www.npmjs.com/package/drush-reloadp
* http://dev.mysql.com/doc/refman/5.1/en/mysqldump.html 

## License

(The MIT License)
Copyright (c) 2015 Gavin Engel <<gavin@engel.com>>

See: http://opensource.org/licenses/MIT

