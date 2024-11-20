document.getElementById("loginbutton").addEventListener("click", function (event){
    event.preventDefault();
    Login();
});

document.getElementById("registerbutton").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    Register();
});


function Login() {
    const usernameInput = document.getElementById("user").value.trim();
    const passwordInput = document.getElementById("pass").value.trim(); 

    if (!usernameInput) {
        alert("Please enter a username.");
        return;
    }

    if (!passwordInput) {
        alert("Please enter a password.");
        return;
    }
    console.log("login.js: "+usernameInput);
    const queryObj = {
        username: usernameInput,
        password: passwordInput
    };
    const queryString = queryObjectToString(queryObj);

    let AJAX = new XMLHttpRequest();

    AJAX.onerror = function() {
        alert("Network error");
    };

    AJAX.onload = function() {
        console.log("IS THIS WORKING");
        console.log("STAT: "+this.status);
        if (this.status == 200) {

             const responseObj = JSON.parse(this.responseText);
             window.location.href = "http://localhost:80/";
             alert(`Welcome, ${responseObj.user.username}!`);

        } else if (this.status == 400) {

            const responseObj = JSON.parse(this.responseText);
            alert("Invalid username or password.");
        } else {

            alert("Failed to login: " + this.responseText);
        }
    };

    console.log(JSON.stringify(queryObj));
    AJAX.open("GET", "http://localhost:80/loginbutton?" + queryString);
    AJAX.send();
}

function Register() {
    const loginContainer = document.getElementById("login-container"); // Assuming the container has this ID
    loginContainer.classList.add("fade-out"); // Add the fade-out class for animation

    // Wait for the animation to complete before navigating
    setTimeout(() => {
        window.location.href = "http://localhost:80/register";
    }, 800); // Match the animation duration (800ms)
}


// Use this function if you need it
// This function converts an object to a query string to be included in the URL
function queryObjectToString(query) {
// get the properties in the query object
// Example: for {message:"Hi I am sending an AJAX request", name: "Sahar"};
// properties will be ["message", "name" ]
let properties = Object.keys(query);
// create a string int the format "propert=value" for each property in query
// arrOfQuesryStrings will be ["message=Hi I am sending an AJAX request", "name=Sahar"]
let arrOfQuesryStrings = properties.map(prop => prop+"="+query[prop]);
//combine the strings in arrOfQuesryStrings wuth &
// return value will be "message=Hi I am sending an AJAX request&name=Sahar"
return(arrOfQuesryStrings.join('&'));
}