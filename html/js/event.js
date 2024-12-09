const eventFields = {
    eventName: document.getElementById("eventName"),
    location: document.getElementById("location"),
    start: document.getElementById("start"),
    end: document.getElementById("end"),
    eventDate: document.getElementById("date"),
    coordinator: document.getElementById("coordinator"),
    capacity: document.getElementById("capacity"),
    verified: document.getElementById("verified"),
    attendees: document.getElementById("attendees"),
    description: document.getElementById("description")
};
const attendanceButton = {
    attending: document.getElementById("attending"),
    declining: document.getElementById("declining")
};
const actionButton = {
    verify: document.getElementById("verify"),
    edit: document.getElementById("edit"),
    delete: document.getElementById("delete"),
}
const inviteForm = document.getElementById("inviteForm");
let eventID = 0;

document.addEventListener("DOMContentLoaded", () => {
    doVisibility();

    const urlParams = new URLSearchParams(window.location.search);
    eventId = urlParams.get("id");

    let AJAX = new XMLHttpRequest(); 
    AJAX.onerror = function() {  
                alert("Network error");
    }
    AJAX.onload = function() { 
        if (this.status == 200){ 

            responseObj = JSON.parse(this.responseText);
            console.log(responseObj);
            if (responseObj[0]) {
                populateEvent(eventFields, responseObj);
            } else {
                alert(`No event id ${urlParameters.get('id')} found`);
            }
        }

        else{
            alert(this.responseText);

            console.log(this.status);
            console.log(this.responseText);
        }
    }

    AJAX.open("GET",`/loadevent?id=${urlParameters.get('id')}`);
	AJAX.send();
    
    if (!eventId) {
        alert("No event ID provided!");
        return;
    }

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

    // Bind invitation form submission
    if (inviteForm) {
        inviteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleInvite(eventId);
        });
    }
});

function populateEvent(fields, info) {
    //console.log(info[0].adminID);
    //do the easy fields
    for (key in fields) {
        //console.log(`assigning ${info[key]} to ${key}`);
        fields[key].textContent += info[0][key];
    }

    //do the attendees list field
    fields.attendees.textContent = fields.attendees.textContent.replace("undefined", "");
    for (i in info) {
        //console.log(info[i].attendee);
        fields.attendees.textContent += info[i].attendee + ", ";
    }
    //clean up the trailing comma
    fields.attendees.textContent = fields.attendees.textContent.replace(new RegExp(", $"), "");
};

function doVisibility(){
    const role = localStorage.getItem("role");
    console.log(role);
    switch (role) {
        case "Attendee":
            actionButton.verify.parentElement.style.visibility = "hidden";
            search.parentElement.parentElement.style.visibility = "hidden";
            /// USERS SHOULD NOT SEE DELETE BUTTONS ON COMMENTS, PUT THAT HERE!
            break;

        case "Coordinator":
            actionButton.verify.style.visibility = "hidden"
            attendanceButton.attending.parentElement.style.visibility = "hidden";
            /// COORDS SHOULD NOT SEE FEEDBACK FORM, PUT THAT HERE!
            break;

        case "Admin":
            attendanceButton.attending.parentElement.style.visibility = "hidden";
            search.parentElement.parentElement.style.visibility = "hidden";
            /// ADMINS SHOULD NOT SEE FEEDBACK FORM, PUT THAT HERE!
            break;

        default:
    }
};

//accepting the invitation
attendanceButton.attending.addEventListener("click", (event) => {
    event.preventDefault();
    const urlParameters = new URLSearchParams(window.location.search);

    let AJAX = new XMLHttpRequest(); 
    AJAX.onerror = function() {  
                alert("Network error");
    }
    AJAX.onload = function() { 
        if (this.status == 200){ 

            responseObj = JSON.parse(this.responseText);
            console.log(responseObj);
            attendanceButton.attending.classList.replace("btn-secondary", "btn-success")
            attendanceButton.declining.classList.replace("btn-success", "btn-secondary")
            if (responseObj.affectedRows=1) {
                alert("Sucess!! You are now attending!")
            } else {
                alert("Logical Error in the DB!");
            }
        }

        else{
            alert(this.responseText);

            console.log(this.status);
            console.log(this.responseText);
        }
    }

    const userID = localStorage.getItem("userID");
    AJAX.open("GET",`/acceptinvite?id=${urlParameters.get('id')}&userID=${userID}`);
	AJAX.send();
});

