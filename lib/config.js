var config = {};

config.piwikSQL = {};
config.piwikSQL.host = 'localhost';
config.piwikSQL.user = process.env.PIWIKSQL_USER || 'piwik';
config.piwikSQL.password = process.env.PIWIKSQL_PASSWORD || 'password';
config.piwikSQL.database = process.env.PIWIKSQL_DATABASE || 'piwik';
config.piwikSQL.multipleStatements = 'true';

module.exports = config;