/*
 * GET home page.
 */

var fs = require("fs");
var async = require("async");
var config = require("./config");

var genPost = require("./jekyll")
var genLink = require("./genlink").apacheLocal



var funcs = [ check
			  ,log
			  ,saveFile 		  // Set req.localFile to the path of the saved file
			  ,genLink 			  // Set req.imglink to the link of the image
			  ,genPost.createPost // Generate post and req.permalink to spread

			  // From now on, req.imglink and req.permalink are available
			  ,require("./twitter").createPost

			  ,prettyEnd
			];


function check(req, cb){
	var log = LOG()
	if(req.files.img == undefined){
		log("No file attached");
		return;
	}

	cb();
}


exports.post = function(req, res){

	if (req.param("apikey") != config.apikey){
		console.log("[Auth] Wrong apikey:", req.param("apikey"));
		res.send(401);
		return;
	}

	res.send(200);

	// Set this now because we are using timestamp to generate the permalink
	req.postDate = new Date();
	
	
	var q = async.queue(function(f, cb){ f(req, cb); });
	async.map(funcs, function(f){ q.push(f); }, null);

}

function LOG(module){
	if (module  == undefined) module = LOG.caller.name;
	return function(){
		var args = Array.prototype.slice.call(arguments);
		console.log("[" + module + "]", args.join(" ")); 
	}
}

exports.log = LOG


function log(req, cb){
	var logger = LOG("log");
	logger("===============================================");
	logger("Received push from apikey:", req.param("apikey"));
	logger("Short Text:", req.param("text"));
	logger("Description:", req.param("description"));
	logger("File:", req.files.img.name);
	logger(" > Size:", req.files.img.size);
	logger("Permalink:", req.permalink)

	cb();
}


function prettyEnd(req, cb){
	var logger = LOG("log");
	logger("===============================================");

	cb();
}



function saveFileSync(req, cb){
	var logger = LOG("saveFileSync");

	var newPath = config.localStoragePath + req.body.text + ".jpg";
	fs.writeFileSync(newPath, fs.readFileSync(req.files.img.path));
	logger("File synchronously saved as", newPath);

	cb();
}


function saveFile(req, cb){

	var logger = LOG("saveFile");

	fs.readFile(req.files.img.path, function (err, data) {

		var newid =  parseInt(req.postDate.getTime()).toString(36); //unix timestamp using base36
		var newPath = config.localStoragePath + newid + ".jpg";
		//LOG("Saving file", newPath);
		fs.writeFile(newPath, data, function (err) {
			if(err) throw err;
			req.localFile = newPath;
			logger("File saved as", newPath);
			cb();
		});
	});
}

