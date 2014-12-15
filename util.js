var config  = require('./config');
var request = require('request');

module.exports.getHtml = function(url, callback) {
	request({
		url: url,
		headers: {
			'Connection': 'keep-alive',
			'Cache-Control': 'max-age=0',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
			'Referer': 'https://www.google.com/',
			//'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'en-US,en;q=0.8',
			'Cookie': 'incap_ses_133_252730=SAzHXTPulzl1ZqoBhoTYAVECj1QAAAAAiQn6owzxSAu68+I8BC73Fg==; incap_ses_151_252730=WyPvNwR9eRe9GluXE34YAlgCj1QAAAAAh+s81MdAyLe0tyJpygTuzA==; _gat=1; __utmt=1; __utma=156337646.798789012.1418658390.1418658390.1418658390.1; __utmb=156337646.8.10.1418658390; __utmc=156337646; __utmz=156337646.1418658390.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga=GA1.2.798789012.1418658390; visid_incap_252730=1DKgAzlTTbeBgp26Nbnup1ECj1QAAAAAQUIPAAAAAADy1UXtOKpLteQrRTVbkYkW; incap_ses_128_252730=grjDFFUfqjN8lUVKu8DGAXkGj1QAAAAAoeKPry/0LcxBIf3/VnJlkA=='
		}
	}, function(error, response, body) {
		body = body || '';
		callback(body);
	});
};

module.exports.buildFilename = function(title) {
	var filename = title + ' ' + config.fileSuffix;
	filename = encodeURIComponent(filename);
	
	return filename;
};

module.exports.findDownloader = function(url) {
	for(var i = 0; i < config.downloaders.length; i++) {
		if(config.downloaders[i].isSupported(url)) return config.downloaders[i];
	}
	
	return require('./downloader/null');
};

module.exports.substring = function(string, beginsWith, endsWith) {
	var offset1 = string.indexOf(beginsWith);
	var offset2 = string.indexOf(endsWith);
	
	if(offset1 >= 0 && offset2 > offset1) {
		offset2 += endsWith.length;
		return string.substring(offset1, offset2);
	}
	
	return null;
};
