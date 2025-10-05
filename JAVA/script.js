document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // --- Destination Search ---
  const searchInput = document.getElementById("destination-search");
  const destinationList = document.getElementById("destination-list");
  if (searchInput && destinationList) {
    const destinationItems = destinationList.querySelectorAll(".destination-item");

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      destinationItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? "flex" : "none";
      });
    });
  }

  // --- Profile Modal ---
  const profileTrigger = document.getElementById("sidebar-profile-trigger");
  const modal = document.getElementById("edit-profile-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const saveBtn = document.getElementById("modal-save-btn");

  const nameInput = document.getElementById("modal-user-name");
  const idInput = document.getElementById("modal-user-id");
  const idError = document.getElementById("id-error");

  const userName = document.getElementById("user-name");
  const userId = document.getElementById("user-id");

  // Avatar handling
  const avatar = document.getElementById("user-avatar");
  const modalAvatar = document.getElementById("modal-avatar-preview-lg");
  const fileUploadInput = document.getElementById("file-upload-input");

  if (profileTrigger) {
    profileTrigger.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Avatar click to upload
  if (modalAvatar && fileUploadInput) {
    modalAvatar.addEventListener("click", () => fileUploadInput.click());
    fileUploadInput.addEventListener("change", () => {
      const file = fileUploadInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          avatar.style.backgroundImage = `url(${e.target.result})`;
          avatar.textContent = "";
          modalAvatar.style.backgroundImage = `url(${e.target.result})`;
          modalAvatar.textContent = "";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Save profile changes
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const nameValue = nameInput.value.trim();
      const idValue = idInput.value.trim();

      // Validate CID
      if (!/^\d{11}$/.test(idValue)) {
        idError.style.display = "block";
        return;
      } else {
        idError.style.display = "none";
      }

      // Update profile
      if (userName) userName.textContent = nameValue;
      if (userId) userId.textContent = `CID: ${idValue}`;

      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
