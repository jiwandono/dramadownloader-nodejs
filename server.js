var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');
var urlUtil    = require('url');

var config     = require('./config');
var util       = require('./util');

var counter = 0;

var procinfo = {
	startTime: new Date().toString()
};

// TODO Proper monitoring
var monitor = [];

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

		// TODO Proper monitoring
		var monitorEntry = {
			domain: urlUtil.parse(url)['hostname'],
			url: url,
			timestamp: new Date().getTime(),
			success: downloadables.length > 0
		};
		insertMonitorEntry(monitorEntry);

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

app.get('/_procinfo', function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json',
	});

	res.end(JSON.stringify(procinfo));
});

app.get('/_getMonitor', function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json',
	});

	res.end(JSON.stringify(monitor));
});

app.listen(config.port, config.ip, function() {
	console.log((new Date()) + ' Server is listening on port ' + config.port);
});

// TODO Proper monitoring
function insertMonitorEntry(monitorEntry) {
	monitor.push(monitorEntry);

	// Remove expired entries
	// var oneHourAgo = new Date().getTime() - 86400000;
	var toDelete = -1;
	var oneHourAgo = new Date().getTime() - 60000;
	for(var i = 0; i < monitor.length; i++) {
		if(monitor[i].timestamp > oneHourAgo) {
			break;
		}

		toDelete = i;
	}

	if(toDelete >= 0) {
		monitor = monitor.splice(toDelete, monitor.length);
	}
}