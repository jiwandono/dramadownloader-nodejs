var config  = require('./config');
var request = require('request');

var requestOptions = {
	jar: true,
	headers: {
		'Connection': 'keep-alive',
		'Cache-Control': 'max-age=0',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
		'Referer': 'https://www.google.com/',
		//'Accept-Encoding': 'gzip, deflate',
		'Accept-Language': 'en-US,en;q=0.8'
	}
};
var request = request.defaults(requestOptions);

module.exports.getHtml = function(url, callback) {
	request.get(url, function(error, response, body) {
		body = body || '';
		callback(body);
	});
};

module.exports.getRawHttp = function(url, callback) {
	request.get(url, function(error, response, body) {
		callback(error, response);
	});
};

module.exports.buildFilename = function(title) {
	var filename = title + ' ' + config.fileSuffix;
	filename = encodeURIComponent(filename);
	
	return filename;
};

module.exports.findDownloader = function(url) {
	for(var i = 0; i < config.downloaders.length; i++) {
		if(config.downloaders[i].isSupported(url)) return config.downloaders[i];
	}
	
	return require('./downloader/null');
};

module.exports.substring = function(string, beginsWith, endsWith) {
	var offset1 = string.indexOf(beginsWith);
	var offset2 = string.indexOf(endsWith);
	
	if(offset1 >= 0 && offset2 > offset1) {
		offset2 += endsWith.length;
		return string.substring(offset1, offset2);
	}
	
	return null;
};
