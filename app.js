
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require("fs");
var https = require("https");

var app = express();

var options = {
	  key: fs.readFileSync('ssl/key.pem'),
	  cert: fs.readFileSync('ssl/cert.pem')
};

// all environments
app.set('port', process.env.PORT || 3999);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'uploads')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.post('/', routes.post);

https.createServer(options, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
