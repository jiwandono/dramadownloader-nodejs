/* Downloader Implementation for DramaGo.com */

var DownloaderBase = require('./DownloaderBase');
var Downloadables   = require('./Downloadables');
var cheerio        = require('cheerio');
var util           = require('../util');

function DownloaderImpl() {}

DownloaderImpl.prototype = new DownloaderBase();
DownloaderImpl.prototype.domains = ['www.animehere.com'];
DownloaderImpl.prototype.getDownloadables = function(url) {
	var downloadables = [];
	
	var iframePrefixes = [
		'http://videofun.me/embed',
		'http://play44.net/embed.php',
		'http://byzoo.org/embed.php'
	];

	var iframeServers = [
		'videofun',
		'play44',
		'byzoo'
	];
	
	var linkPrefix = 'http://gateway';
	var linkSuffix = 'server%3D'; // Plus one of iframeServers

	var html = util.getHtml(url);

	var $ = cheerio.load(html);
	var title = $('.tmain h1').text().trim();
	
	var iframes = $('#playbox iframe[src]');
	var compatibleIframeNumber = -1;

	outerloop:
	for(var i = 0; i < iframes.length; i++) {
		for(var j = 0; j < iframePrefixes.length; j++) {
			if(iframes[i].attribs.src.indexOf(iframePrefixes[j]) === 0) {
				compatibleIframeNumber = i;
				break outerloop;
			}
		}
	}
	if(compatibleIframeNumber < 0) return downloadables;
	
	var iframeHtml = util.getHtml(iframes[compatibleIframeNumber].attribs.src);
	var downloadUrl = util.substring(iframeHtml, linkPrefix, linkSuffix + iframeServers[compatibleIframeNumber]);
	downloadUrl = decodeURIComponent(downloadUrl);
	downloadables.push(new Downloadables({
		url: downloadUrl,
		title: title,
		thumbnail: null
	}));

	return downloadables;
};

module.exports = new DownloaderImpl();
