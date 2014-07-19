/* Downloader Implementation for DramaGo.com and similar sites */

var DownloaderBase = require('./DownloaderBase');
var Downloadables  = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.dramago.com', 'www.gooddrama.net', 'www.animetoon.tv', 'www.anime44.com', 'www.yodrama.com', 'dramafire.com'];
DownloaderImpl.prototype.getDownloadables = function(url, callback) {
	util.getHtml(url, function(html) {
		var downloadables = [];
		
		var $ = cheerio.load(html);
		var iframes = $('#streams iframe, .entry iframe'); // '.entry iframe' is specific for dramafire.com
		
		var iframePrefixes = [
			'http://videofun.me/embed',
			'http://videobug.net/embed.php',
			'http://play44.net/embed.php',
			'http://byzoo.org/embed.php',
			'http://playpanda.net/embed.php',
			'http://yourupload.com/embed/',
			'http://embed.yucache.net/'
		];

		var compatibleIframeNumber = -1; // Iframe in the page
		var iframePrefixIndex = -1; // Index in the iframePrefixes array

		outerloop:
		for(var i = 0; i < iframePrefixes.length; i++) {
			for(var j = 0; j < iframes.length; j++) {
				if(iframes[j].attribs.src.indexOf(iframePrefixes[i]) === 0) {
					compatibleIframeNumber = j;
					iframePrefixIndex = i;
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
			'vidzur',
			null,
			null
		];
		
		var title = $('h1.generic, h1.title').text().trim();
		
		// .part_list and part_nav are mutually exclusive.
		var parts = $($('.part_list, .part_nav')[compatibleIframeNumber]).find('a');
		if(parts.length > 0) {
			var remaining = parts.length;
			for(var j = 0; j < parts.length; j++) {
				(function(part) {
					util.getHtml(parts[part].attribs.href, function(partHtml) {
						var $part = cheerio.load(partHtml);
						var iframe = $part('#streams iframe')[compatibleIframeNumber];
						var src = iframe.attribs.src;

						util.getHtml(src, function(iframeHtml) {
							var downloadUrl = null;
							if(iframePrefixIndex === 5 || iframePrefixIndex === 6) {
								downloadUrl = extractMethodB(iframeHtml);
							} else {
								downloadUrl = extractMethodA(iframeHtml, videoServers[iframePrefixIndex]);
							}
							
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
			var iframe = iframes[compatibleIframeNumber];
			var src = iframe.attribs.src;

			util.getHtml(src, function(iframeHtml) {
				var downloadUrl = null;
				if(iframePrefixIndex === 5 || iframePrefixIndex === 6) {
					downloadUrl = extractMethodB(iframeHtml);
				} else {
					downloadUrl = extractMethodA(iframeHtml, videoServers[iframePrefixIndex]);
				}
				
				if(downloadUrl) {
					downloadables.push(new Downloadables({
						url: downloadUrl,
						title: title,
						thumbnail: null
					}));
				}

				callback(downloadables);
			});
		}
	});
};


// TODO: Modularize these URL extractor function.
var extractMethodA = function(html, videoServer) {
	var videoPrefix = 'http://gateway';
	var videoSuffix = 'server%3D'; // Plus one of iframeServers
	var downloadUrl = util.substring(html, videoPrefix, videoSuffix + videoServer);
	downloadUrl = decodeURIComponent(downloadUrl);
	
	return downloadUrl;
};

var extractMethodB = function(html) {
	var $iframe = cheerio.load(html);
	var downloadUrl = $iframe('meta[property="og:video"]').attr('content');
	
	return downloadUrl;
};

module.exports = new DownloaderImpl();
