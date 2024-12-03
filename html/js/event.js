document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    if (!eventId) {
        alert("No event ID provided!");
        return;
    }

    // Fetch event details
    sendLoadEventDetails(eventId);

    // Attach event listeners for buttons after loading details
    document.getElementById("actionButtons")?.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const action = e.target.id; // The ID corresponds to the action, e.g., "editEvent"
            handleEventAction(action, eventId);
        }
    });

    // Handle feedback submission
    const feedbackForm = document.querySelector("form");
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        sendFeedback(eventId);
    });
});

function sendLoadEventDetails(eventId) {
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error while loading event details.");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            const responseObj = JSON.parse(this.responseText);
            if (responseObj.success) {
                populateEventDetails(responseObj.eventDetails);
            } else {
                alert(responseObj.message || "Error loading event details.");
            }
        } else {
            alert("Failed to load event details: " + this.responseText);
        }
    };

    AJAX.open("GET", `/event?id=${eventId}`);
    AJAX.send();
}

function populateEventDetails(event) {
    document.getElementById("eventID").textContent = event.name;
    document.getElementById("eventLocation").textContent = event.location;
    document.getElementById("eventStart").textContent = event.start_time;
    document.getElementById("eventEnd").textContent = event.end_time;
    document.getElementById("eventCapacity").textContent = event.capacity;
    document.getElementById("eventAttendees").textContent = event.attendees;

    // Update buttons based on user role
    const role = localStorage.getItem("role");
    const buttonContainer = document.getElementById("actionButtons");
    buttonContainer.innerHTML = ""; // Clear existing buttons

    if (role === "Admin" || role === "Coordinator") {
        buttonContainer.innerHTML += `
            <button id="editEvent">Edit Event</button>
            <button id="deleteEvent">Delete Event</button>
            <button id="inviteEvent">Invite to Event</button>
            <button id="deleteFeedback">Delete Feedback</button>
        `;
    }

    if (role === "Admin") {
        buttonContainer.innerHTML += `<button id="verifyEvent">Verify Event</button>`;
    }

    buttonContainer.innerHTML += `
        <button id="leaveFeedback">Leave Feedback</button>
        <button id="rateEvent">Rate Event</button>
    `;
}

function handleEventAction(action, eventId) {
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error while performing the action.");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            const responseObj = JSON.parse(this.responseText);
            alert(responseObj.message || "Action completed successfully.");
            if (action === "deleteEvent") {
                window.location.href = "/events"; // Redirect to events list
            }
        } else {
            alert("Failed to perform action: " + this.responseText);
        }
    };

    let actionData = { action, eventId, userId: localStorage.getItem("userID") };
    AJAX.open("POST", "/event");
    AJAX.setRequestHeader("Content-Type", "application/json");
    AJAX.send(JSON.stringify(actionData));
}

function sendFeedback(eventId) {
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error while submitting feedback.");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            const responseObj = JSON.parse(this.responseText);
            alert(responseObj.message || "Feedback submitted successfully.");
        } else {
            alert("Failed to submit feedback: " + this.responseText);
        }
    };

    const feedback = {
        action: "addFeedback",
        eventId,
        userId: localStorage.getItem("userID"),
        rating: document.getElementById("rating").value,
        feedback: document.getElementById("commentArea").value,
    };

    AJAX.open("POST", "/event");
    AJAX.setRequestHeader("Content-Type", "application/json");
    AJAX.send(JSON.stringify(feedback));
}

