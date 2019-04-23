'use strict';

var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.use(fileUpload());
 
//server.listen(3001);
 

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/health', function (req, res) {  
  res.send("Staying alive =]");

});
 
var msg = require('./script/msg.js');
app.get('/msg', msg.get);


module.exports = app;
