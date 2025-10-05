const notifications = [
    {
        id: 1,
        type: 'ride',
        title: 'Ride Confirmed',
        message: 'Your ride from JNEC to Samdrup Jongkhar has been successfully confirmed. Driver will arrive in 5 minutes.',
        time: '5 PM',
        timestamp: new Date().getTime() - 3600000,
        unread: true
    },
    {
        id: 2,
        type: 'driver',
        title: 'Driver Assigned',
        message: 'Tshering (BP-1-A-1234) is on the way to pick you up. ETA: 5 minutes.',
        time: '4:45 PM',
        timestamp: new Date().getTime() - 7200000,
        unread: true
    },
    {
        id: 3,
        type: 'payment',
        title: 'Payment Successful',
        message: 'Nu 200 has been deducted for your ride to White Temple. Receipt sent to your email.',
        time: '3:30 PM',
        timestamp: new Date().getTime() - 14400000,
        unread: false
    },
    {
        id: 4,
        type: 'promo',
        title: 'Special Offer! 🎉',
        message: 'Get 20% off on your next 3 rides. Use code: RIDE20. Valid until this weekend!',
        time: '11 AM',
        timestamp: new Date().getTime() - 28800000,
        unread: false
    },
    {
        id: 5,
        type: 'system',
        title: 'Security Alert',
        message: 'Your password has been successfully changed. If this wasn\'t you, please contact support immediately.',
        time: '11 PM',
        timestamp: new Date().getTime() - 86400000,
        unread: false
    },
    {
        id: 6,
        type: 'ride',
        title: 'Ride Completed',
        message: 'Your ride to Hospital has been completed. Thank you for choosing Ride Easy!',
        time: 'Yesterday',
        timestamp: new Date().getTime() - 172800000,
        unread: false
    }
];

let notificationData = [...notifications];
let isMuted = false;
let currentFilter = 'all';

function getIconByType(type) {
    const icons = {
        ride: 'fa-car',
        payment: 'fa-wallet',
        driver: 'fa-user-tie',
        promo: 'fa-gift',
        system: 'fa-shield-halved'
    };
    return icons[type] || 'fa-bell';
}

function renderNotifications(filter = 'all') {
    const listEl = document.getElementById('notification-list');
    const emptyEl = document.getElementById('empty-state');
    
    let filtered = filter === 'all' 
        ? notificationData 
        : notificationData.filter(n => n.type === filter);
    
    if (filtered.length === 0) {
        listEl.innerHTML = '';
        emptyEl.style.display = 'block';
        return;
    }
    
    emptyEl.style.display = 'none';
    
    listEl.innerHTML = filtered.map(notif => `
        <div class="notification-card ${notif.unread ? 'unread' : ''}" data-id="${notif.id}">
            <div class="notification-header">
                <div class="notification-icon-title">
                    <div class="notification-icon ${notif.type}">
                        <i class="fa-solid ${getIconByType(notif.type)}"></i>
                    </div>
                    <div class="notification-title-time">
                        <div class="notification-title">
                            ${notif.title}
                            ${notif.unread ? '<span class="unread-badge">NEW</span>' : ''}
                        </div>
                        <div class="notification-time">${notif.time}</div>
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="action-btn mark-read-btn" onclick="toggleRead(${notif.id})" title="${notif.unread ? 'Mark as read' : 'Mark as unread'}">
                        <i class="fa-${notif.unread ? 'regular' : 'solid'} fa-envelope"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteNotification(${notif.id})" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="notification-message">${notif.message}</div>
        </div>
    `).join('');
}

function toggleRead(id) {
    const notif = notificationData.find(n => n.id === id);
    if (notif) {
        notif.unread = !notif.unread;
        renderNotifications(currentFilter);
        showToast(notif.unread ? 'Marked as unread' : 'Marked as read');
    }
}

function deleteNotification(id) {
    notificationData = notificationData.filter(n => n.id !== id);
    renderNotifications(currentFilter);
    showToast('Notification deleted');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Mute button functionality
document.getElementById('mute-btn').addEventListener('click', function() {
    isMuted = !isMuted;
    this.classList.toggle('muted');
    const icon = this.querySelector('i');
    
    if (isMuted) {
        icon.className = 'fa-solid fa-volume-xmark';
        showToast('Notifications muted');
    } else {
        icon.className = 'fa-solid fa-volume-high';
        showToast('Notifications unmuted');
    }
});

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderNotifications(currentFilter);
    });
});

// Initial render
renderNotifications();