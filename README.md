There are some important tasks that need to be carried out when working with Piwik (particularly when developing against it), such as

* Clearing report data from the UI
* Setting a dashboard layout for all users, or a subset

This module provides a CLI (thanks to Commander!) which simplifies these tasks

```shell
$ node lib/main.js --help

 Usage: main [options] [command]


  Commands:

    copy [options]    copy dashboard template across all users
    reset [options]   reset report data for all sites

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```