/* Downloader Implementation for DramaCool.com */

var DownloaderBase = require('./DownloaderBase');
var Downloadables  = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.dramacool.com'];
DownloaderImpl.prototype.getDownloadables = function(url, callback) {
	util.getHtml(url, function(html) {
		var downloadables = [];
		
		var $ = cheerio.load(html);
		var iframes = $('iframe[src]');
		
		var targetIframe = null;
		var targetPrefix = 'http://www.dramacool.com/embeddrama-';
		var targetSuffix = '.html';
		
		for(var i = 0; i < iframes.length; i++) {
			var src = iframes[i].attribs.src;
			if(src.indexOf(targetPrefix) === 0) {
				targetIframe = iframes[i];
				break;
			}
		}
		
		if(targetIframe) {
			var title = $('.title-detail-ep-film').text().trim();
			
			var downloadUrlBase64 = src.substring(targetPrefix.length, src.indexOf(targetSuffix));
			var downloadUrl = new Buffer(downloadUrlBase64, 'base64').toString('utf8');
			downloadUrl += '&title=' + util.buildFilename(title);

			downloadables.push(new Downloadables({
				url: downloadUrl,
				title: title,
				thumbnail: null
			}));
		}

		callback(downloadables);
	});
};

module.exports = new DownloaderImpl();
