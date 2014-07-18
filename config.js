module.exports.ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP   || '0.0.0.0';
module.exports.port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 6667;

module.exports.mysql_hostname = process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost';
module.exports.mysql_port     = process.env.OPENSHIFT_MYSQL_DB_PORT || '3306';
module.exports.mysql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME || '';
module.exports.mysql_password = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '';
module.exports.mysql_database = process.env.OPENSHIFT_MYSQL_DB_DATABASE || '';

module.exports.fileSuffix = '[DramaDownloader.com]';
module.exports.downloaders = [
	require('./downloader/dramacool'),
	require('./downloader/dramago'),
	require('./downloader/animehere')
];