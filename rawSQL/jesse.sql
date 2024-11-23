-- Fetch Users and Roles
SELECT * FROM User;


--Fetch Events created by Coordinators

SELECT e.eventName, e.eventDate, e.startTime, e.endTime, c.coordinatorID
FROM Event e
JOIN Coordinator c ON e.coordinatorID = c.coordinatorID;

-- Invitations for a Specific Event
SELECT i.attendeeID, a.userEmail, i.status
FROM Invitation i
JOIN Attendee a ON i.attendeeID = a.attendeeID
WHERE i.eventID = 1;

--Feedback for an event
SELECT f.comments, f.rating, a.userEmail
FROM Feedback f
JOIN Attendee a ON f.attendeeID = a.attendeeID
WHERE f.eventID = 1;
