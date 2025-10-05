document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- DOM Elements ---
    const backButton = document.getElementById('backToDashboard');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const emptyState = document.getElementById('emptyState');
    
    // --- Navigation Handlers ---
    backButton.addEventListener('click', function() {
        console.log("Navigating back to driver dashboard.");
        window.location.href = 'driverDashboard.html';
    });

    // --- Delete Individual Notifications ---
    function setupDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent notification click event
                
                const notificationId = this.getAttribute('data-id');
                const notificationItem = this.closest('.notification-item');
                
                // Show confirmation dialog
                const confirmDelete = confirm('Are you sure you want to delete this notification?');
                
                if (confirmDelete) {
                    deleteNotification(notificationItem, notificationId);
                }
            });
        });
    }

    // Delete single notification with animation
    function deleteNotification(notificationItem, notificationId) {
        console.log(`Deleting notification ID: ${notificationId}`);
        
        // Add removing class for animation
        notificationItem.classList.add('removing');
        
        // Remove from DOM after animation
        setTimeout(() => {
            notificationItem.remove();
            checkIfEmpty();
            console.log(`Notification ${notificationId} deleted successfully.`);
        }, 300);
    }

    // --- Clear All Notifications ---
    clearAllBtn.addEventListener('click', function() {
        const notifications = document.querySelectorAll('.notification-item');
        
        if (notifications.length === 0) {
            alert('No notifications to clear.');
            return;
        }
        
        // Show confirmation dialog
        const confirmClearAll = confirm(`Are you sure you want to delete all ${notifications.length} notifications?`);
        
        if (confirmClearAll) {
            clearAllNotifications();
        }
    });

    // Clear all notifications with staggered animation
    function clearAllNotifications() {
        const notifications = document.querySelectorAll('.notification-item');
        
        console.log(`Clearing ${notifications.length} notifications.`);
        
        // Disable the clear all button
        clearAllBtn.disabled = true;
        clearAllBtn.textContent = 'Clearing...';
        
        // Animate notifications out with staggered timing
        notifications.forEach((notification, index) => {
            setTimeout(() => {
                notification.classList.add('removing');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    notification.remove();
                    
                    // Check if this was the last notification
                    if (index === notifications.length - 1) {
                        setTimeout(() => {
                            showEmptyState();
                            resetClearButton();
                        }, 200);
                    }
                }, 300);
            }, index * 100); // Stagger by 100ms
        });
    }

    // --- Empty State Management ---
    function checkIfEmpty() {
        const notifications = document.querySelectorAll('.notification-item');
        
        if (notifications.length === 0) {
            showEmptyState();
        } else {
            hideEmptyState();
        }
        
        // Update clear all button state
        clearAllBtn.disabled = notifications.length === 0;
    }

    function showEmptyState() {
        emptyState.style.display = 'block';
        clearAllBtn.disabled = true;
    }

    function hideEmptyState() {
        emptyState.style.display = 'none';
        clearAllBtn.disabled = false;
    }

    function resetClearButton() {
        clearAllBtn.disabled = true;
        clearAllBtn.textContent = 'Clear All Notifications';
    }

    // --- Notification Click Handler (for read/interaction) ---
    function setupNotificationClicks() {
        const notifications = document.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            notification.addEventListener('click', function(e) {
                // Don't trigger if clicking delete button
                if (e.target.closest('.delete-btn')) {
                    return;
                }
                
                const title = this.querySelector('.notification-title').textContent;
                const message = this.querySelector('.notification-message').textContent;
                
                console.log(`Notification clicked: ${title}`);
                
                // Mark as read (remove new indicator)
                this.classList.remove('new');
                
                // You can add navigation or action based on notification type
                // For example:
                // if (title === 'Ride request') {
                //     window.location.href = 'viewBookings.html';
                // }
            });
        });
    }

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', function(e) {
        // Go back with Escape key
        if (e.key === 'Escape') {
            console.log("Escape key pressed - navigating back to dashboard.");
            window.location.href = 'driverDashboard.html';
        }
        
        // Clear all with Ctrl+Shift+Delete
        if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
            e.preventDefault();
            clearAllBtn.click();
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
        // Swipe right to go back
        if (touchEndX > touchStartX + 100) {
            console.log("Swipe right detected - navigating back to dashboard.");
            window.location.href = 'driverDashboard.html';
        }
    }

    // --- Mark New Notifications (Optional) ---
    // You can mark certain notifications as new
    // Example: document.querySelector('[data-id="2"]').classList.add('new');

    // --- Initialize ---
    setupDeleteButtons();
    setupNotificationClicks();
    checkIfEmpty();
    
    console.log('Notifications page initialized successfully.');
    console.log(`Total notifications: ${document.querySelectorAll('.notification-item').length}`);
});