//declining the invitation
attendanceButton.declining.addEventListener("click", (event) => {
    event.preventDefault();
    const urlParameters = new URLSearchParams(window.location.search);

    let AJAX = new XMLHttpRequest(); 
    AJAX.onerror = function() {  
                alert("Network error");
    }
    AJAX.onload = function() { 
        if (this.status == 200){ 

            responseObj = JSON.parse(this.responseText);
            console.log(responseObj);
            attendanceButton.declining.classList.replace("btn-secondary", "btn-success")
            attendanceButton.attending.classList.replace("btn-success", "btn-secondary")
            if (responseObj.affectedRows=1) {
                alert("Sucess, you have declined to attend.")
            } else {
                alert("Logical Error in the DB!");
            }
        }

        else{
            alert(this.responseText);

            console.log(this.status);
            console.log(this.responseText);
        }
    }

    const userID = localStorage.getItem("userID");
    AJAX.open("GET",`/declineinvite?id=${urlParameters.get('id')}&userID=${userID}`);
	AJAX.send();
});

// Handle event actions (edit, delete, verify, etc.)
function handleEventAction(action, eventId, additionalData = null) {
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
            } else {
                location.reload(); // Reload for other actions
            }
        } else {
            alert("Failed to perform action: " + this.responseText);
        }
    };

    let actionData = { action, eventId, userId: localStorage.getItem("userID") };
    if (additionalData) {
        actionData.newDetails = additionalData;
    }

    AJAX.open("POST", "/event");
    AJAX.setRequestHeader("Content-Type", "application/json");
    AJAX.send(JSON.stringify(actionData));
}

// Verify Event
function verifyEvent(eventId) {
    handleEventAction("verifyEvent", eventId);
}

// Delete Event
function deleteEvent(eventId) {
    handleEventAction("deleteEvent", eventId);
}

// Edit Event
function editEvent(eventId) {
    const newDetails = {
        name: prompt("Enter new event name:"),
        start: prompt("Enter new start time:"),
        end: prompt("Enter new end time:"),
        location: prompt("Enter new location:"),
        capacity: prompt("Enter new capacity:")
    };
    handleEventAction("editEvent", eventId, newDetails);
}

// Handle invitation form submission
function handleInvite(eventId) {
    const inviteData = {
        attendeeID: document.getElementById("attendeeID").value,
        eventID: eventId
    };
    console.log(inviteData);

    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error while sending Invite..");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            const responseObj = JSON.parse(this.responseText);
            if (responseObj.success) {
                alert("Invite sucessfully sent to: " + responseObj.attendeeID);
            } else {
                alert(responseObj.message || "Error sending Invite.");
            }
        } else {
            alert("Error: " + this.responseText);
        }
    };

    AJAX.open("GET", `/sendInvite?eventID=${inviteData.eventID}&attendeeID=${inviteData.attendeeID}`);
    AJAX.send();
}

// AJAX helper for general requests
function sendAjax(url, data, method, callback) {
    let AJAX = new XMLHttpRequest();
    AJAX.onload = () => {
        if (AJAX.status === 200) {
            callback(JSON.parse(AJAX.responseText));
        } else {
            alert("Request failed: " + AJAX.responseText);
        }
    };
    AJAX.onerror = () => {
        alert("An error occurred during the request.");
    };
    AJAX.open(method, url);
    if (data) {
        AJAX.setRequestHeader("Content-Type", "application/json");
        AJAX.send(JSON.stringify(data));
    } else {
        AJAX.send();
    }
}

