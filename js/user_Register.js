// Form validation
document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById('registrationForm');
  
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const cid = document.getElementById('cid').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (name && phone && cid && password) {
      alert('Registration successful! Welcome to Ride Easy!');
      // Here you would typically send data to server
      // For now, just go back to login page
      window.location.href = 'login.html';
    } else {
      alert('Please fill in all fields!');
    }
  });
});