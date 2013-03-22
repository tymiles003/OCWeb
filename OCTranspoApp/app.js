
/**
 * Module dependencies.
 */

var express = require('express')
    , map = require('./routes/map')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , database = require('./routes/database');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', map.home);
app.get('/users', user.list);
app.post('/getSummary', map.getSummary);
app.post('/getTrips', map.getTrips);
app.post('/getAllStopsFromDb', database.getAllStops);
app.post('/login', user.userLogin);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
