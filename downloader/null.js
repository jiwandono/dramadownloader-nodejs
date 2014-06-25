/* Null Downloader Implementation */

var DownloaderBase = require('./DownloaderBase');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = [];
DownloaderImpl.prototype.getDownloadables = function(url, callback) {
	callback([]);
};

module.exports = new DownloaderImpl();
