var index = require("./index")
var Twit = require("twit")

var config = require("./config")


// *req.permalink


var T = new Twit({ 
	consumer_key 		: config.twitter.consumer_key,
	consumer_secret 	: config.twitter.consumer_secret,
	access_token 		: config.twitter.access_token, 
	access_token_secret : config.twitter.access_token_secret
});

function twitter(req, cb){

	var moduleName = "Twitter"

	if(!req.permalink){ index.log("req.permalink does not exist"); return; }

	var msg = req.param("text");

	if (msg.length + req.permalink.length + 1 > 140){

		var ml = msg.length - req.permalink.length - 1;
		var words = msg.split(" ");
		var ret = words[0];
		
		for (var i = 1 ; i < words.length; i++){
			if( ret.length + words[i].length + 1  < ml)
				ret += " " + words[i];
			else
				break;
		}

		msg = ret;
	}

	T.post('statuses/update', { status: msg + " " + req.permalink}, function(err, reply){
		if (err) console.log(err);
		index.log("Twitter")("Posted on Twitter");

		cb();
	});

}

exports.createPost = twitter;
