/* Downloader Implementation for GoodDrama.net */

var DownloaderBase = require('./DownloaderBase');
var Downloadables   = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.gooddrama.net'];
DownloaderImpl.prototype.getDownloadables = function(url) {
	var downloadables = [];
	
	var iframePrefix = 'http://videobug.net/embed.php';
	
	var linkPrefix = 'http://gateway';
	var linkSuffix = 'server%3Dvideobug';

	var html = util.getHtml(url);

	var $ = cheerio.load(html);
	var title = $('h1.generic').text().trim();
	var parts = $($('.part_list')[0]).find('a');
	for(var j = 0; j < parts.length; j++) {
		parts[j].attribs.href = parts[j].attribs.href.replace('/1-1', ''); // Workaround because httpsync doesn't follow redirect
		var partHtml = util.getHtml(parts[j].attribs.href);
		
		var $part = cheerio.load(partHtml);
		var iframes = $part('iframe[src]');
		for(var i = 0; i < iframes.length; i++) {
			var src = iframes[i].attribs.src;
			if(src.indexOf(iframePrefix) === 0) {
				var iframeHtml = util.getHtml(src);
				var downloadUrl = util.substring(iframeHtml, linkPrefix, linkSuffix);
				downloadUrl = decodeURIComponent(downloadUrl);
				downloadables.push(new Downloadables({
					url: downloadUrl,
					title: title,
					thumbnail: null
				}));
			}
		}
	}

	return downloadables;
};

module.exports = new DownloaderImpl();
