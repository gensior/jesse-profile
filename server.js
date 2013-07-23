var http = require("http");
var moment = require("moment");

http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("<html><body><h1>Hello World</h1>");
	response.write("<p>" + moment().zone("-07:00").format("dddd, MMMM Do YYYY, h:mm:ss a") + "</p>");
	response.write("</body></html>")
	response.end();
}).listen(process.env.PORT || 8888);