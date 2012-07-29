Subdomain proxy using node-http-proxy.

This package lets you proxy websites using subdomains.  
For example, if your domain is example.com, and you type www.google.com.example.com in the browser, you will see google's homepage.

Note that when running on localhost, you will probably need to modify your hosts file (instructions below).

Command-line usage
==================

    subproxy [options]

This starts a subproxy server using the specified command-line options:

    -r: host root (for example, localhost)
    -p: port to listen on (for example, 80)
    -h: this help message
	
Example
=======

    npm install subproxy
    subproxy -r localhost -p 85
	
Next, in your hosts file, add the following line:

    127.0.0.1       www.google.com.localhost	
	
Now, in your browser, navigate to the following url:

    http://www.google.com.localhost:85
	
You should see google's webpage.

API usage
=========

	require('http-proxy').createServer(function (req, res, proxy) {
		require('subproxy').handleRequest(subProxyHost, port, req, res, proxy);
	}).listen(port);
	
**subproxy** depends on **node-http-proxy** to proxy websites.

Updating your hosts file to run on localhost
============================================

If running this with localhost, you will have to update your hosts file.  
Subdomains of localhost (such as www.google.com.localhost) won't be routed to localhost unless you update this file.
Here are a couple tutorials I found which show you how to do this on different operating systems:

http://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/

http://boomshadow.net/tools-utilities/hosts-mod/

For example, if you want to proxy www.google.com, you will need to add this to your hosts file:

    127.0.0.1       www.google.com.localhost	

Make sure you use spaces, not tabs, to separate the IP from the domain.

Public servers
==============
If you host a subproxy on a public server, you will want to create a wildcard DNS record http://en.wikipedia.org/wiki/Wildcard_DNS_record.
For example, if your domain is example.com, you would want to create a wildcard DNS record for *.example.com to point traffic to your IP address.

How it works
============
    
The **subproxy** command line starts a server using **node-http-proxy**.  Then, it listens for requests.  
It will look at the request, and pull out the subdomain (for example, given www.google.com.localhost, it will pull out www.google.com).
It will then proxy the connection to the subdomain (so you would see www.google.com content in your browser).
Additionally, it will replace references to the proxied domain (www.google.com) in the location header.  
That way, you still see the full proxy url in the browser (www.google.com.localhost).

