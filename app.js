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
			fileServer.serve_static_file("html/home.html",res);
			break;
		case "/loadeventsadmin" :
			//pass search query via get
			//?q=xxxxx
			qs.loadeventsadmin(res, queryObj);
			break;
		case "/loadeventscoord" :
			//pass search query via get
			//?coordinatorID=xxxxx&q=xxxxx
			qs.loadeventscoord(res, queryObj);
			break;
		case "/loadeventsattendee" :
			//pass search query via get
			//?attendeeID=xxxxx&q=xxxxx
			qs.loadeventsattendee(res, queryObj);
			break;
		case "/event/" :
			//load a specific event page here, redirect if not logged in
			//requires an id via get to be pulled clientside
			//?id=xxx
			fileServer.serve_static_file("html/event.html", res);
			break;
		case "/loadevent":
			qs.loadeventid(res, queryObj);
			break;
		case "/acceptinvite":
			qs.respondtoinvite(res, queryObj, true);
			break;
		case "/declineinvite":
			qs.respondtoinvite(res, queryObj, false);
			break;
		case "/make" :
			//load the make event page if a coordinator, else redirect to home or login page
			//also pass the make event params back via get here
			//?name=xx&start=xx&end=xx&cap=xx&attendees=xxxxx,xxxxx,xxxx,xxxx
			if (queryObj.action === "saveEvent") {
				console.log("Saving event request received:", queryObj);
        			if (queryObj.eventId) {
            				qs.editEvent(res, queryObj); // Edit event if eventId exists
        			} else {
            				qs.createEvent(res, queryObj); // Create a new event
        			}
    			} else if (queryObj.action === "fetchEvent" && queryObj.id) {
				console.log("Fetching event details for ID:", queryObj.id);
        			qs.getEventDetails(res, queryObj.id); // Fetch event details
    			} else {
     				fileServer.serve_static_file("html/make.html", res);
				}
			break;		
		case "/create" :
			if (queryObj.eventId) {
        			console.log("Editing event:", queryObj.eventId);
        			qs.editEvent(res, queryObj); // Editing an existing event
    			} else {
        			console.log("Creating a new event with data:", queryObj);
        			qs.createEvent(res, queryObj); // Creating a new event
    			}
    			fileServer.serve_static_file("html/home.html", res); // Redirect to home after saving
			break;
		case "/edit" :
			//load the edit event page if a coordinator or admin and send data on event in response to prefill, else redirect to home or login page
			//also pass the make event params back via get here
			//?name=xx&start=xx&end=xx&cap=xx&attendees=xxxxx,xxxxx,xxxx,xxxx
			fileServer.serve_static_file("html/make.html", res);
			break;
		case "/saveFeedback":
			qs.saveFeedback(res, queryObj);
			break;
		
		case "/getFeedback":
			qs.getFeedback(res, queryObj);
			break;
		case "/deleteFeedback":
			qs.deleteFeedback(res, queryObj);
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