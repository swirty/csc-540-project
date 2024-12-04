--SQL Command to verify the user for authentication 
SELECT * FROM user WHERE username = ? AND userpassword = ?  

--Sql command to verify whether a username already exist when creating an account
SELECT * FROM user WHERE username = ?

--SQL COMMAND for a new user to register for an account 
INSERT INTO user (username, userpassword, email, phone, userrole)
VALUES (?, ?, ?, ?, 'user') --[username, password, email, phone]

--SQL command for when Admin Verifies Events 
UPDATE Event
SET eventStatus = 'Verified',
    adminID = [adminID], -- [AdminID] will be replaced with the actual admin's user ID
WHERE eventID = [eventID] -- [EventID] will be replaced with the specific event ID
    AND eventStatus = 'Pending';

--SQL command for Admin to View all events 

SELECT 
    eventID,
    eventName,
    eventDate,
    startTime,
    endTime,
    location,
    description,
    eventStatus,
    coordinatorID,
    adminID
FROM 
    Event;

-- SQL Command for Admin to view events filtered to where
--They can view events that are verfied or pending 

SELECT 
    eventID,
    eventName,
    eventDate,
    startTime,
    endTime,
    location,
    description,
    eventStatus,
    coordinatorID,
    adminID
FROM 
    Event
WHERE 
    eventStatus = 'Pending'; --this could switch to 'Verified' or 'Pending'


--SQL Command tow view Attendees for Events
SELECT 
    E.eventID,
    E.eventName,
    E.eventDate,
    E.startTime,
    E.endTime,
    E.location,
    E.description,
    E.eventStatus,
    CU.username AS CoordinatorUsername, 
    U.username AS AttendeeUsername,
    A.attendeeID,
    A.userEmail AS AttendeeEmail
FROM 
    Event E
JOIN 
    Coordinator C ON E.coordinatorID = C.coordinatorID
JOIN 
    User CU ON C.userID = CU.userID 
JOIN 
    Invitation I ON E.eventID = I.eventID
JOIN 
    Attendee A ON I.attendeeID = A.attendeeID
JOIN 
    User U ON A.userID = U.userID 
ORDER BY 
    E.eventID, U.username;


--Sql command to view attendees for a specific event 

SELECT 
    E.eventID,
    E.eventName,
    E.eventDate,
    E.startTime,
    E.endTime,
    E.location,
    E.description,
    E.eventStatus,
    CU.username AS CoordinatorUsername, 
    U.username AS AttendeeUsername,
    A.attendeeID,
    A.userEmail AS AttendeeEmail
FROM 
    Event E
JOIN 
    Coordinator C ON E.coordinatorID = C.coordinatorID
JOIN 
    User CU ON C.userID = CU.userID 
JOIN 
    Invitation I ON E.eventID = I.eventID
JOIN 
    Attendee A ON I.attendeeID = A.attendeeID
JOIN 
    User U ON A.userID = U.userID 
WHERE
    E.eventID = [eventID] -- [eventID] will be replaced with the actual eventid the admin wants to view 
ORDER BY 
    E.eventID, U.username;

