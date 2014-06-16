var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');
var config     = require('./config');
var dramacool  = require('./dramacool');

var counter = 0;

var app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

app.post('/getDownloadInfo', function(req, res) {
	var url = req.body.url;
	var downloadInfo = null;

	if(url) {
		var success = 0;
		try {
			downloadInfo = dramacool.getDownloadInfo(url);
			success = 1;
		} catch (e) {
			// Do nothing :P
		}
		
		console.log('POST /getDownloadInfo ' + counter + ' ' + success + ' ' + req.body.url);
		counter++;
	}

	var jsonResponse = {'downloadInfo': downloadInfo};

	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(jsonResponse));
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || config.ip;
var port = process.env.OPENSHIFT_NODEJS_PORT || config.port;
app.listen(port, ipaddress, function() {
	console.log((new Date()) + ' Server is listening on port ' + port);
});
