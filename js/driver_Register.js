// Driver Registration form validation with popup + redirect
document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById('registrationForm');
  const popup = document.getElementById('successPopup');
  const closeBtn = document.getElementById('closePopup');

  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const cid = document.getElementById('cid').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (password !== confirmPassword) {
      alert('⚠️ Passwords do not match!');
      return;
    }

    if (name && phone && cid && password) {
      // Show popup
      popup.style.display = 'block';
    } else {
      alert('⚠️ Please fill in all fields!');
    }
  });

  // Close popup and redirect
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    window.location.href = 'mainlogin.html';
  });
});
