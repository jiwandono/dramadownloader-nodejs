var cheerio  = require('cheerio');
var util     = require('./util');

var siteUrl = 'http://dramafire.com/';

var targetPrefix = 'http://www.mp4upload.com/';

var linkPrefix = '\'file\': \'';
var linkSuffix = 'video.mp4';

var getDownloadInfo = function(url) {
	var html = util.getHtml(url);
	var downloadUrl = null;

	var $ = cheerio.load(html);
	var iframes = $('iframe');
	for(var i = 0; i < iframes.length; i++) {
		var src = iframes[i].attribs.src;
		if(src) {
			if(src.indexOf(targetPrefix) === 0) {
				var mp4Html = util.getHtml(src);
				var offset1 = mp4Html.indexOf(linkPrefix) > 0 ? mp4Html.indexOf(linkPrefix) + linkPrefix.length : -1;
				var offset2 = mp4Html.indexOf(linkSuffix) > 0 ? mp4Html.indexOf(linkSuffix) + linkSuffix.length : -1;
				if(offset1 > 0 && offset2 > 0 && offset1 < offset2) {
					downloadUrl = mp4Html.substring(offset1, offset2);
					break;
				}
			}
		}
	}
	
	var downloadInfo = null;

	if(downloadUrl) {
		var title = $('.title').text().trim();
		var filename = util.buildFilename(title) + '.mp4';
		downloadUrl = downloadUrl.replace('video.mp4', filename);
		
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
