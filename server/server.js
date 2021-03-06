// 8-3-17
// This file sets up the port and listener for the server, as well as defines server configuration
// Routing is done in ./responseHandler.js
var express = require('express');
var bodyparser = require('body-parser');
var handler = require('./responseHandler.js');
var path = require('path');
var passport = require('./passport.js')
var browserify = require('browserify-middleware');
var cors = require('cors');
var session = require('express-session');

var app = express();

app.use(express.static('static'));

app.use(cors());
app.use(bodyparser.json());
app.use(session({
	secret: 'mrspancakes',
}));
app.use(passport.initialize());
app.use(passport.session());


//Routing
app.get('/bundle.js', browserify('./client/index.js', {
  transform: [ [ require('babelify'), { presets: [ 'es2015', 'react' ] } ] ]
}));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../static/', 'index.html'));
});

app.get('/auth/google', 
	passport.authenticate('google', { accessType: 'offline', scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/plus.login', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
  	res.redirect('/');
  }
);

//Need to put Auth middleware into all these calls
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
        // next();
    }
}


//ROUTES
app.get('/session', loggedIn, (req,res) => {
	res.status(200).send(req.session);
});

app.get('/users/user/:email', loggedIn, handler.addOrFindUser);

app.post('/groups/create', loggedIn, handler.createGroup);

//userid = user._id
app.get('/groups/user/:userid', loggedIn, handler.getGroups);

app.get('/contacts/user/:userid', loggedIn, handler.getContactGroup);

app.post('/groups/user/add', loggedIn, handler.addToGroup);

app.post('/groups/user/remove', loggedIn, handler.removeFromGroup);

app.post('/groups/delete', loggedIn, handler.deleteGroup);

app.get('/users/reauth/:userid', loggedIn, handler.reauth);

app.get('/logout', handler.logout);



var port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log('Open on port: ',port);
});

