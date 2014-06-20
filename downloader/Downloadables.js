var urlHelper = require('url');

var DownloadInfo = function(values) {
	this.url       = values.url;
	this.title     = values.title;
	this.thumbnail = values.thumbnail;
};

DownloadInfo.prototype.url       = null;
DownloadInfo.prototype.title     = null;
DownloadInfo.prototype.thumbnail = null;

module.exports = DownloadInfo;
