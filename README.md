There are some important tasks that need to be carried out when working with <a href="http://piwik.org/" target="_blank">Piwik</a> (particularly when developing against it), such as

* Clearing report data from the UI
* Setting a dashboard layout for all users, or a subset

This module provides a CLI (thanks to <a href="https://www.npmjs.com/package/commander" target="_blank">Commander</a>!) which simplifies these tasks.

It was developed to assist with work being carried out in <a href="http://www.openi-ict.eu/" target="_blank">the OPENi project</a>.
For our use case each user of the platform has their own site, the name of which is set to their login name, e.g. *user<span>@openi.com*.

### Config
The provided config file loads some sensible defaults, but for the piwik password, user, and database it first tries to load them from your local environment variables.

````
var config = {};

config.piwikSQL = {};
config.piwikSQL.host = 'localhost';
config.piwikSQL.user = process.env.PIWIKSQL_USER || 'piwik';
config.piwikSQL.password = process.env.PIWIKSQL_PASSWORD || 'password';
config.piwikSQL.database = process.env.PIWIKSQL_DATABASE || 'piwik';
config.piwikSQL.multipleStatements = 'true';

module.exports = config;
````

### Usage

````
$ node lib/main.js --help

  Usage: main [options] [command]


  Commands:

    copy [options]    copy dashboard template across all users
    reset [options]   reset report data for all sites

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
````

#### Copy Dashboard Across Users

````
$ node lib/main.js copy --help

  Usage: copy [options]

  copy dashboard template across all users

  Options:

    -h, --help              output usage information
    -t, --template [login]  Which dashboard template to use
    -u, --users [logins]    Which users to apply template to,
                            if not specified it defaults to all users
    -i, --ignore [logins]   Which users to ignore

  Examples:
   copy admin dashboard to all users
    $ copy -t admin

   copy admin dashboard to test@openi.com and test2@openi.com
    $ copy -t admin -u test@openi.com,test2@openi.com

   copy admin dashboard to all except test@openi.com
    $ copy -t admin -i test@openi.com
````

#### Reset Dashboard Data

````
$  node lib/main.js reset --help

  Usage: reset [options]

  reset report data for all sites

  Options:

    -h, --help            output usage information
    -s, --sites [logins]  Which sites to reset,
                          if not specified it defaults to all sites

  Examples:

    $ reset
    $ reset -s user1@openi.com,user2@openi.com
````