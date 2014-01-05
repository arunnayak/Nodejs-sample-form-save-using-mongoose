
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/new');

var Schema = new mongoose.Schema({

    _id: String,
    name: String,
    age: Number
});

var user = mongoose.model('emp', Schema);

app.get('/view', function(req, res){
    user.find({}, function(err, docs){
        if(err) res.json(err);
        else    res.render('index', {users: docs});
    });
});

app.post('/new', function(req, res){

    new user({
        _id: req.body.email,
        name: req.body.name,
        age: req.body.age
    }).save(function(err, doc){
            if(err) res.json(err); //for dev its fine
            else res.redirect('/view');
        });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
