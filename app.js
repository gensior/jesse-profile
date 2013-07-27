var express = require('express'),
    moment = require('moment'),
    plates = require('plates'),
    fs = require('fs'),
    AWS = require('aws-sdk'),
    app = express();

AWS.config.update({credentials: {accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY}});
AWS.config.update({region: 'us-west-2'});
var db = new AWS.DynamoDB({apiVersion: '2012-04-04'});

var template = fs.readFileSync("templates/base.html", "utf-8");

// root GET
app.get('/', function ( req, res ) {
	var body = plates.bind(template, {main: "Hello from the index page."});
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', body.length);
	res.end(body);
	console.log('root');
});

// Test dynamoDB
app.get('/dynamo', function (req, res) {
	var body = "";
	res.setHeader('Content-Type', 'text/html');
	db.listTables(function (err, data) {
		if (!err) {
			var arr = data.TableNames;
			var length = arr.length,
				element = null;
			for (var i=0; i<length; i++) {
				element = arr[i];
				body = body + element + '<br />';
			}
		} else {
			body = err;
		}
		console.log(err);
		res.end(plates.bind(template, {main: body}));
	});
});

// static server
app.use('/public', express.static('public'));

app.listen(process.env.PORT || 8080);