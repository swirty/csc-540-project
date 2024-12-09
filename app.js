const http = require('http'),
    url = require('url'),
    fileServer = require('./fileServer.js'),
    qs = require('./EventManagerQuery.js'),
    utils = require('./utils.js');

function handle_incoming_request(req, res) {
    console.log("Incoming request: " + req.url);

    // Parse the URL and query string
    const path = url.parse(req.url).pathname;
    const queryObj = url.parse(req.url, true).query;

    switch (path) {
        case "/login":
            fileServer.serve_static_file("html/login.html", res);
            break;

        case "/loginbutton":
            qs.loginbutton(res, queryObj);
            break;

        case "/register":
            fileServer.serve_static_file("html/register.html", res);
            break;

        case "/signupbutton":
            qs.signupbutton(res, queryObj);
            break;

        case "/home":
            fileServer.serve_static_file("html/home.html", res);
            break;

        case "/loadeventsadmin":
            qs.loadeventsadmin(res, queryObj);
            break;

        case "/loadeventscoord":
            qs.loadeventscoord(res, queryObj);
            break;

        case "/loadeventsattendee":
            qs.loadeventsattendee(res, queryObj);
            break;

        case "/event/":
            // Serve the static event.html page
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

        case "/make":
            fileServer.serve_static_file("html/make.html", res);
            break;
            
        case "/sendInvite":
            qs.sendInvite(res, queryObj);
            break;

        case "/event/action":
            // Handle dynamic event actions
            if (req.method === "POST") {
                qs.handleEventActions(req, res);
            } else {
                utils.sendJSONObj(res, 405, { error: "Method not allowed. Use POST for actions." });
            }
            break;

        case "/make":
            fileServer.serve_static_file("html/make.html", res);
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

        case "/edit":
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
            // Serve other static files
            fileServer.serve_static_file("html" + path, res);
            break;
    }
}

// Create the HTTP server
const server = http.createServer(handle_incoming_request);

// Start the server
server.listen(80, function () {
    console.log("Server listening on port 80");
});
