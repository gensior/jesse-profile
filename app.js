var express = require('express'),
    moment = require('moment'),
    plates = require('plates'),
    fs = require('fs'),
    app = express();

var template = fs.readFileSync("templates/base.html", "utf-8");

// root GET
app.get('/', function ( req, res ) {
	var body = plates.bind(template, {main: "Hello from the index page."});
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

// static server
app.use('/public', express.static('public'));

app.listen(process.env.PORT || 8080);