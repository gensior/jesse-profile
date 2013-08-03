'use strict';

var express = require('express'),
    moment = require('moment'),
    plates = require('plates'),
    fs = require('fs'),
    vogels = require('vogels'),
    util = require('util'),
    _ = require('lodash'),
    app = express();

vogels.AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY});
vogels.AWS.config.update({region: 'us-west-2'});
// var db = new AWS.DynamoDB();

var template = fs.readFileSync("templates/base.html", "utf-8");

// root GET
app.get('/', function ( req, res ) {
	var body = plates.bind(template, {main: "Hello from the index page."});
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', body.length);
	res.end(body);
	console.log('root');
});

var Post = vogels.define('Post', function (schema) {
	schema.Number('id', {hashKey: true});
	schema.String('title').required();
	schema.String('body');
	schema.Date('created', {default: Date.now});
	schema.UUID('key');
});
Post.config({tableName: 'posts'});

var printResults = function (err, resp) {
	if (err) {
		console.log(err);
	} else {
		console.log('Found', resp.Count, 'items');
		console.log(resp.Items[0].attrs);
	    return resp;
	}
}

// Test dynamoDB
app.get('/dynamo', function (req, res) {
	res.setHeader('Content-Type', 'text/html');
	Post.get(2, function (err, post) {
		return res.end(plates.bind(template, {main: post.get('title')}));
	});
	// db.listTables(function (err, data) {
	// 	if (!err) {
	// 		var arr = data.TableNames;
	// 		var length = arr.length,
	// 			element = null;
	// 		for (var i=0; i<length; i++) {
	// 			element = arr[i];
	// 			body = body + element + '<br />';
	// 		}
	// 	} else {
	// 		body = err;
	// 		console.log(err);
	// 	}
	// 	// console.log(process.env);
	// 	res.end(plates.bind(template, {main: body}));
	// });
});

// static server
app.use('/public', express.static('public'));

app.listen(process.env.PORT || 8080);