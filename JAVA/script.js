document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-bar input');
  const listItems = document.querySelectorAll('.price-item');

  const profileIconDiv = document.getElementById('profile-icon');
  const userNameDisplay = document.getElementById('user-name');
  const userCidDisplay = document.getElementById('user-cid');

  const profileModal = document.getElementById('profile-modal');
  const editNameInput = document.getElementById('edit-name');
  const editCidInput = document.getElementById('edit-cid');
  const saveBtn = document.querySelector('.modal-actions .save-btn');
  const cancelBtn = document.querySelector('.modal-actions .cancel-btn');
  const cidErrorMessage = document.getElementById('cid-error-message');

  const pfpIcon = document.getElementById('pfp-icon');
  const pfpImage = document.getElementById('pfp-image');
  const pfpFileInput = document.getElementById('pfp-file-input');

  // Show modal
  const showModal = () => {
    profileModal.style.display = 'flex';
    editNameInput.value = userNameDisplay.textContent;
    editCidInput.value = userCidDisplay.textContent.replace('CID: ', '');
    cidErrorMessage.textContent = '';
  };

  // Search function
  searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    listItems.forEach(item => {
      const destination = item.querySelector('.price-item-info span').textContent.toLowerCase();
      item.style.display = destination.includes(searchTerm) ? 'flex' : 'none';
    });
  });

  // Nav toggle
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active-nav'));
      this.classList.add('active-nav');
    });
  });

  // Open modal on click
  profileIconDiv.addEventListener('click', showModal);
  userNameDisplay.addEventListener('click', showModal);
  userCidDisplay.addEventListener('click', showModal);

  // Cancel button closes modal
  cancelBtn.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });

  // Close modal if clicked outside
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });

  // Upload profile picture
  pfpFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        pfpImage.src = e.target.result;
        pfpImage.style.display = 'block';
        pfpIcon.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Save button
  saveBtn.addEventListener('click', () => {
    const newName = editNameInput.value.trim();
    const newCid = editCidInput.value.trim();

    const cidRegex = /^\d{11}$/;
    if (!cidRegex.test(newCid)) {
      cidErrorMessage.textContent = 'CID must be exactly 11 numbers.';
      return;
    }

    cidErrorMessage.textContent = '';

    if (newName) userNameDisplay.textContent = newName;
    if (newCid) userCidDisplay.textContent = `CID: ${newCid}`;

    profileModal.style.display = 'none';
  });
});
