var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require("./app/routes");
var db	 = require('./config/db');

var app = express();
var port = 8000;
console.log('yoyo');
mongoose.connect(db.url);
console.log('Hello');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

routes.addAPIRouter(app, mongoose);

app.use(function(req, res, next){
   res.status(404);
   res.json({ error: 'Invalid URL' });
});


app.listen(port);
console.log('Magic happens on port ' + port);

exports = module.exports = app;
