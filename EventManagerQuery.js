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
        event.eventDate, 
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