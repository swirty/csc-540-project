document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const eventData = {
            name: document.getElementById("event").value,
            start: document.getElementById("start").value,
            end: document.getElementById("end").value,
            location: document.getElementById("location").value,
            attendees: document.getElementById("attendees").value,
            capacity: document.getElementById("capacity").value,
        };

        let AJAX = new XMLHttpRequest();
        AJAX.open("POST", "/make");
        AJAX.setRequestHeader("Content-Type", "application/json");

        AJAX.onload = () => {
            if (AJAX.status === 200) {
                const data = JSON.parse(AJAX.responseText);
                alert("Event created successfully!");
                window.location.href = "/home"; // Redirect to home page
            } else {
                alert("Failed to create event: " + AJAX.responseText);
            }
        };

        AJAX.onerror = () => {
            alert("An error occurred while creating the event.");
        };

        AJAX.send(JSON.stringify(eventData));
    });
});

