const http = require('http');
const url = require('url');
const fileServer = require('./fileServer.js');
const qs = require('./EventManagerQuery.js');
const utils = require('./utils.js');

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

        case "/event":
            // Serve the static event.html page
            fileServer.serve_static_file("html/event.html", res);
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

        case "/edit":
            fileServer.serve_static_file("html/make.html", res);
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
