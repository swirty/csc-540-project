CREATE DATABASE eventManager;
USE eventManager;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    userpassword VARCHAR(50) NOT NULL,
    userrole VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL
);

SELECT * FROM user;