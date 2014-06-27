/* Downloader Implementation for DramaGo.com */

var DownloaderBase = require('./DownloaderBase');
var Downloadables  = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.dramago.com', 'www.gooddrama.net', 'www.animetoon.tv'];
DownloaderImpl.prototype.getDownloadables = function(url, callback) {
	util.getHtml(url, function(html) {
		var downloadables = [];
		
		var $ = cheerio.load(html);
		var iframes = $('#streams iframe');
		
		var iframePrefixes = [
			'http://videofun.me/embed',
			'http://videobug.net/embed.php',
			'http://play44.net/embed.php',
			'http://byzoo.org/embed.php',
			'http://playpanda.net/embed.php'
		];

		var compatibleIframeNumber = -1; // Iframe in the page
		var iframePrefixIndex = -1; // Index in the iframePrefixes array

		outerloop:
		for(var i = 0; i < iframes.length; i++) {
			for(var j = 0; j < iframePrefixes.length; j++) {
				if(iframes[i].attribs.src.indexOf(iframePrefixes[j]) === 0) {
					compatibleIframeNumber = i;
					iframePrefixIndex = j;
					break outerloop;
				}
			}
		}
		
		if(compatibleIframeNumber < 0) {
			callback(downloadables);
			return;
		}
		
		var videoServers = [
			'videofun',
			'videobug',
			'play44',
			'byzoo',
			'vidzur'
		];
		
		var title = $('h1.generic').text().trim();
		
		var parts = $($('.part_list')[compatibleIframeNumber]).find('a');
		if(parts.length > 0) {
			var remaining = parts.length;
			for(var j = 0; j < parts.length; j++) {
				(function(part) {
					util.getHtml(parts[part].attribs.href, function(partHtml) {
						var $part = cheerio.load(partHtml);
						var iframe = $part('#streams iframe')[compatibleIframeNumber];
						var src = iframe.attribs.src;

						util.getHtml(src, function(iframeHtml) {
							var videoPrefix = 'http://gateway';
							var videoSuffix = 'server%3D'; // Plus one of iframeServers
							var downloadUrl = util.substring(iframeHtml, videoPrefix, videoSuffix + videoServers[iframePrefixIndex]);
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
		} else {
			var iframe = $('#streams iframe')[compatibleIframeNumber];
			var src = iframe.attribs.src;

			util.getHtml(src, function(iframeHtml) {
				var videoPrefix = 'http://gateway';
				var videoSuffix = 'server%3D'; // Plus one of iframeServers
				var downloadUrl = util.substring(iframeHtml, videoPrefix, videoSuffix + videoServers[iframePrefixIndex]);
				downloadUrl = decodeURIComponent(downloadUrl);
				downloadables.push(new Downloadables({
					url: downloadUrl,
					title: title,
					thumbnail: null
				}));

				callback(downloadables);
			});
		}
	});
};

module.exports = new DownloaderImpl();
