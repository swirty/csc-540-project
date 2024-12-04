const eventForm = document.getElementById("eventForm");
const queryParams = new URLSearchParams(window.location.search);
const action = queryParams.get("action");
const eventId = queryParams.get("eventId");

// document.addEventListener("DOMContentLoaded", function () {
//     // If the action is "edit" and eventId is provided, fetch the event data and populate the form
//     if (action === "edit" && eventId) {
//         console.log("Edit action detected. Fetching event data for eventId:", eventId);
//         fetch(`/make?action=fetchEvent&id=${eventId}`)
//             .then(response => {
//                 console.log("Fetch event data response status:", response.status);
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Event data received:", data);
//                 if (data && data.event) {
//                     document.getElementById("eventId").value = data.event.id;
//                     document.getElementById("eventName").value = data.event.name;
//                     document.getElementById("startTime").value = data.event.start_time;
//                     document.getElementById("endTime").value = data.event.end_time;
//                     document.getElementById("location").value = data.event.location;
//                     document.getElementById("attendees").value = data.event.attendees || "";
//                     document.getElementById("capacity").value = data.event.capacity || "";
//                 } else {
//                     alert("Error: Event not found");
//                     console.log("Error: Event data is not found or invalid.");
//                 }
//             })
//             .catch(err => {
//                 console.error('Error fetching event data:', err);
//                 alert('Error fetching event data');
//             });
//     }
// });

// Event form submission
// eventForm.addEventListener("submit", (e) => {
//     e.preventDefault(); // Prevent the default form submission
//     console.log("Form submission detected.");

//     // Serialize form data into a query string
//     const formData = new FormData(eventForm);
//     const queryString = new URLSearchParams(formData).toString();
//     console.log("Serialized form data:", queryString);

//     // Send the GET request to save the event
//     fetch(`/make?action=saveEvent&${queryString}`)
//         .then(response => {
//             console.log("Save event response status:", response.status);
//             return response.json();
//         })
//         .then(data => {
//             console.log("Response from save event request:", data);
//             if (data.success) {
//                 alert('Event saved successfully!');
//                 console.log("Event saved successfully. Redirecting to '/events'.");
//                 window.location.href = '/events'; // Redirect to events page or wherever necessary
//             } else {
//                 alert('Error saving event: ' + data.message);
//                 console.log("Error saving event:", data.message);
//             }
//         })
//         .catch(err => {
//             console.error('Error saving event:', err);
//             alert('Error saving event');
//         });
// });