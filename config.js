module.exports.ip = '0.0.0.0';
module.exports.port = 8080;

module.exports.fileSuffix = '[DramaDownloader.com]';
module.exports.downloaders = [
	require('./downloader/dramacool'),
	require('./downloader/dramago'),
	require('./downloader/gooddrama'),
	require('./downloader/animehere')
];