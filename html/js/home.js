document.getElementById("makeeventbutton").addEventListener("click", function (event){
    event.preventDefault();
    MakeEvent();
});

document.getElementById("searchbutton").addEventListener("click", function (event){
    event.preventDefault();
    loadEventsBasedOnRole(document.getElementById("search").value);
});

function loadEventsBasedOnRole(query) {
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

    // undefined object queries are edge cases and misbehave in the sql
    if(query == undefined) {
        query = '';
    }

    if (role === "Admin") {
        sendLoadEventsAdmin(query);
    } else if (role === "Coordinator") {
        sendLoadEventsCoord(query);
    } else if (role === "Attendee") {
        sendLoadEventsAttendee(query);
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

function sendLoadEventsAdmin(q) {
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

    AJAX.open("GET",`/loadeventsadmin?q=${q}`);
	AJAX.send();
}

function sendLoadEventsCoord(q) {
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

    AJAX.open("GET", `/loadeventscoord?coordinatorID=${coordinatorID}&q=${q}`);
	AJAX.send();
}

function sendLoadEventsAttendee(q) {
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

    AJAX.open("GET", `/loadeventsattendee?attendeeID=${attendeeID}&q=${q}`);
	AJAX.send();
}

function MakeEvent() {

    window.location.href = "http://localhost:80/make";

}

function updateTimes(events) {
        let list = document.getElementById("eventTable");
        console.log(list.children.length)
        while (list.children.length > 1){
            console.log(list.children.length)
            list.removeChild(list.lastChild);
        }
        for (row of events) {
                let trow = document.createElement("li"); 
                trow.className = "p-0 rounded-0 list-group-item d-flex justify-content-around border-bottom";
                trow.innerHTML = `
                <div class="col-3 p-2 text-center text-wrap">${row.eventName}</div>
                <div class="col-3 p-2 text-center text-wrap">${row.location}</div>
                <div class="col-3 p-2 text-center text-wrap">${row.startTime} - ${row.endTime}</div>
                <div class="col-3 p-2 text-center text-wrap">${row.coordinatorUsername}</div>
                `;
                list.appendChild(trow);                      
        }
}