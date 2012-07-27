var subdomainProxy = require('./server');
var argv = require('optimist').argv;

if(argv.h) {
	console.log('usage: ');
	console.log('	-r: host root (example, localhost)');
	console.log('	-p: port to listen on (example, 80) ');
	console.log('	-h: this help message');
} else {
	var port = argv.p || 80;
	var subProxyHost = argv.r || 'localhost';

	subdomainProxy.createServer(port, subProxyHost);
	console.log('host ' + subProxyHost + ' listening on port ' + port);
}