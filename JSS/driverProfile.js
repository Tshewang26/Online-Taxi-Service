document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- DOM Elements ---
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const headerTitle = document.getElementById('headerTitle');
    
    // View mode elements
    const profileName = document.getElementById('profileName');
    const viewCid = document.getElementById('viewCid');
    const viewPhone = document.getElementById('viewPhone');
    const viewAccount = document.getElementById('viewAccount');
    const viewCar = document.getElementById('viewCar');
    
    // Edit mode elements
    const editName = document.getElementById('editName');
    const editCid = document.getElementById('editCid');
    const editPhone = document.getElementById('editPhone');
    const editDob = document.getElementById('editDob');
    const editAccount = document.getElementById('editAccount');
    const editLicence = document.getElementById('editLicence');
    const editCar = document.getElementById('editCar');
    const editVehicleType = document.getElementById('editVehicleType');
    
    // Buttons
    const backButton = document.getElementById('backToProfile');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    // --- Store Original Values ---
    let originalValues = {
        name: '',
        cid: '',
        phone: '',
        dob: '',
        account: '',
        licence: '',
        car: '',
        vehicleType: ''
    };

    function storeOriginalValues() {
        originalValues = {
            name: profileName.textContent,
            cid: viewCid.textContent,
            phone: viewPhone.textContent,
            dob: editDob.value,
            account: viewAccount.textContent,
            licence: editLicence.value,
            car: viewCar.textContent,
            vehicleType: editVehicleType.value
        };
    }

    // --- Navigation Handlers ---
    backButton.addEventListener('click', function() {
        console.log("Navigating back to driver dashboard.");
        window.location.href = 'driverDashboard.html';
    });

    // --- Edit Profile Button ---
    editProfileBtn.addEventListener('click', function() {
        console.log("Entering edit mode.");
        storeOriginalValues();
        
        // Populate edit fields with current values
        editName.value = profileName.textContent;
        editCid.value = viewCid.textContent;
        editPhone.value = viewPhone.textContent;
        editAccount.value = viewAccount.textContent;
        editCar.value = viewCar.textContent;
        
        // Switch to edit mode
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
        headerTitle.textContent = 'Edit Profile';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Focus on name field
        setTimeout(() => editName.focus(), 100);
    });

    // --- Save Profile Button ---
    saveProfileBtn.addEventListener('click', function() {
        console.log("Saving profile changes.");
        
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        
        // Update view mode with new values
        profileName.textContent = editName.value.trim();
        viewCid.textContent = editCid.value.trim();
        viewPhone.textContent = editPhone.value.trim();
        viewAccount.textContent = editAccount.value.trim();
        viewCar.textContent = editCar.value.trim().toUpperCase();
        
        // Show success message
        alert('Profile updated successfully!');
        
        // Switch back to view mode
        editMode.style.display = 'none';
        viewMode.style.display = 'block';
        headerTitle.textContent = 'My Profile';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        console.log("Profile saved:", {
            name: editName.value,
            cid: editCid.value,
            phone: editPhone.value,
            dob: editDob.value,
            account: editAccount.value,
            licence: editLicence.value,
            car: editCar.value,
            vehicleType: editVehicleType.value
        });
        
        // Here you would typically send the data to your backend
        // Example: sendToBackend(profileData);
    });

    // --- Input Validation ---
    function validateInputs() {
        const name = editName.value.trim();
        const cid = editCid.value.trim();
        const phone = editPhone.value.trim();
        const dob = editDob.value;
        const account = editAccount.value.trim();
        const licence = editLicence.value.trim();
        const car = editCar.value.trim();
        const vehicleType = editVehicleType.value;
        
        // Validate name
        if (name === '') {
            alert('Please enter your name.');
            editName.focus();
            return false;
        }
        
        // Validate CID (11 digits)
        if (cid === '' || !/^\d{11}$/.test(cid)) {
            alert('Please enter a valid 11-digit CID number.');
            editCid.focus();
            return false;
        }
        
        // Validate phone (8 digits)
        if (phone === '' || !/^\d{8}$/.test(phone)) {
            alert('Please enter a valid 8-digit phone number.');
            editPhone.focus();
            return false;
        }
        
        // Validate date of birth
        if (dob === '') {
            alert('Please select your date of birth.');
            editDob.focus();
            return false;
        }
        
        // Validate account number
        if (account === '' || !/^\d+$/.test(account)) {
            alert('Please enter a valid account number (digits only).');
            editAccount.focus();
            return false;
        }
        
        // Validate licence number
        if (licence === '') {
            alert('Please enter your licence number.');
            editLicence.focus();
            return false;
        }
        
        // Validate car number (BP format)
        const carPattern = /^BP-\d+-[A-Z]-\d+$/i;
        if (car === '' || !carPattern.test(car)) {
            alert('Please enter a valid car registration number (Format: BP-1-X-0000).');
            editCar.focus();
            return false;
        }
        
        // Validate vehicle type
        if (vehicleType === '') {
            alert('Please select a vehicle type.');
            editVehicleType.focus();
            return false;
        }
        
        return true;
    }

    // --- Input Formatting ---
    
    // Auto-format CID (only numbers, max 11 digits)
    editCid.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 11);
    });
    
    // Auto-format phone (only numbers, max 8 digits)
    editPhone.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 8);
    });
    
    // Auto-format account (only numbers)
    editAccount.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Auto-format car number (uppercase)
    editCar.addEventListener('input', function(e) {
        this.value = this.value.toUpperCase();
    });

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', function(e) {
        // ESC key to go back
        if (e.key === 'Escape') {
            if (editMode.style.display === 'block') {
                // In edit mode, confirm before going back
                if (confirm('Are you sure you want to go back without saving changes?')) {
                    editMode.style.display = 'none';
                    viewMode.style.display = 'block';
                    headerTitle.textContent = 'My Profile';
                    window.scrollTo(0, 0);
                }
            } else {
                console.log("Escape key pressed - navigating back to dashboard.");
                window.location.href = 'driverDashboard.html';
            }
        }
        
        // Ctrl+S or Cmd+S to save (in edit mode)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            if (editMode.style.display === 'block') {
                e.preventDefault();
                console.log("Save shortcut pressed.");
                saveProfileBtn.click();
            }
        }
    });

    // --- Swipe Gesture for Mobile ---
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        // Swipe right to go back (only in view mode)
        if (viewMode.style.display !== 'none' && touchEndX > touchStartX + 100) {
            console.log("Swipe right detected - navigating back to dashboard.");
            window.location.href = 'driverDashboard.html';
        }
    }

    // --- Unsaved Changes Warning ---
    let hasUnsavedChanges = false;
    
    // Track changes in edit mode
    [editName, editCid, editPhone, editDob, editAccount, editLicence, editCar, editVehicleType].forEach(input => {
        input.addEventListener('input', function() {
            if (editMode.style.display === 'block') {
                hasUnsavedChanges = true;
            }
        });
    });
    
    // Reset flag when saving
    saveProfileBtn.addEventListener('click', function() {
        hasUnsavedChanges = false;
    });
    
    // Warn before leaving if there are unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges && editMode.style.display === 'block') {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });

    // --- Initialize ---
    console.log("Driver Profile page initialized.");
    storeOriginalValues();
});