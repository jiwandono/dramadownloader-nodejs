/* Downloader Implementation for DramaGo.com */

var DownloaderBase = require('./DownloaderBase');
var Downloadables  = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.animehere.com'];
DownloaderImpl.prototype.getDownloadables = function(url, callback) {
	util.getHtml(url, function(html) {
		var downloadables = [];

		var $ = cheerio.load(html);
		var iframes = $('#playbox iframe[src]');
		
		var iframePrefixes = [
			'http://videofun.me/embed',
			'http://videobug.net/embed.php',
			'http://play44.net/embed.php',
			'http://byzoo.org/embed.php',
			'http://playpanda.net/embed.php',
			'http://yourupload.com/embed_ext/videoweed/'
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
			null
		];

		var title = $('.tmain h1').text().trim();
		util.getHtml(iframes[compatibleIframeNumber].attribs.src, function(iframeHtml) {
			if(iframePrefixIndex === 5) {
				var $iframe = cheerio.load(iframeHtml);
				var downloadUrl = $iframe('meta[property="og:video"]').attr('content');
				downloadables.push(new Downloadables({
					url: downloadUrl,
					title: title,
					thumbnail: null
				}));
			} else {
				var videoPrefix = 'http://gateway';
				var videoSuffix = 'server%3D'; // Plus one of iframeServers
				var downloadUrl = util.substring(iframeHtml, videoPrefix, videoSuffix + videoServers[iframePrefixIndex]);
				downloadUrl = decodeURIComponent(downloadUrl);
				downloadables.push(new Downloadables({
					url: downloadUrl,
					title: title,
					thumbnail: null
				}));
			}

			callback(downloadables);
		});
	});
};

module.exports = new DownloaderImpl();
