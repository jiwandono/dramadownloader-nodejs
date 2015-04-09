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

		if(!html) {
			callback(downloadables);
			return;
		}
		
		var $ = cheerio.load(html);
		
		var title = $('.title-detail-ep-film').text().trim();
		if(title == '') {
			title = $('.movie-detail > span.title').first().text();
		}

		// Method 1: Find <video> tag, extract source URL.
		var downloadUrl = $('video source').attr('src');
		
		if(downloadUrl) {
			downloadUrl += '&title=' + util.buildFilename(title);
			downloadables.push(new Downloadables({
				url: downloadUrl,
				title: title,
				thumbnail: null
			}));
		}

		if(downloadables.length === 0) {
			// Method 2: Base64Decode part of iframe src.
			var downloadUrlBase64 = $('iframe[src*="embeddrama.php"], iframe[src*="embed1ads.php"]').attr('src');
			var downloadUrlBase64 = $('iframe[src*="embeddrama.php"], iframe[src*="newembeddrama.php"], iframe[src*="embed1ads.php"]').attr('src');
			if(downloadUrlBase64) {
				var pos = downloadUrlBase64.search("\\?id=");
				var downloadUrl = new Buffer(downloadUrlBase64.substr(pos + "?id=".length), 'base64').toString('ascii');
				downloadUrl += '&title=' + util.buildFilename(title);
				downloadables.push(new Downloadables({
					url: downloadUrl,
					title: title,
					thumbnail: null
				}));
			}
		}

		if(downloadables.length === 0) {
			// Method 3: Deduce download links from embedeuxN.php?video=VIDEO_ID
			var embedeuxs = $('iframe[src*=embedeux]');
			if(embedeuxs.length > 0) {
				// Pick the first
				var src = $(embedeuxs[0]).attr('src');
				var nodeId = src[src.search('\\.php') -1];
				var videoId = src.split('?')[1].split('&')[0].substr(6); // get part after video=
				downloadUrl = 'http://store' + nodeId + '.dramaupload.com/video-' + videoId + '.mp4';
				downloadables.push(new Downloadables({
					url: downloadUrl,
					title: title,
					thumbnail: null
				}));
			}
		}

		if(downloadables.length === 0) {
			// Method 3: Extract video link from embed page
			var embedScript = $('input[value*="embed"]').val();
			if(embedScript) {
				var embedPage = cheerio.load(embedScript)('iframe').attr('src');
				util.getHtml(embedPage, function(embedHtml) {
					var $$ = cheerio.load(embedHtml);
					var flashvars = $$('embed').attr('flashvars');
					if(typeof flashvars === 'undefined') {
						downloadUrl = $$('video source').attr('src');
						downloadables.push(new Downloadables({
							url: downloadUrl,
							title: title,
							thumbnail: null
						}));
					} else {
						var flashvarsDecoded = decodeURIComponent(flashvars);
						downloadUrl = flashvarsDecoded.split('|')[1];
						downloadables.push(new Downloadables({
							url: downloadUrl,
							title: title,
							thumbnail: null
						}));
					}

					// Alter filename
					for(i in downloadables) {
						if(downloadables[i].url.indexOf('redirector.googlevideo.com') > 0) {
							downloadables[i].url += '&title=' + util.buildFilename(title);
						}
					}

					callback(downloadables);
				});
			} else {
				callback(downloadables);
			}
		} else {
			callback(downloadables);
		}
	});
};

module.exports = new DownloaderImpl();
