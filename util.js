var httpsync = require('httpsync');
var config  = require('./config');

module.exports.getHtml = function(url) {
	var req = httpsync.get(url);
	var res = req.end();
	var html = res.data.toString('utf8');
	return html;
};

module.exports.buildFilename = function(title) {
	var filename = title + ' ' + config.fileSuffix;
	filename = encodeURIComponent(filename);
	
	return filename;
};

module.exports.findDownloader = function(url, downloaders) {
	for(var i = 0; i < downloaders.length; i++) {
		if(downloaders[i].isSupported(url)) return downloaders[i];
	}
	
	return null;
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
