var index = require("./index")
var config = require("./config")
var fs = require("fs");

// CLient ID f2c6e841a1858f1
// CLient Secret 5e5589c3e3461ba401549890172b5dc11da94553
var imgur = require('imgur');
imgur.setKey("f29daac16ef710bba20406c80c23c9cf");


function imgurLink(req, cb){
	var logger = index.log("imgurLink");
	logger("Generating Imgur link...");

	imgur.upload(req.files.img.path, function(response) {
		console.log(response)
		if(response.error)throw response.error

		req.imglink = response.links.original
		index.log("Link:", req.imglink);

		cb();
	});

}


function apacheLocal(req, cb){
	var logger = index.log("imgurLink");
	
	
	var newid =  parseInt(req.postDate.getTime()).toString(36); //unix timestamp using base36


	var imglink = config.localImageHost.baseurl + newid
	var imgpath = config.localImageHost.basepath + newid

	fs.readFile(req.files.img.path, function(err, data){
		fs.writeFile(imgpath, data, function(err){
			if(err) throw err;

			logger("Genearting local link...", imglink);
			req.imglink = imglink;
			cb();
		});
	});
}

function dummyLink(req, cb){
	req.imglink = "http://i.imgur.com/30rGCgj.jpg";

	var logger = index.log("dummyLink");
	logger("Generating link", req.imglink);
	cb();
}

exports.imgur = imgurLink;
exports.dummy = dummyLink;
exports.apacheLocal = apacheLocal;
