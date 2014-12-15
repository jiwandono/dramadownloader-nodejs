var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');

var config     = require('./config');
var util       = require('./util');

var counter = 0;

var app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

app.post('/getDownloadables', function(req, res) {
	var remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
	var url = (req.body.url || '').trim();
	if(url.indexOf('http://') !== 0) url = 'http://' + url;

	var downloader = util.findDownloader(url);
	downloader.getDownloadables(url, function(downloadables) {
		var status = downloadables.length > 0 ? 'D_SUCCESS' : 'D_FAIL';
		console.log((new Date()) + ' POST /getDownloadInfo ' + counter + ' ' + status + ' ' + remoteAddress + ' ' + req.body.url);
		counter++;

		var jsonResponse = {'downloadables': downloadables};
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': config.cors_origin,
			'Vary': 'Origin'
		});
		res.end(JSON.stringify(jsonResponse));
	});
});

app.get('/_getRawHttp', function(req, res) {
	util.getRawHttp(req.query.url, function(error, response) {
		var jsonResponse = {
			'error': error,
			'response': response
		};
		res.writeHead(200, {
			'Content-Type': 'application/json',
		});
		res.end(JSON.stringify(jsonResponse));
	});
});

app.listen(config.port, config.ip, function() {
	console.log((new Date()) + ' Server is listening on port ' + config.port);
});
