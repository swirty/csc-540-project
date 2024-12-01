document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    if (!eventId) {
        alert("No event ID provided!");
        return;
    }

    // Fetch event details
    fetch(`/event?id=${eventId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                populateEventDetails(data.eventDetails);
            } else {
                alert(data.message || "Error loading event details.");
            }
        })
        .catch((error) => console.error("Error:", error));

    // Populate event details on the page
    function populateEventDetails(event) {
        document.getElementById("eventID").textContent = event.name;
        // Populate other fields: location, time, capacity, attendees, etc.
    }

    // Handle attendance marking
    document.querySelectorAll(".attendance-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const action = button.textContent.includes("Attending") ? "markAttendance" : 
"unmarkAttendance";
            fetch("/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, eventId, userId: "current_user_id" }),
            })
                .then((response) => response.json())
                .then((data) => alert(data.message || "Action completed."))
                .catch((error) => console.error("Error:", error));
        });
    });

    // Handle feedback submission
    const feedbackForm = document.querySelector("form");
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const feedback = {
            action: "addFeedback",
            eventId,
            userId: "current_user_id",
            rating: document.getElementById("rating").value,
            feedback: document.getElementById("commentArea").value,
        };

        fetch("/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedback),
        })
            .then((response) => response.json())
            .then((data) => alert(data.message || "Feedback submitted."))
            .catch((error) => console.error("Error:", error));
    });
});

