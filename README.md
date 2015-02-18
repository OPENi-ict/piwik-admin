There are some important tasks that need to be carried out when working with [Piwik](http://piwik.org/) (particularly when developing against it), such as

* Clearing report data from the UI
* Setting a dashboard layout for all users, or a subset

This module provides a CLI (thanks to [Commander](https://www.npmjs.com/package/commander)!) which simplifies these tasks

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

### Copy Dashboard Across Users

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

    $ copy -t admin
    $ copy -t admin -u test@openi.com,test2@openi.com
    $ copy -t admin -i test@openi.com
````

### Reset Dashboard Data

````
$  node lib/main.js reset --help

  Usage: reset [options]

  reset report data for all sites

  Options:

    -h, --help            output usage information
    -s, --sites [logins]  Which sites to reset, if not specified it defaults to all sites

  Examples:

    $ reset -s all
    $ reset -s user1@openi.com,user2@openi.com
````