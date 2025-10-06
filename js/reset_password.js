document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const successModal = new bootstrap.Modal(document.getElementById("successModal"));
  const closeSuccess = document.getElementById("closeSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (newPass === confirmPass && newPass.length > 0) {
      // ✅ Show success popup
      successModal.show();
    } else {
      alert("Passwords do not match!");
    }
  });

  // ✅ Redirect to login when close button is pressed
  closeSuccess.addEventListener("click", () => {
    window.location.href = "mainlogin.html";
  });
});
