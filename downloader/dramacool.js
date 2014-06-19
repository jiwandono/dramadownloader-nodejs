/* Downloader Implementation for DramaCool.com */

var DownloaderBase = require('./DownloaderBase');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.dramacool.com'];
DownloaderImpl.prototype.getDownloadables = function(url) {
	var targetPrefix = 'http://www.dramacool.com/embeddrama-';
	var targetSuffix = '.html';

	var html = util.getHtml(url);
	var downloadUrl = null;

	var $ = cheerio.load(html);
	var iframes = $('iframe');
	for(var i = 0; i < iframes.length; i++) {
		var src = iframes[i].attribs.src;
		if(src) {
			if(src.indexOf(targetPrefix) === 0) {
				var downloadUrlBase64 = src.substring(targetPrefix.length, src.indexOf(targetSuffix));
				downloadUrl = new Buffer(downloadUrlBase64, 'base64').toString('utf8');
			}
		}
	}
	
	var downloadInfo = null;

	if(downloadUrl) {
		var title = $('.title-detail-ep-film').text().trim();
		downloadUrl += '&title=' + util.buildFilename(title);
		
		downloadInfo = {
			url: downloadUrl,
			title: title,
			thumbnail: null
		};
	}

	return downloadInfo;
};

module.exports = new DownloaderImpl();