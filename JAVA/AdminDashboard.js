const DEFAULT_PIC_URL = 'https://placehold.co/150x150/FFD700/333333?text=ADM';
let profileData = {
    name: 'Admin',
    email: '05240335.jnec@rub.edu.bt',
    contact: '17606074',
    picture: DEFAULT_PIC_URL
};
let fileDataUrl = null;

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function openProfilePage() {
    document.getElementById('profilePage').classList.add('active');
    updateProfileDisplay();
}

function closeProfilePage() {
    document.getElementById('profilePage').classList.remove('active');
}

function updateProfileDisplay() {
    document.getElementById('adminName').textContent = profileData.name;
    document.getElementById('profilePic').src = profileData.picture;
    document.getElementById('profilePicLarge').src = profileData.picture;
    document.getElementById('profileNameDisplay').textContent = profileData.name;
    document.getElementById('profileEmail').innerHTML = `<i class="fas fa-envelope" style="color: #FFD700;"></i>${profileData.email}`;
    document.getElementById('profileContact').innerHTML = `<i class="fas fa-phone" style="color: #FFD700;"></i>${profileData.contact}`;
}

function openEditModal() {
    document.getElementById('editName').value = profileData.name;
    document.getElementById('editEmail').value = profileData.email;
    document.getElementById('editContact').value = profileData.contact;
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveProfileInfo() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const contact = document.getElementById('editContact').value.trim();

    if (!name || !email || !contact) {
        showToast('Please fill in all fields', true);
        return;
    }

    profileData.name = name;
    profileData.email = email;
    profileData.contact = contact;

    updateProfileDisplay();
    closeEditModal();
    showToast('Profile updated successfully!');
}

function openPictureModal() {
    document.getElementById('pictureModal').style.display = 'block';
}

function closePictureModal() {
    document.getElementById('pictureModal').style.display = 'none';
    document.getElementById('newPicFile').value = '';
    fileDataUrl = null;
}

function saveProfilePicture() {
    const file = document.getElementById('newPicFile').files[0];
    if (!file) {
        showToast('Please select a picture', true);
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        profileData.picture = e.target.result;
        updateProfileDisplay();
        closePictureModal();
        showToast('Picture updated successfully!');
    };
    reader.onerror = () => {
        showToast('Error reading file', true);
    };
    reader.readAsDataURL(file);
}

function openPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
}

function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function savePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all fields', true);
        return;
    }

    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters', true);
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', true);
        return;
    }

    // Here you would typically verify the current password with backend
    // For demo purposes, we'll just show success
    closePasswordModal();
    showToast('Password changed successfully!');
}

document.getElementById('profileMenuToggle').addEventListener('click', (event) => {
    event.stopPropagation();
    document.getElementById('profileDropdownMenu').classList.toggle('show');
});

document.getElementById('profileDropdownMenu').addEventListener('click', (event) => {
    event.preventDefault();
    const link = event.target.closest('a');
    if (!link) return;
    
    const action = link.getAttribute('data-action');
    document.getElementById('profileDropdownMenu').classList.remove('show');
    
    switch (action) {
        case 'viewProfile':
            openProfilePage();
            break;
        case 'changePassword':
            openPasswordModal();
            break;
        case 'logout':
            console.log("Logging out.");
            break;
    }
});

document.getElementById('adminInfoClickable').addEventListener('click', openProfilePage);

window.addEventListener('click', (event) => {
    const profileMenu = document.getElementById('profileMenuToggle');
    const dropdown = document.getElementById('profileDropdownMenu');
    const editModal = document.getElementById('editModal');
    const pictureModal = document.getElementById('pictureModal');
    const passwordModal = document.getElementById('passwordModal');
    
    if (!profileMenu.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
    
    if (event.target === editModal) {
        closeEditModal();
    }
    
    if (event.target === pictureModal) {
        closePictureModal();
    }
    
    if (event.target === passwordModal) {
        closePasswordModal();
    }
});

document.getElementById('mobileMenuToggle').addEventListener('click', () => {
    console.log("Mobile Menu toggled.");
});
