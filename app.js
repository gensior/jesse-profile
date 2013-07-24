var flatiron = require('flatiron'),
    path = require('path'),
    moment = require('moment'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

app.router.get('/', function () {
	var req = this.req,
		res = this.res;

	app.log.info('Saying hello!');

	res.writeHead(200, {'content-type': 'text/html'});
	res.end('<html><body><h1>hello!</h1><p>' + moment().zone("-07:00").format("dddd, MMMM Do YYYY, h:mm:ss a") + '</p></body></html>');
});

app.start(3000, function (err) {
	if (err) {
		throw err;
	}

	var addr = app.server.address();
	app.log.info('Listening on http://' + addr.address + ':' + addr.port);
});
