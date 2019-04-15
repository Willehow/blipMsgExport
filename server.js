'use strict';

var proxyUrl = "http://bprspws-wcg:8080";
process.env.HTTP_PROXY = proxyUrl;
process.env.HTTPS_PROXY = proxyUrl;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

require('dotenv').config({silent: true});

var server = require('./app');
var port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;

server.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});