var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');

var config     = require('./config');
var util       = require('./util');

var downloaders = [
	require('./downloader/dramacool'),
	require('./downloader/dramago')
];

var counter = 0;

var app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

app.post('/getDownloadables', function(req, res) {
	var url = req.body.url;
	var downloadables = null;

	if(url) {
		if(url.indexOf('http://') === 0) {
			// URL is correct
		} else {
			url = 'http://' + url;
		}
		
		var downloader = util.findDownloader(url, downloaders);
		if(downloader !== null) {
			try {
				downloadables = downloader.getDownloadables(url);
			} catch (e) {
				// Do nothing :P
			}
		}
		
		var status = downloadables ? 'D_SUCCESS' : 'D_FAIL';
		console.log('POST /getDownloadInfo ' + counter + ' ' + status + ' ' + req.body.url);
		counter++;
	}

	var jsonResponse = {'downloadables': downloadables};

	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(jsonResponse));
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || config.ip;
var port = process.env.OPENSHIFT_NODEJS_PORT || config.port;
app.listen(port, ipaddress, function() {
	console.log((new Date()) + ' Server is listening on port ' + port);
});
