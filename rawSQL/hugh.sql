-- Authenticate a User for login
SELECT * FROM User WHERE username = 'someUsername' AND password = 'hashedPassword';

-- Get role of user
SELECT role FROM User WHERE userID = 1;

-- Admin to view all events
SELECT * FROM Event;

-- For ammin to view all events created by specific event coordinator
SELECT * FROM Event WHERE coordinatorID = 2;

-- Send an invitation
INSERT INTO Invitation (attendeeID, eventID, status)
VALUES (3, 1, 'Pending');

-- Event Coordinator or Admin to view invitations for a specific Attendee
SELECT i.invitationID, e.eventName, e.eventDate, e.startTime, e.location, i.status
FROM Invitation i
JOIN Event e ON i.eventID = e.eventID
WHERE i.attendeeID = 3;

-- Update Invitation Status
UPDATE Invitation
SET status = 'Accepted', responseDate = NOW()
WHERE attendeeID = 3 AND eventID = 1;

UPDATE Invitation
SET status = 'Declined', responseDate = NOW()
WHERE attendeeID = 3 AND eventID = 1;

-- Event Coordinator or Admin Delete an invitation
DELETE FROM Invitation WHERE attendeeID = 3 AND eventID = 1;

-- Add feedback for an event from any attendee
INSERT INTO Feedback (attendeeID, eventID, comments, rating, feedbackDate)
VALUES (3, 1, 'Great event, had a lot of fun!', '5', NOW());

-- Event Coordinator or Admin view feedback for a specific event
SELECT a.userEmail, f.comments, f.rating, f.feedbackDate
FROM Feedback f
JOIN Attendee a ON f.attendeeID = a.attendeeID
WHERE f.eventID = 1;

-- Update Feedback written by attendee
UPDATE Feedback
SET comments = 'Updated comment', rating = '4'
WHERE attendeeID = 3 AND eventID = 1;

-- Delete feedback written by attendee
DELETE FROM Feedback WHERE attendeeID = 3 AND eventID = 1;

-- List all users with their roles
SELECT username, role FROM User;
