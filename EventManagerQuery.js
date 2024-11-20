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



    const loginQuery = 'SELECT * FROM user WHERE username = ? AND userpassword = ?';

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
            const user = { id: results[0].id, username: results[0].username, email: results[0].email };
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
            INSERT INTO user (username, userpassword, email, phone, userrole)
            VALUES (?, ?, ?, ?, 'user')
        `;
            
        connection_pool.query(insertUserQuery, [username, password, email, phone], function (insertError) {
            if (insertError) {
                console.error("Error inserting new user:", insertError);
                utils.sendJSONObj(response, 500, { error: "Could not create user. Please try again." });
            } else {
                console.log("User successfully registered:", username);
                utils.sendJSONObj(response, 200, { success: true, message: "Signup successful!", user: { username, email, phone } });
            }
            connection_pool.end();
        });
    });
};