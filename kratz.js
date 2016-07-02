var config = require('./settings.json');

var twitter = require('twitter');
var request = require("request"), cheerio = require("cheerio"), url = "http://www.tagesspiegel.de/berlin/";

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
