const eventFields = {
    eventName: document.getElementById("eventName"),
    location: document.getElementById("location"),
    start: document.getElementById("start"),
    end: document.getElementById("end"),
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
const search = document.getElementById("search");

document.addEventListener("DOMContentLoaded", () => {
    //console.log(eventFields);

    doVisibility();

    const urlParameters = new URLSearchParams(window.location.search);
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