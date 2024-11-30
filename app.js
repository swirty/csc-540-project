const http = require('http'),
    url = require('url'),
    fileServer = require('./fileServer.js'),
    qs = require('./EventManagerQuery.js'),
    utils = require('./utils.js');

function handle_incoming_request(req, res) {
	console.log("PART1" +req.url);
	// get the path of the file to served
	const path = url.parse(req.url).pathname;
	// get a query (true makes sure the query string is parsed into an object)
	const queryObj = url.parse(req.url,"true").query;
	switch (path) {
		case "/login" :
			//load the login page
			//pass login params via get request here
			//?user=xxxxx&pass=xxxxxx
			fileServer.serve_static_file("html/login.html",res);
			break;
		case "/loginbutton" :
			console.log("Handling /loginbutton request");
			qs.loginbutton(res, queryObj);
			break;
		case "/register" :
			//load the registration page
			//pass registration requests via get request here
			//?user=xxxxx&pass=xxxxxx&email=xxxxx&phone=xxxxxxxxxxx
			fileServer.serve_static_file("html/register.html",res);
			break;
		case "/signupbutton" :
			console.log("Handling /signupbutton request");
			qs.signupbutton(res, queryObj);
			break;
		case "/home" :
			//load the home page if logged in, else redirect to login;
			//pass search query via get
			//?q=xxxxx
			fileServer.serve_static_file("html/home.html",res);
			break;
		case "/loadeventsadmin" :
			qs.loadeventsadmin(res);
			break;
		case "/loadeventscoord" :
			qs.loadeventscoord(res, queryObj);
			break;
		case "/loadeventsattendee" :
			qs.loadeventsattendee(res, queryObj);
			break;
		case "/event" :
			//load a specific event page here, redirect if not logged in
			//requires an id via get
			//?id=xxx
			break;
		case "/make" :
			//load the make event page if a coordinator, else redirect to home or login page
			//also pass the make event params back via get here
			//?name=xx&start=xx&end=xx&cap=xx&attendees=xxxxx,xxxxx,xxxx,xxxx
			fileServer.serve_static_file("html/make.html", res);
			break;
		case "/edit" :
			//load the edit event page if a coordinator or admin and send data on event in response to prefill, else redirect to home or login page
			//also pass the make event params back via get here
			//?name=xx&start=xx&end=xx&cap=xx&attendees=xxxxx,xxxxx,xxxx,xxxx
			break;
			
		case "/" :  
			//default base url, go to the home page
			fileServer.serve_static_file("html/home.html",res);
			break;	
		
		default:
			fileServer.serve_static_file("html"+path,res);
			break;
	}      
}


const server = http.createServer(handle_incoming_request);

server.listen(80,function() {console.log("port 80")});