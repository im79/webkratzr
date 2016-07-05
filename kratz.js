
if(process.env["consumer_key"]) {
	var config = {};
	config.consumer_key =  process.env["consumer_key"];
	config.consumer_secret =  process.env["consumer_secret"];
	config.access_token_key =  process.env["access_token_key"];
	config.access_token_secret =  process.env["access_token_secret"];
} else{
	var config = require('./settings.json');
}


var schedule = require('node-schedule');
var twitter = require('twitter');
var request = require("request"), cheerio = require("cheerio"), url = "http://www.tagesspiegel.de/berlin/";


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
      rule.second = 0;
      var j = schedule.scheduleJob(rule, function(){
        MyApp.doKratz();
      });
    }

};

MyApp.appinit();
