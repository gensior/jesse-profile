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
		return err;
	} else {
		// var posts = _.pluck(resp.Items, 'attrs');
		// return res.end(plates.bind(template, {title: posts.title, body: posts.body}));
		return util.inspect(_.pluck(resp.Items, 'attrs'));
	}
}

// Test dynamoDB
app.get('/dynamo', function (req, res) {
	res.setHeader('Content-Type', 'text/html');
	var posts = Post.scan().loadAll().exec(function (err, resp) {
		var posts = _.pluck(resp.Items, 'attrs');
		var html = '<h2 class="title"></h2><h3 class="created"></h3><p class="body"></p>';
		var rendered = plates.bind(html, posts);
		return res.end(plates.bind(template, {main: rendered}));
	});
	// Post.get(2, function (err, post) {
	// 	return res.end(plates.bind(template, {main: post.get('title')}));
	// });
});

// static server
app.use('/public', express.static('public'));

app.listen(process.env.PORT || 8080);