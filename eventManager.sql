CREATE DATABASE EventManager;
USE EventManager;

-- User Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Coordinator', 'Attendee') NOT NULL
);

-- Venue Table
CREATE TABLE Venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    capacity INT
);

-- Event Table

CREATE TABLE Events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue_id INT NOT NULL,
    coordinator_id INT NOT NULL,
    FOREIGN KEY (coordinator_id) REFERENCES Users(user_id),
    FOREIGN KEY (venue_id) REFERENCES Venues(venue_id)
);

-- Invite Table
CREATE TABLE Invitations (
    invitation_id INT AUTO_INCREMENT PRIMARY KEY,
    attendee_id INT NOT NULL,
    event_id INT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Declined') DEFAULT 'Pending',
    FOREIGN KEY (attendee_id) REFERENCES Users(user_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);


