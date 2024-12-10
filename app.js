const http = require('http'),
    url = require('url'),
    fileServer = require('./fileServer.js'),
    qs = require('./EventManagerQuery.js'),
    utils = require('./utils.js');

function handle_incoming_request(req, res) {
    const path = url.parse(req.url).pathname;
    const queryObj = url.parse(req.url, true).query;

    console.log(`Request received: ${path}`);

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
            if (queryObj.action === "saveEvent") {
                queryObj.eventId ? qs.editEvent(res, queryObj) : qs.createEvent(res, queryObj);
            } else if (queryObj.action === "fetchEvent" && queryObj.id) {
                qs.getEventDetails(res, queryObj.id);
            } else {
                fileServer.serve_static_file("html/make.html", res);
            }
            break;

        case "/create":
            queryObj.eventId ? qs.editEvent(res, queryObj) : qs.createEvent(res, queryObj);
            fileServer.serve_static_file("html/home.html", res);
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

        case "/event/action":
            if (req.method === "POST") {
                let body = "";

                req.on("data", (chunk) => {
                    body += chunk.toString();
                });

                req.on("end", () => {
                    const requestData = JSON.parse(body);
                    const { action, eventId, newDetails } = requestData;

                    switch (action) {
                        case "editEvent":
                            qs.editEvent(res, { eventId, ...newDetails });
                            break;

                        case "verifyEvent":
                            qs.verifyEvent(res, { eventId, isVerified: newDetails.isVerified });
                            break;

                        case "deleteEvent":
                            qs.deleteEvent(res, { eventId });
                            break;

                        default:
                            utils.sendJSONObj(res, 400, { error: "Invalid action" });
                            break;
                    }
                });
            } else {
                utils.sendJSONObj(res, 405, { error: "Method not allowed" });
            }
            break;

        case "/":
            fileServer.serve_static_file("html/home.html", res);
            break;

        default:
            fileServer.serve_static_file("html" + path, res);
            break;
    }
}

const server = http.createServer(handle_incoming_request);

server.listen(80, () => {
    console.log("Server running on port 80");
});
