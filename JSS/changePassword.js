const form = document.getElementById('change-password-form');
const msgBox = document.getElementById('message-box');

/**
 * Display a message in the message box
 */
function showMessage(message, type) {
  msgBox.textContent = message;
  msgBox.className = `message-box show ${type}`;
  
  setTimeout(() => {
    msgBox.classList.remove('show');
    setTimeout(() => {
      msgBox.className = 'message-box';
    }, 500);
  }, 5000);
}

/**
 * Handle form submission
 */
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const currentPass = document.getElementById('current-password').value;
  const newPass = document.getElementById('new-password').value;
  const confirmPass = document.getElementById('confirm-password').value;

  if (newPass.length < 8) {
    showMessage("New password must be at least 8 characters long.", 'error');
    return;
  }

  if (newPass !== confirmPass) {
    showMessage("New password and confirmation password do not match.", 'error');
    return;
  }

  console.log('Password change initiated...');
  console.log('Current:', currentPass, 'New:', newPass);

  setTimeout(() => {
    showMessage("Password updated successfully! You will be logged out soon.", 'success');
    form.reset();
  }, 1000);
});

/**
 * Back button functionality
 */
function goBack() {
  window.history.back();
}

/**
 * Touch feedback for mobile
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.submit-btn, .back-btn').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    element.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
});
