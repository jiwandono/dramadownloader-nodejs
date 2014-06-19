var urlHelper = require('url');

var DownloaderBase = function() {
	
};

DownloaderBase.prototype.domains = [];
DownloaderBase.prototype.isSupported = function(url) {
	if(typeof url !== 'string') return false;
	
	var parts = urlHelper.parse(url);
	if(parts.hostname) return this.domains.indexOf(parts.hostname) >= 0;
	else return false;
};

DownloaderBase.prototype.getDownloadables = function() {
	throw 'Method not implemented!';
};

module.exports = DownloaderBase;
