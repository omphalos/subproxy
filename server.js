var app = require('express');

exports.createServer = function() {
	app.get('*', function(req, res) {
	var result = app.createServer().
		use(express.vhost('m.mysite.com', require('/path/to/m').app).
		use(express.vhost('sync.mysite.com', require('/path/to/sync').app);		
	return result;
};
