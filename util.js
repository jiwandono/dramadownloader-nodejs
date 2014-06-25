var config  = require('./config');
var request = require('request');

module.exports.getHtml = function(url, callback) {
	request.get(url, function(error, response, body) {
		body = body || '';
		callback(body);
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
