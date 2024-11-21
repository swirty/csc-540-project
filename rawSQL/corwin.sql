--- REGISTER USER ATTENDEE
INSERT INTO User (username, password, role)
VALUES	("test", "password", "Attendee");
    
INSERT INTO Attendee (userID, userEmail, phoneNumber)
SELECT userID, "test@test.test" AS userEmail, "111-111-1111" AS phoneNumber 
FROM User WHERE username="test";

--- CREATE EVENT
INSERT INTO Event (coordinatorID, eventName, eventDate, startTime, endTime, location, description)
VALUES	(1, "Party", "2024-11-21", "12:30", "15:40", "location", "big long description, typing text to fill the space");

--- VERIFY EVENT
UPDATE Event SET adminID="1" WHERE eventID=2;

--- UPDATE EVENT
UPDATE Event SET 
	eventName = "newName",
	eventDate = "0001-01-01",
    startTime = "1:00",
    endTime = "1:00",
    location = "newLocation",
description = "newDescription" WHERE eventID = 1;