var httpsync = require('httpsync');
var cheerio = require('cheerio');
var config = require('./config');

var dramacoolDomain = 'www.dramacool.com';
var dramacoolPrefix = 'http://www.dramacool.com/embeddrama-';
var dramacoolSuffix = '.html';

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
			if(src.indexOf(dramacoolPrefix) === 0) {
				var downloadUrlBase64 = src.substring(dramacoolPrefix.length, src.indexOf(dramacoolSuffix));
				downloadUrl = new Buffer(downloadUrlBase64, 'base64').toString('utf8');
			}
		}
	}
	
	var downloadInfo = null;

	if(downloadUrl) {
		var title = $('.title-detail-ep-film').text().trim();
		var filename = title + ' ' + config.fileSuffix;
		filename = encodeURIComponent(filename);
		downloadUrl += '&title=' + filename;
		
		downloadInfo = {
			url: downloadUrl,
			title: title,
			thumbnail: null
		};
	}

	return downloadInfo;
};

module.exports.getDownloadInfo = getDownloadInfo;

