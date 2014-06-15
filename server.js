var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');
var dramacool  = require('./dramacool');

var app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

app.post('/getDownloadUrl', function(req, res) {
	console.log('POST /getDownloadUrl');
	console.dir(req.body);

	var dramacoolUrl = req.body.dramacoolUrl;
	var downloadUrl = null;

	if(dramacoolUrl) {
		try {
			downloadUrl = dramacool.getDownloadUrl(dramacoolUrl);
		} catch (e) {
			// Do nothing :P
		}
	}

	var jsonResponse = {'downloadUrl': downloadUrl};

	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(jsonResponse));
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
