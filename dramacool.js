var httpsync = require('httpsync');
var cheerio = require('cheerio');

var fileSuffix = '[dramacooldownload.com]'
var dramacoolDomain = 'www.dramacool.com';
var dramacoolPrefix = 'http://www.dramacool.com/embeddrama-';
var dramacoolSuffix = '.html';

var getDownloadUrl = function(dramacoolUrl) {
	if(dramacoolUrl.indexOf('http://') === 0) {
		// URL is correct
	} else {
		dramacoolUrl = 'http://' + dramacoolUrl;
	}
	var req = httpsync.get(dramacoolUrl);
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

	if(downloadUrl) {
		var title = $('.title-detail-ep-film').text().trim();
		title += ' ' + fileSuffix;
		title = encodeURIComponent(title);
		downloadUrl += '&title=' + title;
	}

	return downloadUrl;
};

module.exports.getDownloadUrl = getDownloadUrl;

