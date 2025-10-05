document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap Tooltips for hover text on buttons
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- Profile Navigation ---
    const profileIcon = document.getElementById('profileIcon');
    const notificationIcon = document.getElementById('notificationIcon');
    const settingIcon = document.getElementById('settingIcon');

    // Navigate to profile page when profile icon is clicked
    if (profileIcon) {
        profileIcon.addEventListener('click', function() {
            console.log("Navigating to driver profile page.");
            window.location.href = 'driverProfile.html';
        });
    }

    // Navigate to notifications page when notification icon is clicked
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            console.log("Navigating to notifications page.");
            window.location.href = 'notification.html';
        });
        
        // Add notification badge (optional - shows unread count)
        updateNotificationBadge();
    }

    // Navigate to settings page when settings icon is clicked
    if (settingIcon) {
        settingIcon.addEventListener('click', function() {
            console.log("Navigating to settings page.");
            window.location.href = 'settings.html';
        });
    }

    // Function to show notification count badge
    function updateNotificationBadge() {
        const unreadCount = 4; // Example: 4 unread notifications
        // You can fetch this from your backend or localStorage
        if (unreadCount > 0) {
            let badge = notificationIcon.querySelector('.notification-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'notification-badge';
                notificationIcon.style.position = 'relative';
                notificationIcon.appendChild(badge);
            }
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        }
    }

    // --- Action Button Handlers ---
    
    // 1. Reset Seats Button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log("Reset seats button clicked.");
            
            // Show confirmation dialog
            if (confirm("Are you sure you want to reset all seats to available?")) {
                // Reset all seats to available
                resetAllSeats();
                
                // Show success message
                alert("All seats have been reset to available!");
                
                console.log("All seats reset successfully.");
            } else {
                console.log("Reset cancelled by user.");
            }
        });
    }

    // Function to reset all seats to available (black)
    function resetAllSeats() {
        const allSeats = document.querySelectorAll('.seat-icon:not(.driver-seat)');
        
        allSeats.forEach(seat => {
            // Remove all status classes
            seat.classList.remove('booked', 'pending', 'available');
            
            // Add available class
            seat.classList.add('available');
            
            // Update seat image to black (available)
            const seatImg = seat.querySelector('.seat-placeholder');
            if (seatImg) {
                seatImg.classList.remove('red', 'purple');
                seatImg.classList.add('black');
            }
        });
        
        // Optional: Send reset request to backend
        // Example: 
        // fetch('/api/reset-seats', { 
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ driverId: 'DRIVER_ID' })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log("Backend updated:", data);
        // });
    }

    // 2. View Bookings Button
    const viewBookingsBtn = document.getElementById('viewBookingsBtn');
    if (viewBookingsBtn) {
        viewBookingsBtn.addEventListener('click', function() {
            console.log("Navigating to View Bookings screen.");
            // Navigate to bookings page where driver can see all seat colors
            // and accept/manage pending bookings
            window.location.href = 'viewBookings.html';
        });
    }

    // 3. Booking Details Search Button
    const searchBookingBtn = document.getElementById('searchBookingBtn');
    if (searchBookingBtn) {
        searchBookingBtn.addEventListener('click', function() {
            console.log("Navigating to Booking Details search screen.");
            // Navigate to booking details/search page
            window.location.href = 'bookingDetails.html';
        });
    }

    // --- Seat Status Management Functions ---
    
    // Function to update seat status based on booking state
    function updateSeatStatus(seatElement, status) {
        // Remove all status classes
        seatElement.classList.remove('booked', 'pending', 'available');
        
        // Add new status
        seatElement.classList.add(status);
        
        const seatImg = seatElement.querySelector('.seat-placeholder');
        if (seatImg) {
            seatImg.classList.remove('red', 'purple', 'black');
            
            switch(status) {
                case 'pending':
                    seatImg.classList.add('purple');
                    break;
                case 'booked':
                    seatImg.classList.add('red');
                    break;
                case 'available':
                default:
                    seatImg.classList.add('black');
                    break;
            }
        }
    }
    
    // Function to accept a pending booking
    function acceptBooking(seatElement) {
        updateSeatStatus(seatElement, 'booked');
        console.log("Booking accepted, seat status changed to booked (red)");
        
        // Optional: Send to backend
        // fetch('/api/accept-booking', {
        //     method: 'POST',
        //     body: JSON.stringify({ seatId: seatElement.dataset.seatId })
        // });
    }
    
    // Example: Load seat statuses from backend
    function loadSeatStatuses() {
        // This would typically fetch from your backend
        // fetch('/api/seat-status')
        //     .then(response => response.json())
        //     .then(data => {
        //         data.seats.forEach(seat => {
        //             const seatElement = document.querySelector(`[data-seat-id="${seat.id}"]`);
        //             if (seatElement) {
        //                 updateSeatStatus(seatElement, seat.status);
        //             }
        //         });
        //     });
    }

    // --- Seat Interaction (Removed for driver - no hover tooltips) ---
    const seats = document.querySelectorAll('.seat-icon:not(.driver-seat)');
    // Seats are now display-only for driver
    // Driver accepts bookings through "View Bookings" page
    
    console.log("Total passenger seats:", seats.length);

    // --- Optional: Auto-refresh notification badge ---
    // Uncomment if you want to periodically check for new notifications
    /*
    setInterval(function() {
        updateNotificationBadge();
    }, 30000); // Check every 30 seconds
    */

    // --- Optional: Load user data dynamically ---
    function loadUserData() {
        // Example: Fetch user data from localStorage or API
        const userData = JSON.parse(localStorage.getItem('driverData')) || {
            name: 'Sonam Tshomo',
            profileImage: '../Images/profile.png'
        };
        
        // Update greeting if needed
        const greetingName = document.querySelector('.greeting-section p');
        if (greetingName) {
            greetingName.textContent = userData.name;
        }
    }

    // Call on page load
    // loadUserData();

    // --- Optional: Load seat status dynamically ---
    function loadSeatStatus() {
        // Example: Fetch current seat status from API
        // fetch('/api/seat-status')
        //     .then(response => response.json())
        //     .then(data => {
        //         updateSeatDisplay(data);
        //     });
    }

    // Call on page load if needed
    // loadSeatStatus();

    console.log("Driver Dashboard initialized successfully.");
});