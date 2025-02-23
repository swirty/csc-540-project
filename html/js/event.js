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
};
const inviteForm = document.getElementById("inviteForm");
let eventID = 0;

// Add event listeners for action buttons
document.addEventListener("DOMContentLoaded", () => {
    doVisibility();

    const urlParameters = new URLSearchParams(window.location.search);
    eventID = urlParameters.get("id");
    //console.log(urlParameters.get('id'));
    
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

    if (actionButton.verify) {
        actionButton.verify.addEventListener("click", (event) => {
            event.preventDefault();
            verifyEvent(eventID);
        });
    }

    if (actionButton.delete) {
        actionButton.delete.addEventListener("click", (event) => {
            event.preventDefault();
            deleteEvent(eventID);
        });
    }

    if (actionButton.edit) {
        actionButton.edit.addEventListener("click", (event) => {
            event.preventDefault();
            editEvent(eventID);
        });
    }

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
            handleInvite(eventID);
        });
    }
});

// Updated Verify Event
function verifyEvent(eventId) {
    const currentStatus = eventFields.verified.textContent.trim();
    const isVerified = currentStatus === "No" ? "Verified" : "Pending";
    const userID = localStorage.getItem("userID");

    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error while verifying event.");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            alert("Event verification updated successfully!");
            eventFields.verified.textContent = "Verified: Yes";
        } else {
            alert(`Failed to verify event: ${this.status} - ${this.responseText}`);
        }
    };

    AJAX.open("GET", `/verifyEvent?eventID=${eventId}&isVerified=${isVerified}&userID=${userID}`);
    AJAX.send();
}

// Updated Delete Event
function deleteEvent(eventId) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error while deleting event.");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            alert("Event deleted successfully!");
            window.location.href = "/home"; // Redirect to home page
        } else {
            alert(`Failed to delete event: ${this.status} - ${this.responseText}`);
        }
    };

    AJAX.open("GET", `/deleteEvent?eventID=${eventId}`);
    AJAX.send();
}

// Updated Edit Event
function editEvent(eventId) {
    let newDetails = {
        name: prompt("Enter new event name:", eventFields.eventName.textContent
                .substring(eventFields.eventName.textContent.indexOf(":")+1).trim()),
        start: prompt("Enter new start time:", eventFields.start.textContent
                .substring(eventFields.start.textContent.indexOf(":")+1).trim()),
        end: prompt("Enter new end time:", eventFields.end.textContent
                .substring(eventFields.end.textContent.indexOf(":")+1).trim()),
        location: prompt("Enter new location:", eventFields.location.textContent
                .substring(eventFields.location.textContent.indexOf(":")+1).trim()),
    };

    // if (Object.values(newDetails).some((value) => !value.trim())) {
    //     alert("All fields must be filled to edit the event.");
    //     return;
    // }

    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
        alert("Network error while editing event.");
    };
    AJAX.onload = function () {
        if (this.status === 200) {
            alert("Event updated successfully!");
            location.reload(); // Reload page to reflect changes
        } else {
            alert(`Failed to edit event: ${this.status} - ${this.responseText}`);
        }
    };

    const queryString = Object.entries(newDetails)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

    AJAX.open("GET", `/edit?eventID=${eventId}&${queryString}`);
    AJAX.send();
}

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
            inviteForm.parentElement.parentElement.style.visibility = "hidden";
            /// USERS SHOULD NOT SEE DELETE BUTTONS ON COMMENTS, PUT THAT HERE!
            break;

        case "Coordinator":
            actionButton.verify.style.visibility = "hidden"
            attendanceButton.attending.parentElement.style.visibility = "hidden";
            /// COORDS SHOULD NOT SEE FEEDBACK FORM, PUT THAT HERE!
            break;

        case "Admin":
            attendanceButton.attending.parentElement.style.visibility = "hidden";
            inviteForm.parentElement.parentElement.style.visibility = "hidden";
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
