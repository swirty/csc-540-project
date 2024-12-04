document.getElementById("signupbutton").addEventListener("click", function (event) {
    event.preventDefault(); 
    Signup();
});

function Signup() {
    const usernameInput = document.getElementById("user").value.trim();
    const passwordInput = document.getElementById("pass").value.trim(); 
    const emailInput = document.getElementById("email").value.trim(); 
    const phoneInput = document.getElementById("phone").value.trim(); 

    if (!usernameInput) {
        alert("Please enter a username.");
        return;
    }

    if (!passwordInput) {
        alert("Please enter a password.");
        return;
    }
    if (!emailInput) {
        alert("Please enter an Email");
        return;
    }
    if (!phoneInput) {
        alert("Please enter a phone number.");
        return;
    }

    const queryObj = {
        username: usernameInput,
        password: passwordInput,
        email: emailInput,
        phone: phoneInput
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
            console.log("This message has been passed");
            const responseObj = JSON.parse(this.responseText);
            alert("You have Successfully created your account");
        } else {
            alert("Failed to Create Account");
        }
    };

    console.log(JSON.stringify(queryObj));
    AJAX.open("GET", "http://localhost:80/signupbutton?" + queryString);
    AJAX.send();
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