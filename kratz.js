if(process.env["consumer_key"]) {
	var config = {};
	config.consumer_key =  process.env["consumer_key"];
	config.consumer_secret =  process.env["consumer_secret"];
	config.access_token_key =  process.env["access_token_key"];
	config.access_token_secret =  process.env["access_token_secret"];
} else{
	var config = require('./settings.json');
}

const PORT = process.env.PORT || 5000;

var	schedule = require('node-schedule'),
    twitter = require('twitter'),
    request = require("request"),
    cheerio = require("cheerio")
		mustache = require('mustache'),
		fs = require('fs');

var url = "http://www.tagesspiegel.de/berlin/";

//get master template
fs.readFile('templates/master.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  mastertemplate = data;
});



MyApp = {
    appinit: function() {
        MyApp.doKratz();
        MyApp.kratzSchedule();
    },

    doKratz: function() {
      request(url, function (error, response, body) {
        if (!error) {
          var $ = cheerio.load(body), headline = $(".hcf-headline").first().html();
          console.log("Letzte Nachricht: " + headline + "");

          var client = new twitter({
            consumer_key: config.consumer_key,
            consumer_secret: config.consumer_secret,
            access_token_key: config.access_token_key,
            access_token_secret: config.access_token_secret
          });
          var params = {screen_name: 'nodejs'};
          client.post('statuses/update', {status: 'News: ' + headline},  function(error, tweet, response){
            if(error) {
              console.log(JSON.stringify(error) );
            } else{
              console.log('OK');
            }
          });
        } else {
          console.log("We’ve encountered an error: " + error);
        }
      });
    },

    kratzSchedule: function (){
      var rule = new schedule.RecurrenceRule();
      rule.minute = 45;
      var j = schedule.scheduleJob(rule, function(){
        MyApp.doKratz();
      });
    }
};




var express = require('express'),
		bodyParser = require("body-parser"),
    app = express(),
    session = require('express-session');

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
    res.send('<form action="/login" method="post"><p>Username: <input type="text" name="username" /></p><p>PW: <input type="password" name="password" /></p><p><input type="submit" /></p></form>');
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
  res.send("logout success!");
});

// Get content endpoint
app.get('/', auth, function (req, res) {
	var view = {
  	title: "webkratzr admin",
		heading: "Welcome to admin area",
		content: "This page content is secure."
	};

	var output = mustache.render(mastertemplate, view);

  res.send(output);
});

app.listen(PORT);
console.log("app running at port " + PORT);



// MyApp.appinit();
