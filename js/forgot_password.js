document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('forgotForm');

  document.getElementById('sendOtpBtn').addEventListener('click', () => {
    alert("📩 OTP sent to your phone!");
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const otp = document.getElementById('otp').value.trim();

    if (otp) {
      window.location.href = 'reset_password.html';
    } else {
      alert("⚠️ Please enter OTP!");
    }
  });
});
