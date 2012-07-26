process.on('uncaughtException', function(err) { console.error(err); });

var express = require('express');
var httpProxy = require('http-proxy');
var url = require('url');
var port = 80;

/*
function createProxy(proxyDomain) {
	return httpProxy.createServer(
		function (req, res, proxy) {	
			console.log('proxying ' + req.headers.host + ' :: ' + proxyDomain);
			// console.dir(req);		
			var originalHost = req.headers.host;
			req.headers.host = proxyDomain;
			var oldWrite = res.writeHead;
			res.writeHead = function(statusCode, headers) { 
				if(headers.location) {
					console.log(headers.location);	
					var parsedUrl = url.parse(headers.location);
					if(parsedUrl.host == req.headers.host) {						
						parsedUrl.host = 'localhost' + (port === 80 ? '' : ':' + port);			
						headers.location = url.format(parsedUrl);
					}
				}
				oldWrite.apply(res, arguments);
			};
			proxy.proxyRequest(req, res, {
				host: proxyDomain,
				port: 80
			});
		}
	);
};*/

//var proxyDomain = 'en.wikipedia.org';
//console.log('proxy domain is ' + proxyDomain);
//createProxy(proxyDomain).listen(port);

var proxy = new httpProxy.HttpProxy({
	target: {
		host: 'localhost',
		port: port
	}
});

var thisHost = 'localhost';
var app = express.createServer();

http.createServer(function (req, res) {
}).listen(1337, '127.0.0.1');

app.get('*', function(req, res, next) { 
	console.log('wildcard match:' + req.url);
	console.log('req.headers.host: ' + req.headers.host);	
	if(req.headers.host.indexOf(thisHost, this.length - thisHost.length) !== -1) {
		var proxyDomain = req.headers.host.slice(0, this.length - thisHost.length - 1);
		console.log('proxy is ' + proxyDomain);
		var originalHost = req.headers.host;
		req.headers.host = proxyDomain;
		var oldWrite = res.writeHead;
		res.writeHead = function(statusCode, headers) { 
			if(headers && headers.location) {
				console.log(headers.location);	
				var parsedUrl = url.parse(headers.location);
				if(parsedUrl.host == req.headers.host) {
					parsedUrl.host = 'en.wikipedia.org.localhost' + (port === 80 ? '' : ':' + port);			
					headers.location = url.format(parsedUrl);
				}
			}
			oldWrite.apply(res, arguments);
		};
		proxy.proxyRequest(req, res, {
			host: proxyDomain,
			port: port
		});
	} else {
		console.warn('unexpected host name: ' + req.headers.host);
		// TODO: put http error here
		// TODO: test htis error
	}
	next();
});
app.listen(port);

console.log('listening');
