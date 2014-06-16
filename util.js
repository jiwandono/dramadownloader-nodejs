var config = require('./config');

module.exports.buildFilename = function(title) {
	var filename = title + ' ' + config.fileSuffix;
	filename = encodeURIComponent(filename);
	
	return filename;
};

module.exports.findDownloader = function(url, downloaders) {
	for(var i = 0; i < downloaders.length; i++) {
		if(url.indexOf(downloaders[i].siteUrl) === 0) {
			return downloaders[i];
		}
	}
	
	return null;
};