// server.js

// set up ======================================================================
// get all the dependencies we need
var express  = require('express');
var app      = express();
var path   = require('path');
var port     = process.env.PORT || 2018;
var mongoose = require('mongoose');
var morgan         = require('morgan');
var cookieParser         = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon')


// configuration ===============================================================
var configDB = require('./config/db.js');

// connect to the database

mongoose.connect(configDB.url,{ useNewUrlParser: true },function(err,db){
    if(err){
        console.log(err);
    }
    else {
        console.log('connected to ' + db);
        db.close();
    }
  })
	
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// set the favicon
app.use(favicon('favicon.ico'));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/*+json' }));// parse application/vnd.api+json as json
app.use(methodOverride());// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

app.use(function (req, res, next) {
    var pattern = /.(ttf|otf|eot|woff|jpg|png|jpeg|gif|js|json|html|css|pdf)/
    if (pattern.test(req.url)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,  Accept ,Origin,Authorization,User-Agent, DNT,Cache-Control, X-Mx-ReqToken, Keep-Alive, If-Modified-Since');
    res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
});
    

// routes ======================================================================
// API Routes load
app.use('/api', require('./app/api'));

// app.get('*', function(req, res){
// 	res.redirect('/#' + req.originalURL);
// })

// app.get("*", function(req, res) {
//     res.render("./public/index.html");
// });

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
	// var ip = req.headers['x-forward-for'] || req.connection.remoteAddress;
	// console('Client IP:', ip);
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
  next();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



// launch ======================================================================
app.listen(port);
console.log('Reported is Live on port ' + port);

// expose Reported
exports = module.exports = app;