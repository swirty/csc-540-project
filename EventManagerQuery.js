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

// Add verifying event
exports.verifyEvent = function (response, eventId, userId) {
    let connection_pool = mysql.createPool(connectionObj);
    const query = `
        UPDATE events
        SET verified = 1
        WHERE id = ? AND coordinator_id = ?;
    `;
    connection_pool.query(query, [eventId, userId], function (error) {
        if (error) {
            console.error("Error verifying event:", error);
            utils.sendJSONObj(response, 500, { error: "Failed to verify event." });
        } else {
            utils.sendJSONObj(response, 200, { success: true, message: "Event verified successfully." });
        }
        connection_pool.end();
    });
};

// handle edit, delete, verify in handleventactions

exports.handleEventActions = function (req, response) {
    let connection_pool = mysql.createPool(connectionObj);
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        const data = JSON.parse(body);
        const { action, eventId, userId } = data;

        if (action === "verifyEvent") {
            exports.verifyEvent(response, eventId, userId);
        } else if (action === "editEvent") {
            const { name, start, end, location, capacity } = data.newDetails;
            const query = `
                UPDATE events
                SET name = ?, start_time = ?, end_time = ?, location = ?, capacity = ?
                WHERE id = ? AND coordinator_id = ?;
            `;
            connection_pool.query(query, [name, start, end, location, capacity, eventId, userId], function (error) {
                if (error) {
                    console.error("Error editing event:", error);
                    utils.sendJSONObj(response, 500, { error: "Failed to edit event." });
                } else {
                    utils.sendJSONObj(response, 200, { success: true, message: "Event updated successfully." });
                }
                connection_pool.end();
            });
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
    const { eventName, date, startTime, endTime, location, coordinatorID, description, attendees } = queryObj;
    let query = `
        INSERT INTO event (eventName, eventDate, startTime, endTime, location, coordinatorID, description, eventStatus)
        VALUES ('${eventName}', '${date}', '${startTime}', '${endTime}', '${location}', '${coordinatorID}', '${description}', 'Pending');
    `;
//    const queryParams = [name, date, start, end, location, coordinatorID, description, eventStatus];

    connection_pool.query(query, function (error, results) {
        if (error) {
            console.error("Error creating event:", error);
        //    utils.sendJSONObj(res, 500, { error: "Could not create event. Please try again." });
        } else {
            query = `
                INSERT INTO invitation (attendeeID, eventID, status)
                VALUES ('${attendees}', LAST_INSERT_ID(), 'Pending')`;
            connection_pool.query(query, function (error, results){
                if (error) {
                    console.error("Error creating event:", error);
                } else {
                    console.log("Event created successfully:", eventName);
                }
            })
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
        UPDATE Event
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

// Verify Event
exports.verifyEvent = function (res, queryObj) {
    let connection_pool = mysql.createPool(connectionObj);
    const { eventId, isVerified } = queryObj;

    if (!eventId || isVerified === undefined) {
        utils.sendJSONObj(res, 400, { error: "Event ID and verification status are required." });
        return;
    }

    const query = `
        UPDATE Event
        SET eventStatus = ?
        WHERE eventID = ?;
    `;

    connection_pool.query(query, [isVerified, eventId], function (error, results) {
        if (error) {
            console.error("Error verifying event:", error);
            utils.sendJSONObj(res, 500, { error: "Could not verify event." });
        } else if (results.affectedRows === 0) {
            utils.sendJSONObj(res, 404, { error: "Event not found." });
        } else {
            console.log("Event verification updated successfully.");
            utils.sendJSONObj(res, 200, { success: true, message: "Event verification updated!" });
        }
        connection_pool.end();
    });
};


// Delete Event
exports.deleteEvent = function (res, queryObj) {
    let connection_pool = mysql.createPool(connectionObj);
    const { eventId } = queryObj;

    if (!eventId) {
        utils.sendJSONObj(res, 400, { error: "Event ID is required for deletion." });
        return;
    }

    const query = `
        DELETE FROM Event 
        WHERE eventID = ?;
    `;

    connection_pool.query(query, [eventId], function (error, results) {
        if (error) {
            utils.sendJSONObj(res, 500, { error: "Could not delete event." });
        } else {
            utils.sendJSONObj(res, 200, { success: true, message: "Event deleted successfully!" });
        }
        connection_pool.end();
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
};

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
    query = `
        SELECT Event.*, User.username AS coordinatorUsername 
        FROM Event 
        JOIN Coordinator ON Event.coordinatorID = Coordinator.coordinatorID 
        JOIN User ON Coordinator.userID = User.userID 
        WHERE Coordinator.userID = ? AND eventName LIKE "%${queryObj.q}%"`;
    console.log(query);
    connection_pool.query(query, [queryObj.userID], function (error, results, fields) {
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
        JOIN
            Attendee ON Attendee.attendeeID = Invitation.attendeeID
        WHERE 
            Attendee.userID = ? AND eventName LIKE "%${queryObj.q}%"
    `;

    console.log(query);
    connection_pool.query(query, [queryObj.userID],function (error, results, fields) {
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

exports.loadeventid = function(response, queryObj) {
    console.log("LOADING EVENT ID = " + queryObj.id);

    let connection_pool = mysql.createPool(connectionObj);
    const query = `
    SELECT 
        event.eventName, 
        DATE_FORMAT(eventDate, '%Y-%d-%b, (%c/%d/%y)') AS eventDate, 
        event.startTime AS start, 
        event.endTime AS end, 
        event.location, 
        event.description,
        IF(event.adminID IS NULL, "No", "Yes") AS verified,
        t1.coordinator,
        t2.attendee,
        COUNT(IF(invitation.status = "Declined" OR invitation.status = "Pending", 1, NULL)) AS capacity
    FROM
        event
    JOIN
        coordinator USING (coordinatorID)
    JOIN
        invitation USING (eventID)
    JOIN
        (SELECT userID, username AS coordinator FROM user) AS t1 ON t1.userID = coordinator.userID
	JOIN
		(SELECT attendeeID, username AS attendee FROM user JOIN attendee USING (userID)) AS t2 ON t2.attendeeID = invitation.attendeeID
    WHERE
        event.eventID = ?
	GROUP BY eventName, eventDate, start, end, location, description, t1.coordinator, t2.attendee;
    `;
    connection_pool.query(query, [queryObj.id],function (error, results, fields) {
        if  (error) {
            utils.sendJSONObj(response,500,error);
            connection_pool.end();
        }
        else {
            utils.sendJSONObj(response,200,results);
            connection_pool.end();
        }}); 
};

//accept is expecting a boolean true or false to set the database to accepted or declined
exports.respondtoinvite = function (response, queryObj, accept){
    let connection_pool = mysql.createPool(connectionObj);
    let invite_status = accept ? "Accepted" : "Declined";
    const query = `
    UPDATE invitation i
    JOIN attendee a USING (attendeeID)
    JOIN user u USING (userID)
    SET i.status = ?
    WHERE u.userID = ? AND i.eventID = ?;
    `

    connection_pool.query(query, [invite_status, queryObj.userID, queryObj.id],function (error, results, fields) {
        if  (error) {
            utils.sendJSONObj(response,500,error);
            connection_pool.end();
        }
        else {
            utils.sendJSONObj(response,200,results);
            connection_pool.end();
        }});
};

exports.saveFeedback = function (response, queryObj) {
    console.log("Saving feedback for event ID:", queryObj.eventID); // Debugging
    console.log("Attendee ID:", queryObj.attendeeID);
    console.log("Comments:", queryObj.comments);
    console.log("Rating:", queryObj.rating);
    let connection_pool = mysql.createPool(connectionObj);

    const query = `
        INSERT INTO Feedback (attendeeID, eventID, comments, rating, feedbackDate)
        VALUES (?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
            comments = VALUES(comments), 
            rating = VALUES(rating), 
            feedbackDate = NOW()
    `;

    connection_pool.query(query, [queryObj.attendeeID, queryObj.eventID, queryObj.comments, queryObj.rating], function (error, results) {
        if (error) {
            utils.sendJSONObj(response, 500, error);
        } else {
            utils.sendJSONObj(response, 200, { success: true, message: "Feedback saved successfully!" });
        }
        connection_pool.end();
    });
};

exports.getFeedback = function (response, queryObj) {
    let connection_pool = mysql.createPool(connectionObj);

    const query = `
        SELECT 
            f.attendeeID, f.eventID,f.comments, f.rating, f.feedbackDate, u.username
        FROM 
            Feedback f
        JOIN 
            Attendee a ON f.attendeeID = a.attendeeID
        JOIN 
            User u ON a.userID = u.userID
        WHERE 
            f.eventID = ?
        ORDER BY 
            f.feedbackDate DESC
    `;

    connection_pool.query(query, [queryObj.eventID], function (error, results) {
        if (error) {
            utils.sendJSONObj(response, 500, error);
        } else {
            utils.sendJSONObj(response, 200, results);
        }
        connection_pool.end();
    });
};

exports.deleteFeedback = function (response, queryObj) {
    let connection_pool = mysql.createPool(connectionObj);
    console.log("EXPORTS"+queryObj.attendeeID);

    const query = `
        DELETE FROM Feedback
        WHERE attendeeID = ? AND eventID = ?
    `;

    connection_pool.query(
        query,
        [queryObj.attendeeID, queryObj.eventID],
        function (error, results) {
            if (error) {
                utils.sendJSONObj(response, 500, error);
            } else if (results.affectedRows === 0) {
                utils.sendJSONObj(response, 404, { success: false, message: "No feedback found to delete." });
            } else {
                utils.sendJSONObj(response, 200, { success: true, message: "Feedback deleted successfully!" });
            }
            connection_pool.end();
        }
    );
};

exports.sendInvite = function (response, queryObj) {
    let connection_pool = mysql.createPool(connectionObj);
    query = `
        INSERT INTO invitation (attendeeID, eventID, status)
        VALUES ('${queryObj.attendeeID}', '${queryObj.eventID}', 'Pending')`;
    connection_pool.query(query, function (error, results){
        if (error) {
            console.error("Error creating Invite:", error);
            utils.sendJSONObj(response, 500, error);
        } else {
            console.log("Invite created successfully:", queryObj);
            let responseObj = {success:true, attendeeID:queryObj.attendeeID}
            utils.sendJSONObj(response, 200, responseObj);
        }
    });
};

/*    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        const inviteData = JSON.parse(body);
        const { attendeeID, eventID } = inviteData;

        // Check if the invitation already exists
        const checkQuery = `
            SELECT * FROM Invitation WHERE attendeeID = ? AND eventID = ?;
        `;
        connection_pool.query(checkQuery, [attendeeID, eventID], (error, results) => {
            if (error) {
                console.error("Error checking invitation:", error);
                utils.sendJSONObj(response, 500, { error: "Failed to send invitation." });
                connection_pool.end();
                return;
            }

            if (results.length > 0) {
                utils.sendJSONObj(response, 400, { error: "Invitation already exists." });
                connection_pool.end();
                return;
            }

            // Insert new invitation
            const insertQuery = `
                INSERT INTO Invitation (attendeeID, eventID, status)
                VALUES (?, ?, 'Pending');
            `;
            connection_pool.query(insertQuery, [attendeeID, eventID], (error) => {
                if (error) {
                    console.error("Error inserting invitation:", error);
                    utils.sendJSONObj(response, 500, { error: "Failed to send invitation." });
                } else {
                    utils.sendJSONObj(response, 200, { success: true, message: "Invitation sent successfully!" });
                }
                connection_pool.end();
            });
        });
    });
};*/
