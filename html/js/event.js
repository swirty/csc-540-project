document.addEventListener("DOMContentLoaded", () => {
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
    console.log(info[0].adminID);
    //do the easy fields
    for (key in fields) {
        //console.log(`assigning ${info[key]} to ${key}`);
        fields[key].textContent += info[0][key];
    }

    //do the attendees list field
    fields.attendees.textContent = fields.attendees.textContent.replace("undefined", "");
    for (i in info) {
        console.log(info[i].attendee);
        fields.attendees.textContent += info[i].attendee + ", ";
    }
    //clean up the trailing comma
    fields.attendees.textContent = fields.attendees.textContent.replace(new RegExp(", $"), "");
};

function doVisibility(){

};