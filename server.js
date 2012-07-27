var httpProxy = require('http-proxy');
var url = require('url');
var http = require('http');

exports.createServer = function(port, subProxyHost, options) {	
	httpProxy.createServer(	
		function (req, res, proxy) {						
			if(req.headers.host.indexOf(subProxyHost) == req.headers.host.length - subProxyHost.length) {
				// infer the proxy domain
				var proxyDomain = req.headers.host.slice(0, req.headers.host.length - subProxyHost.length -1);
				var originalHost = req.headers.host;
				// replace the host in the request
				req.headers.host = proxyDomain;				
				// intercept calls to writeHead, so that we write the new location there
				var oldWriteHead = res.writeHead;				
				res.writeHead = function(statusCode, headers) {
					if(headers.location) {
						// replace the host in the response
						var parsedUrl = url.parse(headers.location);
						if(parsedUrl.host == req.headers.host) {						
							parsedUrl.host = originalHost + (port === 80 ? '' : ':' + port);			
							headers.location = url.format(parsedUrl);
						}
					}
					// now that we've overwritten the header the node-http-proxy passes, we pass it along
					oldWriteHead.apply(res, arguments);
				};
				if(options && options.onProxying) { options.onProxying(req, res); }
				proxy.proxyRequest(req, res, {
					host: proxyDomain,
					port: 80
				});
				if(options && options.onProxied) { options.onProxied(req, res); }
			}
			else {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'text/plain');
				res.end('Internal Server Error: failed to identify host "' + req.headers.host + '"; expecting "' + subProxyHost +'"');
			}
		}
	).listen(port);
};