--- REGISTER USER ATTENDEE
INSERT INTO User (username, password, role)
VALUES	("test", "password", "Attendee");
    
INSERT INTO Attendee (userID, userEmail, phoneNumber)
SELECT userID, "test@test.test" AS userEmail, "111-111-1111" AS phoneNumber 
FROM User WHERE username="test";

