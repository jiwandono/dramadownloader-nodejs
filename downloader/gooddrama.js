/* Downloader Implementation for GoodDrama.net */

var DownloaderBase = require('./DownloaderBase');
var Downloadables  = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.gooddrama.net'];
DownloaderImpl.prototype.getDownloadables = function(url, callback) {
	util.getHtml(url, function(html) {
		var downloadables = [];
		
		var $ = cheerio.load(html);
		var iframes = $('#streams iframe');
		
		var iframePrefix = 'http://videobug.net/embed.php';

		var compatibleIframeNumber = -1;
		for(var i = 0; i < iframes.length; i++) {
			if(iframes[i].attribs.src.indexOf(iframePrefix) === 0) compatibleIframeNumber = i;
		}
		if(compatibleIframeNumber < 0) return downloadables;

		var videoPrefix = 'http://gateway';
		var videoSuffix = 'server%3Dvideobug';
		
		var title = $('h1.generic').text().trim();
		var parts = $($('.part_list')[compatibleIframeNumber]).find('a');

		var remaining = parts.length;
		for(var j = 0; j < parts.length; j++) {
			(function(part) {
				util.getHtml(parts[part].attribs.href, function(partHtml) {
					var $part = cheerio.load(partHtml);
					var iframe = $part('#streams iframe')[compatibleIframeNumber];
					var src = iframe.attribs.src;
					
					util.getHtml(src, function(iframeHtml) {
						var downloadUrl = util.substring(iframeHtml, videoPrefix, videoSuffix);
						downloadUrl = decodeURIComponent(downloadUrl);
						downloadables[part] = new Downloadables({
							url: downloadUrl,
							title: title,
							thumbnail: null
						});

						remaining--;
						if(remaining === 0) {
							callback(downloadables);
						}
					});
				});
			})(j);
		}
	});
};

module.exports = new DownloaderImpl();
