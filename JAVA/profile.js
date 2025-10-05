document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const formActions = document.getElementById('form-actions');
    const profileForm = document.getElementById('profile-form');
    const changePhotoBtn = document.getElementById('change-photo-btn');
    const photoUpload = document.getElementById('photo-upload');
    const profileAvatar = document.getElementById('profile-avatar');
    const displayName = document.getElementById('display-name');
    const toast = document.getElementById('toast');

    // Form inputs
    const formInputs = {
        fullName: document.getElementById('full-name'),
        gender: document.getElementById('gender'),
        cid: document.getElementById('cid'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        emergencyName: document.getElementById('emergency-name'),
        emergencyPhone: document.getElementById('emergency-phone'),
        emergencyRelation: document.getElementById('emergency-relation'),
        preferredLanguage: document.getElementById('preferred-language'),
        musicPreference: document.getElementById('music-preference'),
        acPreference: document.getElementById('ac-preference'),
        quietRide: document.getElementById('quiet-ride')
    };

    // Error elements
    const errorElements = {
        name: document.getElementById('name-error'),
        gender: document.getElementById('gender-error'),
        cid: document.getElementById('cid-error'),
        phone: document.getElementById('phone-error'),
        email: document.getElementById('email-error'),
        emergencyName: document.getElementById('emergency-name-error'),
        emergencyPhone: document.getElementById('emergency-phone-error'),
        emergencyRelation: document.getElementById('emergency-relation-error')
    };

    // --- State Management ---
    let isEditing = false;
    let originalData = {};
    let currentProfilePicture = null;

    // --- Utility Functions ---
    function showToast(message, type = 'success') {
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        toast.className = `toast ${type}`;
        toastIcon.className = `toast-icon fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
        toastMessage.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function clearErrors() {
        Object.values(errorElements).forEach(element => {
            if (element) {
                element.classList.remove('show');
                element.textContent = '';
            }
        });
        
        Object.values(formInputs).forEach(input => {
            if (input) {
                input.classList.remove('error');
            }
        });
    }

    function showError(field, message) {
        const errorElement = errorElements[field];
        const inputElement = formInputs[field === 'name' ? 'fullName' : field];
        
        if (errorElement && inputElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            inputElement.classList.add('error');
        }
    }

    function toggleEditMode(editing) {
        isEditing = editing;
        
        // Toggle form inputs
        Object.values(formInputs).forEach(input => {
            if (input) {
                input.disabled = !editing;
            }
        });
        
        // Toggle UI elements
        if (editing) {
            editBtn.style.display = 'none';
            formActions.style.display = 'flex';
            changePhotoBtn.style.display = 'flex';
        } else {
            editBtn.style.display = 'flex';
            formActions.style.display = 'none';
            changePhotoBtn.style.display = 'none';
        }
        
        clearErrors();
    }

    function saveOriginalData() {
        originalData = {};
        Object.keys(formInputs).forEach(key => {
            const input = formInputs[key];
            if (input) {
                originalData[key] = input.type === 'checkbox' ? input.checked : input.value;
            }
        });
        originalData.profilePicture = currentProfilePicture;
    }

    function restoreOriginalData() {
        Object.keys(originalData).forEach(key => {
            const input = formInputs[key];
            if (input && key !== 'profilePicture') {
                if (input.type === 'checkbox') {
                    input.checked = originalData[key];
                } else {
                    input.value = originalData[key];
                }
            }
        });
        
        // Restore profile picture
        currentProfilePicture = originalData.profilePicture;
        updateProfileDisplay();
    }

    function updateProfileDisplay() {
        const name = formInputs.fullName.value.trim();
        displayName.textContent = name || 'Your Name';
        
        if (currentProfilePicture) {
            profileAvatar.style.backgroundImage = `url('${currentProfilePicture}')`;
            profileAvatar.textContent = '';
        } else {
            profileAvatar.style.backgroundImage = 'none';
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'UN';
            profileAvatar.textContent = initials.substring(0, 2);
        }
    }

    // --- Validation Functions ---
    function validateName(name) {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
            return 'Name can only contain letters and spaces';
        }
        return null;
    }

    function validateCID(cid) {
        if (!cid.trim()) {
            return 'CID is required';
        }
        if (!/^\d{11}$/.test(cid.trim())) {
            return 'CID must be exactly 11 digits';
        }
        return null;
    }

    function validatePhone(phone) {
        if (!phone.trim()) {
            return 'Phone number is required';
        }
        if (!/^(17|77)\d{6}$/.test(phone.trim())) {
            return 'Phone must start with 17 or 77 and be 8 digits total';
        }
        return null;
    }

    function validateEmail(email) {
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return 'Please enter a valid email address';
        }
        return null;
    }

    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate name
        const nameError = validateName(formInputs.fullName.value);
        if (nameError) {
            showError('name', nameError);
            isValid = false;
        }

        // Validate gender
        if (!formInputs.gender.value) {
            showError('gender', 'Gender is required');
            isValid = false;
        }

        // Validate CID
        const cidError = validateCID(formInputs.cid.value);
        if (cidError) {
            showError('cid', cidError);
            isValid = false;
        }

        // Validate phone
        const phoneError = validatePhone(formInputs.phone.value);
        if (phoneError) {
            showError('phone', phoneError);
            isValid = false;
        }

        // Validate email (optional but must be valid if provided)
        const emailError = validateEmail(formInputs.email.value);
        if (emailError) {
            showError('email', emailError);
            isValid = false;
        }

        // Validate emergency contact name
        const emergencyNameError = validateName(formInputs.emergencyName.value);
        if (emergencyNameError) {
            showError('emergencyName', 'Emergency contact name is required');
            isValid = false;
        }

        // Validate emergency phone
        const emergencyPhoneError = validatePhone(formInputs.emergencyPhone.value);
        if (emergencyPhoneError) {
            showError('emergencyPhone', emergencyPhoneError.replace('Phone', 'Emergency contact phone'));
            isValid = false;
        }

        // Validate emergency relation
        if (!formInputs.emergencyRelation.value) {
            showError('emergencyRelation', 'Relationship is required');
            isValid = false;
        }

        return isValid;
    }

    // --- Event Handlers ---
    function handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size must be less than 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                currentProfilePicture = e.target.result;
                updateProfileDisplay();
            };
            reader.readAsDataURL(file);
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            showToast('Please fix the errors before saving', 'error');
            return;
        }

        // Simulate saving to backend
        setTimeout(() => {
            toggleEditMode(false);
            updateProfileDisplay();
            showToast('Profile updated successfully!', 'success');
            
            // Update original data with new values
            saveOriginalData();
        }, 500);
    }

    // --- Event Listeners ---
    editBtn.addEventListener('click', () => {
        saveOriginalData();
        toggleEditMode(true);
    });

    cancelBtn.addEventListener('click', () => {
        restoreOriginalData();
        toggleEditMode(false);
    });

    profileForm.addEventListener('submit', handleFormSubmit);

    changePhotoBtn.addEventListener('click', () => {
        photoUpload.click();
    });

    photoUpload.addEventListener('change', handlePhotoUpload);

    // Real-time validation for CID (numbers only)
    formInputs.cid.addEventListener('keypress', (e) => {
        if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Real-time validation for phone numbers (numbers only)
    [formInputs.phone, formInputs.emergencyPhone].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });

    // Real-time name updates
    formInputs.fullName.addEventListener('input', () => {
        if (isEditing) {
            updateProfileDisplay();
        }
    });

    // --- Initialize ---
    function initializeProfile() {
        // Set some default values for demonstration
        formInputs.gender.value = 'he';
        formInputs.phone.value = '17123456';
        formInputs.emergencyName.value = 'Pema Dorji';
        formInputs.emergencyPhone.value = '17987654';
        formInputs.emergencyRelation.value = 'parent';
        formInputs.acPreference.checked = true;
        
        updateProfileDisplay();
        saveOriginalData();
    }

    // Initialize the profile page
    initializeProfile();
});