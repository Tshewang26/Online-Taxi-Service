// Back button function
function goBack() {
  window.history.back();
}

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value.trim();

  if (name === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }

  // Example: dummy login validation
  if (name === "admin" && password === "1234") {
    alert("Login successful!");
    window.location.href = "../html/login.html"; // redirect to login.html
  } else {
    alert("Invalid credentials. Try again!");
  }
});
