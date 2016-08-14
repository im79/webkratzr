if(process.env["consumer_key"]) {
	var config = {};
	config.consumer_key =  process.env["consumer_key"];
	config.consumer_secret =  process.env["consumer_secret"];
	config.access_token_key =  process.env["access_token_key"];
	config.access_token_secret =  process.env["access_token_secret"];
	config.yandex_api_key =  process.env["yandex_api_key"];
} else{
	var config = require('./settings.json');
}

 //constants
const PORT = process.env.PORT || 5000;
const url = "http://www.tagesspiegel.de/berlin/";


//includes
var	mustache = require('mustache'),
		fs = require('fs'),
		express = require('express'),
		bodyParser = require("body-parser"),
		app = express(),
		session = require('express-session');

readAndTweet = require('./app.inc.js');
var buildPage = require('./page.inc.js');

//app.disable('x-powered-by');

// run app
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "im" && req.session.admin){
    return next();
  }else{
    return res.redirect('/login');
	}
};

// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {

		var page =  new buildPage('templates/master.html', '','');
		page.setPath('login');
		res.send(page.merge('templates/login.html'));

  } else if(req.query.username == "im" && req.query.password == "kratz") {
    req.session.user = "im";
    req.session.admin = true;
    res.send("login success!");
  } else {
		res.send("login failed (wrong user/pw)");
	}
});

app.post('/login', function (req, res) {
  if(req.body.username == "im" && req.body.password == "kratz") {
    req.session.user = "im";
    req.session.admin = true;
    res.redirect('/');
  } else {
		res.send("POSTED but login failed (wrong user/pw)");
	}
});

// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  return res.redirect('/login');
});

// Get content endpoint
app.get('/', auth, function (req, res) {
	var page =  new buildPage('templates/master.html', 'templates/topnavi.html','templates/sidebar.html');
	page.setPath('front');
	res.send(page.merge('THIS IS HIDDEN CONTENT'));
});

app.listen(PORT);
console.log("app running at port " + PORT);

readAndTweet.appinit(config, url, 45);
