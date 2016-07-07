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
    cheerio = require("cheerio");

var url = "http://www.tagesspiegel.de/berlin/";





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
    app = express(),
    session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "im" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed (no user/pw)');
  } else if(req.query.username == "im" && req.query.password == "kratz") {
    req.session.user = "im";
    req.session.admin = true;
    res.send("login success!");
  } else {
		res.send("login failed (wrong user/pw)");
	}
});

// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});

app.listen(PORT);
console.log("app running at port " + PORT);



MyApp.appinit();
