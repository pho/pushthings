var index = require("./index");
var fs = require("fs");
var util = require("util");
var config = require("./config")


// *req.postDate
// *req.imglink

// +req.permalink


function permalink(req){
	return parseInt(req.postDate.getTime()).toString(36); //unix timestamp using base36
}

function getLink(req){
	return [config.web.urlbase, permalink(req)].join("/"); 
}

exports.permalink = getLink;

function jekyll(req, cb){

	var logger = index.log();

	var date = req.postDate;

	req.permalink = getLink(req);

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

    var filedate = year + "-" + month + "-" + day ;
	var layoutdate = filedate + " " + hour + ":" + minute + ":" + second

	var file = util.format("---\nlayout: pic\ntitle: %s\nimg: %s\ndate: %s\npermalink: %s\n---\n%s",
							req.param("text"),
							req.imglink,
							layoutdate,
							"/" + permalink(req),
							req.param("description") == undefined? "": req.param("description")
							);

	var path = util.format("%s/_posts/%s-%s.markdown",
							config.jekyll.path,
							filedate,
							req.param("text").replace(/\ /g, "-"));

	fs.writeFile(path, file, function(err){
		if(err) throw err;
		
		logger(util.format("Posted on jekyll (%s)", req.permalink));

		cb();
	});

	
}

exports.createPost = jekyll;
