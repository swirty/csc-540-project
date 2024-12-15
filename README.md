# PRE REQUISITES
- MySQL Workbench and MySQL Server installed
- node.js and node package manager (npm) installed

# USAGE:
1. Create a user in MySQL Workbench named "newuser" with the password "10013070", or set a custom user and password in EventManagerQuery.js on 7 and 8. Make sure the user can insert and delete data from tables.
2. Run the eventManager.sql script in MySQL workbench with sufficient privileges to drop and create tables. This will initialize the database and populate some data.
3. Launch a shell as admin, use "npm install mysql2" to install the node package to interact with a mysql server.
4. In an elevated shell, use "node app.js" to run the node server application.
5. Connect to the application at the URL "localhost/login".
6. If you want to login as another user, navigate directly to "localhost/login" again.
