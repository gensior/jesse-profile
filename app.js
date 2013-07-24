var flatiron = require('flatiron'),
    path = require('path'),
    moment = require('moment'),
    plates = require('plates'),
    fs = require('fs'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

var template = fs.readFileSync("base.html", "utf-8");

app.use(flatiron.plugins.http);

// root GET
app.router.get('/', function () {
	var req = this.req,
		res = this.res;

	// app.log.info('Saying hello!');

	res.writeHead(200, {'content-type': 'text/html'});
	res.end(plates.bind(template, {main: "<span id='datetime'>" + moment().zone("-07:00").format("dddd, MMMM Do YYYY, h:mm:ss a") + "</span>"}));
});

app.start(process.env.PORT || 8080, function (err) {
	if (err) {
		throw err;
	}

	// var addr = app.server.address();
	// app.log.info('Listening on http://' + addr.address + ':' + addr.port);
});
