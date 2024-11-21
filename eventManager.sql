------- THIS WILL DROP THE WHOLE DB TO CLEAR IT!!!!!! -------
-- Creates and populates some data into the database.
-------------------------------------------------------------
DROP DATABASE IF EXISTS EventManager;
CREATE DATABASE EventManager;
USE EventManager;

-- User Table
CREATE TABLE User (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Coordinator', 'Attendee') NOT NULL
);

-- Admin Table
CREATE TABLE Admin (
    userID INT NOT NULL,
    adminID INT AUTO_INCREMENT PRIMARY KEY,
	FOREIGN KEY (userID) REFERENCES User(userID)
);

-- Coordinator Table
CREATE TABLE Coordinator (
    userID INT NOT NULL,
    coordinatorID INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (userID) REFERENCES User(userID)
);

-- Attendee Table
CREATE TABLE Attendee (
    userID INT NOT NULL,
    userEmail VARCHAR(100) NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL,
    attendeeID INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (userID) REFERENCES User(userID)
);

-- Event Table
CREATE TABLE Event (
    eventID INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    eventDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    location VARCHAR(30) NOT NULL,
    coordinatorID INT NOT NULL,
    FOREIGN KEY (coordinatorID) REFERENCES Coordinator(coordinatorID)
);

-- Invite Table
CREATE TABLE Invitation (
    attendeeID INT NOT NULL,
    eventID INT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Declined') DEFAULT 'Pending',
    PRIMARY KEY (attendeeID, eventID),
    FOREIGN KEY (attendeeID) REFERENCES Attendee(attendeeID),
    FOREIGN KEY (eventID) REFERENCES Event(eventID)
);

-- Feedback Table
CREATE TABLE Feedback (
    attendeeID INT NOT NULL,
    eventID INT NOT NULL,
    comments VARCHAR(300),
    rating ENUM("1","2","3","4","5") DEFAULT "5",
    feedbackDate DATETIME NOT NULL,
    PRIMARY KEY (attendeeID, eventID),
    FOREIGN KEY (attendeeID) REFERENCES Attendee(attendeeID),
    FOREIGN KEY (eventID) REFERENCES Event(eventID)
);

