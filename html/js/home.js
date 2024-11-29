document.getElementById("makeeventbutton").addEventListener("click", function (event){
    event.preventDefault();
    MakeEvent();
});


function loadEventsBasedOnRole() {
    const userID = localStorage.getItem("userID");
    const role = localStorage.getItem("role");

    if (!userID) {
        alert("User ID or role is not available. Please log in again.");
        window.location.href = "/login";
        return;
    }

    console.log("User Role:", role);

    if (role === "Admin" || role === "Attendee") {
        const makeEventButton = document.querySelector("a[href='make']");
        if (makeEventButton) {
            makeEventButton.style.display = "none";
        }
    }

    if (role === "Admin") {
        sendLoadEventsAdmin();
    } else if (role === "Coordinator") {
        sendLoadEventsCoord();
    } else if (role === "Attendee") {
        sendLoadEventsAttendtee();
    } else {
        alert("Role not recognized or insufficient permissions");
        console.error("Unexpected role:", role);
    }
}

function setWelcomeMessage() {
    const username = localStorage.getItem("username");
    if (username) {
        const welcomeMessage = document.getElementById("welcomeMessage");
        welcomeMessage.textContent = `Welcome, ${username}!`;
    } else {
        alert("User not logged in. Redirecting to login.");
        window.location.href = "/login";
    }
}


setWelcomeMessage();
loadEventsBasedOnRole();

function sendLoadEventsAdmin() {
    let AJAX = new XMLHttpRequest(); 
    AJAX.onerror = function() {  
                alert("Network error");
    }
    AJAX.onload = function() { 
        if (this.status == 200){ 

            responseObj = JSON.parse(this.responseText);
            if (responseObj.times) {
                console.log("EVENTS"+responseObj.times[0]);
                console.log("EVENTS: "+responseObj);
                updateTimes(responseObj.times);
            } else {
                alert("No events found");
            }
        }

        else{
            alert(this.responseText);

            console.log(this.status);
            console.log(this.responseText);
        }
    } 

    AJAX.open("GET","/loadeventsadmin");
	AJAX.send();
}

function sendLoadEventsCoord() {
    const coordinatorID = localStorage.getItem("userID");

    if (!coordinatorID) {
        alert("Coordinator ID not found. Please log in again.");
        window.location.href = "/login";
        return;
    }
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function() {  
                alert("Network error");
    }
    AJAX.onload = function() { 
        if (this.status == 200){

            responseObj = JSON.parse(this.responseText);
            if (responseObj.times) {
                console.log("EVENTS"+responseObj.times[0]);
                console.log("EVENTS: "+responseObj);
                updateTimes(responseObj.times);
            } else {
                alert("No events found");
            }
        } 

        else{

            alert(this.responseText);

            console.log(this.status);
            console.log(this.responseText);
        }
    }

    AJAX.open("GET", `/loadeventscoord?coordinatorID=${coordinatorID}`);
	AJAX.send();
}

function sendLoadEventsAttendee() {
    const attendeeID = localStorage.getItem("userID");

    if (!attendeeID) {
        alert("Attendee ID not found. Please log in again.");
        window.location.href = "/login";
        return;
    }
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function() {  
                alert("Network error");
    }
    AJAX.onload = function() {

        if (this.status == 200){
            responseObj = JSON.parse(this.responseText);
            if (responseObj.times) {
                console.log("EVENTS"+responseObj.times[0]);
                console.log("EVENTS: "+responseObj);
                updateTimes(responseObj.times);
            } else {
                alert("No events found");
            }
        }

        else{
            alert(this.responseText);

            console.log(this.status);
            console.log(this.responseText);
        } 
    }

    AJAX.open("GET", `/loadeventsattendee?attendeeID=${attendeeID}`);
	AJAX.send();
}

function MakeEvent() {

    window.location.href = "http://localhost:80/make";

}

function updateTimes(events) {
        let table = document.getElementById("eventTable");
        for (row of events) {
                let trow = document.createElement("li"); 
                trow.className = "p-0 rounded-0 list-group-item d-flex justify-content-around border-bottom";
                trow.innerHTML = `
                <div class="col-3 p-2 text-center text-wrap">${row.eventName}</div>
                <div class="col-3 p-2 text-center text-wrap">${row.location}</div>
                <div class="col-3 p-2 text-center text-wrap">${row.startTime} - ${row.endTime}</div>
                <div class="col-3 p-2 text-center text-wrap">${row.coordinatorUsername}</div>
                `;
                table.appendChild(trow);                      
        }
}