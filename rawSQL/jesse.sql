-- Register new user
INSERT INTO User (username, password, role)
VALUES ("john", "testPassword123", "Attendee");

INSERT INTO Attendee (userID, userEmail, phoneNumber)
SELECT userID, "john@fakeemail.com" AS userEmail, "123-456-7890" AS phoneNumber 
FROM User WHERE username="john";


-- Create Bball tournament event

INSERT INTO Event (coordinatorID, eventName, eventDate, startTime, endTime, location, description)
VALUES (2, "Basketball Tournament", "2024-12-15", "12:00", "18:00", "Moore Field House", "An exciting basketball tournament for local teams.");

-- Verify event

UPDATE Event 
SET adminID = 1 
WHERE eventID = 3;


-- Update Event 

UPDATE Event SET 
    eventName = "Basketball Championship",
    eventDate = "2024-12-16",
    startTime = "10:00",
    endTime = "17:00",
    location = "New Venue",
    description = "Updated basketball tournament details."
WHERE eventID = 3;  

