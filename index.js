#!/usr/bin/env node

//## THE SETUP "Character Introduction"
var pkg = require('./package.json')
var program = require("commander");
var chalk = require('chalk')
var mkdirp = require('mkdirp')
var exec = require('child_process').exec
var fs = require('fs')
var tmp = global.process.env.HOME + '/tmp/dumps/'

//## THE CONFRONTATION "Hustle"
program
  .version(pkg.version)
  .description(pkg.description)
  .usage('-u "dbuser" -p "dbpassword" -n "dbname"'+"\n\n\t# Saves a gzip compressed SQL dump of Drupal database \n\t# to: " + tmp + "<dbname>.sql.gz")
  .option('-u, --user <user>', 'MySQL username')
  .option('-p, --password <password>', 'MySQL password')
  .option('-n, --dbname <dbname>', 'MySQL database name')
//  .option('-h, --host <host>', 'MySQL hostname/IP address')
//  .option('-s, --sshuser <sshuser>', 'SSH username')
//  .option('-f, --force', 'clear and recreate cached dump')
//  .option('-c, --cachedir <cachedir>', 'specify cache folder (default is ~/tmp/dumps/)')
  .option('-i, --import', 'import compressed dump file from cache directory into database')
  .option('-d, --dryrun', 'perform a trial run and output debugging')
  .parse(process.argv)

mkdirp(tmp, function (err) {
    if (err) { console.log('Unable to create directory: ' + tmp); exit; }
});


//## THE RESOLUTION "Flow" 
// validate inputs
if (program.dryrun) console.log('# Dry-Run #')

var validated = false;
if (program.user && program.password && program.dbname) validated = true

if (validated) {
  var dumpFilePath = tmp + program.dbname + '.sql.gz'
  /*
  fs.exists(dumpFilePath, function (exists) {
    if (exists) {
      console.log(chalk.red("file exists."))
      if (program.force) {
        exec("rm -f " + dumpFilePath)
        console.log(chalk.green("removed existing"))
      } else {
        result = true
        console.log("Extracted file already exists: " + dumpFilePath)
        exit
      }
    }
    else {
      console.log('File does not exist: ' + dumpFilePath)
    }
  })
  */

 if (program.import) _import(program, dumpFilePath)
 else  _dump(program, dumpFilePath)

}
else {
  program.help()
}

function _import(program, dumpFilePath) {
  var cmd = 'gunzip < ' + dumpFilePath + ' | mysql -u ' + program.user + ' -p'+ program.password + ' ' + program.dbname
  console.log(cmd)
  child = exec(cmd,
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
      }
      else {
        console.log('Dump imported into database "' + program.dbname + '" from: ' + dumpFilePath)
      }
  })

}

function _dump(program, dumpFilePath) {
  var dumpCmd1 = 'drupal_dump_tables=$(mysql -u '+ program.user +' --password="'+ program.password +'" -N <<< "show tables from '+ program.dbname +'" | grep -E "^cache|^table|^watchdog|^sessions" | xargs); mysqldump --skip-events -u '+ program.user +' --password="'+ program.password +'" -d '+ program.dbname +' $drupal_dump_tables | gzip -cf'
  var dumpCmd2 = 'drupal_dump_tables=$(mysql -u '+ program.user +' --password="'+ program.password +'" -N <<< "show tables from '+ program.dbname +'" | grep -Ev "^cache|^table|^watchdog|^sessions" | xargs); mysqldump --skip-events -u '+ program.user +' --password="'+ program.password +'" '+ program.dbname +' $drupal_dump_tables | gzip -cf'

  //ok now pipe it to the file
  var saveCmd1 = dumpCmd1 + '>> ' + dumpFilePath
  var saveCmd2 = dumpCmd2 + '>> ' + dumpFilePath

  var cmd = saveCmd1 + saveCmd2

  if (program.dryrun) console.log('# ' + cmd)
  else {
    exec('rm -f ' + dumpFilePath)

    child = exec(cmd,
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
        }
        else {
          console.log('Dump saved to: ' + dumpFilePath)
        }
    })
  }


}

