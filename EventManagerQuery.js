const utils = require("./utils.js"),
      mysql      = require('mysql2');

////////////////////// MODIFY THIS CODE /////////////////////////////
const connectionObj = {
		host     : 'localhost',
		user     : 'newuser',
		password : '10013070',
		database : 'eventManager',
		connectionLimit : 10
};

exports.loginbutton = function (response, queryObj) {
    let connection_pool = mysql.createPool(connectionObj);
    const { username, password } = queryObj; 
    console.log("part 3");
    console.log("Username: "+ username);
    console.log(queryObj);



    const loginQuery = 'SELECT * FROM user WHERE username = ? AND password = ?';

    connection_pool.query(loginQuery, [username, password], function(error, results){
        console.log("LETS START");

        if (error) {
            utils.sendJSONObj(response, 500, error);
            connection_pool.end();
            
        } else if (results.length === 0) {
            console.log("NONE")
            utils.sendJSONObj(response, 400, {message: "Invalid username or password" });
            connection_pool.end();
            
        } else {
            const user = { id: results[0].userID, username: results[0].username, email: results[0].email, role: results[0].role};
            utils.sendJSONObj(response, 200, { success: true, message: "Login successful", user });
            connection_pool.end();
        }
    });
};

exports.signupbutton = function (response, queryObj) {

    let connection_pool = mysql.createPool(connectionObj);
    const { username, password, email, phone} = queryObj; 




    const checkUserQuery = 'SELECT * FROM user WHERE username = ?';

    connection_pool.query(checkUserQuery, [username], function(error, results){
        console.log("LETS START");

        if (error) {
            utils.sendJSONObj(response, 500, error);
            connection_pool.end();
            return;
            
        } 
        if (results.length > 0){
            utils.sendJSONObj(response, 400, { message: "Username already taken. Please choose another one." });
            connection_pool.end();
            return;
        }
        const insertUserQuery = `
            INSERT INTO user (username, password, role)
            VALUES (?, ?, 'Attendee')
        `;
            
        connection_pool.query(insertUserQuery, [username, password], function (insertError, insertResults) {
            if (insertError) {
                console.error("Error inserting new user:", insertError);
                utils.sendJSONObj(response, 500, { error: "Could not create user. Please try again." });
                connection_pool.end();
                return;
            } 
            
            const userID = insertResults.insertId;
            const insertAttendeeQuery = `
                INSERT INTO Attendee (userID, userEmail, phoneNumber)
                VALUES (?, ?, ?)
            `;
            connection_pool.query(insertAttendeeQuery, [userID, email, phone], function (attendeeInsertError) {
                if (attendeeInsertError) {
                    console.error("Error inserting into Attendee table:", attendeeInsertError);
                    utils.sendJSONObj(response, 500, { error: "Could not create attendee entry. Please try again." });
                } else {
                    console.log("User successfully registered as Attendee:", username);
                    utils.sendJSONObj(response, 200, {
                        success: true,
                        message: "Signup successful!",
                        user: { username, email, phone, role: 'Attendee' },
                    });
                }
                connection_pool.end();
            });
        });
    });
};



// Fetch event details by ID
exports.getEventDetails = function (response, eventId) {
    let connection_pool = mysql.createPool(connectionObj);

    const query = `
        SELECT e.id, e.name, e.location, e.start_time, e.end_time, e.capacity,
               e.attendees, e.verified, e.description, u.username AS coordinator
        FROM events e
        LEFT JOIN users u ON e.coordinator_id = u.id
        WHERE e.id = ?;
    `;

    connection_pool.query(query, [eventId], function (error, results) {
        if (error) {
            console.error("Error fetching event details:", error);
            utils.sendJSONObj(response, 500, { error: "Failed to load event details." });
        } else if (results.length === 0) {
            utils.sendJSONObj(response, 404, { message: "Event not found." });
        } else {
            const eventDetails = results[0];
            utils.sendJSONObj(response, 200, { success: true, eventDetails });
        }
        connection_pool.end();
    });
};



exports.createEvent = function (res, queryObj) {
    console.log("createEvent called with:", queryObj);
    let connection_pool = mysql.createPool(connectionObj);
    // Extract event data from the query string
    const { eventName, date, startTime, endTime, location, coordinatorID, description, eventStatus } = queryObj;
    const query = `
        INSERT INTO event (eventName, eventDate, startTime, endTime, location, coordinatorID, description, eventStatus)
        VALUES ('${eventName}', '${date}', '${startTime}', '${endTime}', '${location}', '${coordinatorID}', '${description}', 'Pending');
    `;
//    const queryParams = [name, date, start, end, location, coordinatorID, description, eventStatus];

    connection_pool.query(query, function (error, results) {
        if (error) {
            console.error("Error creating event:", error);
        //    utils.sendJSONObj(res, 500, { error: "Could not create event. Please try again." });
        } else {
            console.log("Event created successfully:", eventName);
        //    utils.sendJSONObj(res, 200, { success: true, message: "Event created successfully!" });
        }
    });
};