document.getElementById("feedbackForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const rating = document.getElementById("rating").value;
    const comments = document.getElementById("commentArea").value;
    const userID = localStorage.getItem("userID");
    const urlParameters = new URLSearchParams(window.location.search);
    console.log("Event ID from URL:", urlParameters.get('id')); 
    const eventID = urlParameters.get('id');

    if (!eventID) {
        alert("Event ID is missing. Cannot submit feedback.");
        return;
    }
    
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            alert("Feedback submitted successfully!");
            loadFeedback(); // Reload the feedback after submission
        } else {
            alert("Failed to submit feedback.");
        }
    };

    AJAX.open("GET", `/saveFeedback?attendeeID=${userID}&eventID=${eventID}&comments=${comments}&rating=${rating}`);
    AJAX.send();
});

function loadFeedback() {
    const feedbackList = document.getElementById("feedbackList");
    feedbackList.innerHTML = ""; // Clear existing feedback

    const urlParameters = new URLSearchParams(window.location.search);
    const eventID = urlParameters.get('id');
    const role = localStorage.getItem("role");
    const userID = localStorage.getItem("userID");

    if (!eventID) {
        console.error("Event ID is missing. Cannot load feedback."); // Debugging
        return;
    }

    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            const feedback = JSON.parse(this.responseText);
            console.log("FEEDBACK: "+feedback.attendeeID);
            if (feedback.length === 0) {
                feedbackList.innerHTML = `<li class="text-center text-muted"></li>`;
            } else {
                feedback.forEach((item) => {
                    console.log("Feedback Item Details:", item.attendeeID, item.eventID); // Check individual item prop
                    const deleteButton =
                    role === "Admin"
                        ? `<a href="#" class="btn btn-danger rounded-0 delete-feedback" 
                            data-attendee-id="${item.attendeeID}" 
                            data-event-id="${item.eventID}">
                            Delete Comment
                        </a>`
                        : "";
                    console.log("Generating delete button:", item.attendeeID, item.eventID);
                    const feedbackItem = `
                        <li class="d-flex flex-column align-items-end bg-success m-1 rounded">
                            ${deleteButton}
                            <div class="w-100 p-2 px-5 d-flex">
                                <p class="h2 me-5">${item.rating}/5</p>
                                <p class="h5 text-wrap">${item.comments}</p>
                            </div>
                            <div class="flex-fill p-2 px-5 h6"><i>${item.username}</i> on ${new Date(item.feedbackDate).toLocaleString()}</div>
                        </li>
                    `;
                    feedbackList.innerHTML += feedbackItem;
                });

              
                if (role === "Admin") {
                    document.querySelectorAll(".delete-feedback").forEach((button) => {
                        button.addEventListener("click", (event) => {
                            event.preventDefault();
                            const attendeeID = button.getAttribute("data-attendee-id");
                            const eventID = button.getAttribute("data-event-id");
                            console.log("EVENTLISTENER eventID: "+eventID);
                            
                            
                            if (!attendeeID || !eventID) {
                                console.error("Missing parameters for deleting feedback.");
                                alert("Error: Missing parameters for deleting feedback.");
                                return;
                            }

                            deleteFeedback(attendeeID, eventID);
                        });
                    });
                }
            }
        } else {
            alert("Failed to load feedback.");
        }
    };
    AJAX.open("GET", `/getFeedback?eventID=${eventID}`);
    AJAX.send();
}

document.addEventListener("DOMContentLoaded", loadFeedback);

function deleteFeedback(attendeeID, eventID) {
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            alert("Feedback deleted successfully!");
            loadFeedback(); 
        } else {
            alert("Failed to delete feedback.");
        }
    };
    console.log("ATTENDEE: "+attendeeID);
    AJAX.open("GET", `/deleteFeedback?attendeeID=${attendeeID}&eventID=${eventID}`);
    AJAX.send();
}