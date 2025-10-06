function loginUser() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();

  if (username === "" || password === "") {
    alert("Please enter both username and password.");
  } else {
    alert("Welcome, " + username + "!");
    // redirect example:
    // window.location.href = "dashboard.html";
  }
}

// Get elements
const registerLink = document.querySelector(".register-link");
const popup = document.getElementById("registerPopup");
const closeBtn = document.querySelector(".popup-close");

// Show popup when clicking register
registerLink.addEventListener("click", function(e) {
  e.preventDefault(); // stop page refresh
  popup.style.display = "flex";
});

// Close popup
closeBtn.addEventListener("click", function() {
  popup.style.display = "none";
});

// Optional: close when clicking outside the box
window.addEventListener("click", function(e) {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

const userBtn = document.getElementById("userBtn");
const driverBtn = document.getElementById("driverBtn");

userBtn.addEventListener("click", function() {
  window.location.href = "user_Register.html";
});

driverBtn.addEventListener("click", function() {
  window.location.href = "driver_Register.html"; 
});