exports.editEvent = function (res, queryObj) {
    console.log("editEvent called with:", queryObj);
    let connection_pool = mysql.createPool(connectionObj);
    const { eventId, name, start, end, location, coordinator, description, eventStatus } = queryObj;

    if (!eventId) {
        utils.sendJSONObj(res, 400, { error: "Event ID is required for editing." });
        return;
    }

    const query = `
        UPDATE event
        SET eventName = ?, startTime = ?, endTime = ?, location = ?, coordinatorID = ?, description = ?, eventStatus = ?
        WHERE eventID = ?;
    `;
    const queryParams = [name, start, end, location, coordinator, description, eventStatus, eventId];

    connection_pool.query(query, queryParams, function (error, results) {
        if (error) {
            console.error("Error editing event:", error);
            utils.sendJSONObj(res, 500, { error: "Could not edit event. Please try again." });
        } else {
            console.log("Event updated successfully:", name);
            utils.sendJSONObj(res, 200, { success: true, message: "Event updated successfully!" });
        }
    });
};



exports.getUserRole = function(response, queryObj) {
    let connection_pool = mysql.createPool(connectionObj);
    const { userID } = queryObj;

    if (!userID) {
        utils.sendJSONObj(response, 400, { error: "User ID is required" });
        connection_pool.end();
        return;
    }

    const query = 'SELECT role FROM user WHERE userID = ?';

    connection_pool.query(query, [userID], function(error, results) {
        if (error) {
            utils.sendJSONObj(response, 500, error);
        } else if (results.length === 0) {
            utils.sendJSONObj(response, 404, { error: "User not found" });
        } else {
            const role = results[0].role;
            console.log("Role Query: "+role);
            utils.sendJSONObj(response, 200, { role });
        }
        connection_pool.end();
    });
}
exports.loadeventsadmin = function(response, queryObj) {

	let connection_pool = mysql.createPool(connectionObj);

    connection_pool.query(`SELECT Event.*, User.username AS coordinatorUsername FROM Event JOIN Coordinator ON Event.coordinatorID = Coordinator.coordinatorID JOIN User ON Coordinator.userID = User.userID WHERE eventName LIKE "%${queryObj.q}%"`, function (error, results, fields) {
    if  (error) {
        utils.sendJSONObj(response,500,error);
        connection_pool.end();
    }
    else {

        let responseObj = {scheduled: false,times: results};
        utils.sendJSONObj(response,200,responseObj);
        connection_pool.end();
    }}); 
};

exports.loadeventscoord = function(response, queryObj) {

	let connection_pool = mysql.createPool(connectionObj);
    const {coordinatorID} = queryObj; 

    connection_pool.query('SELECT Event.*, User.username AS coordinatorUsername FROM Event JOIN Coordinator ON Event.coordinatorID = Coordinator.coordinatorID JOIN User ON Coordinator.userID = User.userID WHERE Event.coordinatorID = ?', [coordinatorID],function (error, results, fields) {
    if  (error) {
		utils.sendJSONObj(response,500,error);
		connection_pool.end();
	}
    else {

        let responseObj = {scheduled: false,times: results};
        utils.sendJSONObj(response,200,responseObj);
        connection_pool.end();
    }}); 
};

exports.loadeventsattendee = function(response, queryObj) {

	let connection_pool = mysql.createPool(connectionObj);
    const {attendeeID} = queryObj; 
    const query = `
        SELECT 
            Event.eventID, 
            Event.eventName, 
            Event.eventDate, 
            Event.startTime, 
            Event.endTime, 
            Event.location, 
            Event.description, 
            User.username AS coordinatorUsername, 
            Invitation.status AS invitationStatus
        FROM 
            Invitation
        JOIN 
            Event ON Invitation.eventID = Event.eventID
        JOIN 
            Coordinator ON Event.coordinatorID = Coordinator.coordinatorID
        JOIN 
            User ON Coordinator.userID = User.userID
        WHERE 
            Invitation.attendeeID = ?
    `;
    connection_pool.query(query, [attendeeID],function (error, results, fields) {
    if  (error) {
		utils.sendJSONObj(response,500,error);
		connection_pool.end();
	}
    else {

        let responseObj = {scheduled: false,times: results};
        utils.sendJSONObj(response,200,responseObj);
        connection_pool.end();
    }}); 
};
