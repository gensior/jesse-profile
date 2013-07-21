var http = require("http");

http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("<html><body><h1>Hello World</h1>");
	var datetime = new Date().toISOString();
	response.write("<p>" + datetime + "</p>");
	response.write("</body></html>")
	response.end();
}).listen(process.env.PORT || 8888);