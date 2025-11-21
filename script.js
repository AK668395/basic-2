// script.js
// Function to display current date and time in UTC format
function displayDateTime() {
    const now = new Date();
    const utcDateTime = now.toUTCString();
    console.log('Current UTC Date and Time:', utcDateTime);
}

displayDateTime();
