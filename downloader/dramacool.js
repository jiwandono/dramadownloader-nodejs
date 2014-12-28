/* Downloader Implementation for DramaCool.com */

var DownloaderBase = require('./DownloaderBase');
var Downloadables  = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.dramacool.com', 'www.dramacool.tv', 'dramacool.tv', 'anime4you.net', 'www.anime4you.net'];
DownloaderImpl.prototype.getDownloadables = function(url, callback) {
	util.getHtml(url, function(html) {
		var downloadables = [];
		
		var $ = cheerio.load(html);
		
		// Method 1: Find <video> tag, extract source URL.
		var downloadUrl = $('video source').attr('src');
		
		if(downloadUrl) {
			var title = $('.title-detail-ep-film').text().trim();
			downloadUrl += '&title=' + util.buildFilename(title);
			downloadables.push(new Downloadables({
				url: downloadUrl,
				title: title,
				thumbnail: null
			}));
		} else {
			// Method 2: Base64Decode part of iframe src.
			var downloadUrlBase64 = $('iframe[src*="embeddrama.php"], iframe[src*="embed1ads.php"]').attr('src');
			if(downloadUrlBase64) {
				var pos = downloadUrlBase64.search("\\?id=");
				var downloadUrl = new Buffer(downloadUrlBase64.substr(pos + "?id=".length), 'base64').toString('ascii');
				var title = $('.title-detail-ep-film').text().trim();
				downloadUrl += '&title=' + util.buildFilename(title);
				downloadables.push(new Downloadables({
					url: downloadUrl,
					title: title,
					thumbnail: null
				}));
			}
		}

		callback(downloadables);
	});
};

module.exports = new DownloaderImpl();
