#! /usr/bin/env node

var mysql      = require('mysql');
var _ = require('lodash');
var async = require('async');
var piwik = {};
var program = require('commander');
var config = require('./config');
var connection = mysql.createConnection(config.piwikSQL);


function list(val) {
   return val.split(',');
}

program
   .version('0.2.0');

program
   .command('copy')
   .description('copy dashboard template across all users')
   .option("-t, --template [login]", "Which dashboard template to use")
   .option("-u, --users [logins]", "Which users to apply template to", list)
   .option("-i, --ignore [logins]", "Which users to ignore", list)
   .action(function(options){
      var users = options.users || "all";
      setDashboard({master: options.template, users: users, ignore: options.ignore});
   }).on('--help', function() {
      console.log('  Examples:');
      console.log();
      console.log('    $ copy -t admin');
      console.log('    $ copy -t admin -i test@openi.com');
      console.log('    $ copy -t admin -u test@openi.com');
   });

program
   .command('reset')
   .description('reset report data for all sites')
   .option("-s, --sites [logins]", "Which sites to reset", list)
   .action(function(options){
      var sites = options.sites || "all";
      console.log(sites);
      if(sites === 'all') {
         reset({all: true});
      } else {
         reset({all: false, sites: sites});
      }

   }).on('--help', function() {
      console.log('  Examples:');
      console.log();
      console.log('    $ reset');
      console.log('    $ reset -s user1@openi.com,user2@openi.com');
   });

program.parse(process.argv);


function reset(params) {

   connection.connect(function(err) {
      if (err) {
         console.error('error connecting: ' + err.stack);
         return;
      }
   });

   async.waterfall([
         async.apply(getArchives, params),
         getSites,
         clear
      ],
      function(err, result){
         if (err) {
            console.log('Error: ' + err);
            connection.end();
         } else {
            if (result) {
               console.log('sucess');
               connection.end(function(err) {
                  if (err) {
                     console.log(err);
                  }
               });
            }
         }
      });
}


function clear(params, callback) {
   var arr = [];
   var rowsAffected = [];
   arr.push('DELETE FROM piwik_log_visit WHERE idsite IN (' + params.sites.join(', ') + ')');
   arr.push('DELETE FROM piwik_log_link_visit_action WHERE idsite IN (' + params.sites.join(', ') + ')');
   arr.push('DELETE FROM piwik_log_conversion WHERE idsite IN (' + params.sites.join(', ') + ')');
   arr.push('DELETE FROM piwik_log_conversion_item WHERE idsite IN (' + params.sites.join(', ') + ')');
   arr.push('DROP TABLE ' + params.archives.join(', ') + ';');
   var sql = arr.join(';');

   connection.query(sql, function(err, results) {
      if (err) throw err;
      rowsAffected = _.pluck(results, 'affectedRows');
      return callback(null, rowsAffected);
   });

}


function getArchives(params, callback) {
   var archives = [];
   connection.query('SHOW TABLES', function(err, rows) {
      if (err) throw err;

      _.forEach(_.pluck(rows, 'Tables_in_plugins'), function(n) {
         if (_.contains(n, 'archive')) {
            archives.push(n);
         }
      });

      params.archives = archives;
      return callback(null, params);
   });

}


function getSites(params, callback) {
   var sites = [];
   if (params.all === true) {
      connection.query('SELECT idsite FROM piwik_site', function(err, rows) {
         if (err) throw err;
         sites = _.pluck(rows, 'idsite');

         params.sites = sites;
         return callback(null, params);
      });
   } else {
      connection.query('SELECT idsite FROM piwik_site WHERE name IN (?)', [params.sites], function(err, rows) {
         if (err) throw err;
         sites = _.pluck(rows, 'idsite');

         params.sites = sites;
         return callback(null, params);
      });
   }
}



function getLayout(params, callback) {

   connection.query('SELECT layout FROM piwik_user_dashboard WHERE login = ?', params.master, function(err, rows) {
      if (err) throw err;
      params.layout = rows[0].layout;
      return callback(null, params);
   });
}

function getUsers(params, callback) {

   var whiteList = ['anonymous'];

   if (params.users === 'all') {
      if (params.ignore !== undefined) {
         whiteList.push(params.master);
         whiteList = _.union(whiteList, params.ignore);
      } else {
         whiteList.push(params.master);
      }
   } else {
      params.logins = params.users;
      return callback(null, params);
   }

   connection.query("SELECT login FROM piwik_user WHERE login NOT IN (?)", [whiteList], function(err, rows) {
      if (err) throw err;

      params.logins = _.map(rows, function (n) {
         return (n.login);
      });
      return callback(null, params);
   });
}

function setUserDashboards(params, callback) {



   async.each(params.logins, function(login, callback) {
      connection.query('INSERT INTO piwik_user_dashboard SET login = ?, iddashboard = ?, layout = ? ON DUPLICATE KEY UPDATE login = ?', [login, 1, params.layout, login], function(err, rows) {
         if (err) callback(err);
         else {
            return callback(null);
         }
      });
   }, function(error) {
         if (error) {
            console.log(error);
         }
         else {
            console.log('success');
            return callback(null, params);
         }
      }
   );
}


function setDashboard(params) {


   connection.connect(function(err) {
      if (err) {
         console.error('error connecting: ' + err.stack);
      }
   });

   async.waterfall([
         async.apply(getUsers, params),
         getLayout,
         setUserDashboards
      ],
      function(err, result){
         if (err) {
            console.log('Error: ' + err);
            connection.end();
         } else {
            if (result) {
               console.log('success');
               connection.end(function(err) {
                  if (err) {
                     console.log(err);
                  }
               });
            }
         }
      });
}