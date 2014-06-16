var httpsync = require('httpsync');
var cheerio  = require('cheerio');
var util     = require('./util');

var siteUrl = 'http://www.dramacool.com/';

var targetPrefix = 'http://www.dramacool.com/embeddrama-';
var targetSuffix = '.html';

var getDownloadInfo = function(url) {
	if(url.indexOf('http://') === 0) {
		// URL is correct
	} else {
		url = 'http://' + url;
	}
	var req = httpsync.get(url);
	var res = req.end();

	var html = res.data.toString('utf8');
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

module.exports.getDownloadInfo = getDownloadInfo;
module.exports.siteUrl = siteUrl;

