module.exports = {

	appinit: function(config, url, min) {
			readAndTweet.doKratz(config, url);
			readAndTweet.kratzSchedule(min);
	},

	doKratz: function(config, url) {
		var	schedule = require('node-schedule'),
		    twitter = require('twitter'),
		    request = require("request"),
		    cheerio = require("cheerio")
				mustache = require('mustache'),
				fs = require('fs');

		request(url, function (error, response, body) {
			if (!error) {

				var $ = cheerio.load(body, {
					decodeEntities: false }
				), headline = $(".hcf-headline").first().html();

				console.log("Letzte Nachricht: " + headline + "");

				var translator = require('yandex-translate-api')(config.yandex_api_key);
				translator.translate(headline, { to: 'en'}, function(err, res) {
					headlinetrans = res.text;
					console.log("Letzte Nachricht translated: " + headlinetrans + "");


					var client = new twitter({
						consumer_key: config.consumer_key,
						consumer_secret: config.consumer_secret,
						access_token_key: config.access_token_key,
						access_token_secret: config.access_token_secret
					});


					var params = {
						status: headlinetrans.toString("utf8")
					};

					client.post('statuses/update', params,  function(error, tweet, response){
						if(error) {
							console.log("trying to post " + headlinetrans + "");
							console.log(JSON.stringify(error) );
						} else{
							console.log('OK');
						}
					});

				});


			} else {
				console.log("We’ve encountered an error: " + error);
			}
		});
	},

	kratzSchedule: function (min){
		var	schedule = require('node-schedule');
		var rule = new schedule.RecurrenceRule();
		rule.minute = min;
		var j = schedule.scheduleJob(rule, function(){
			readAndTweet.doKratz();
		});
	}

};
