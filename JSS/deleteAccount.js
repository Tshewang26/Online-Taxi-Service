const form = document.getElementById('delete-account-form');
const msgBox = document.getElementById('message-box');
const modalOverlay = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalActions = document.getElementById('modal-actions');

function hideModal() {
    modalOverlay.classList.remove('open');
    modalTitle.textContent = '';
    modalContent.innerHTML = '';
    modalActions.innerHTML = '';
    modalOverlay.removeEventListener('click', handleOverlayClick);
}

function showModal(title, htmlContent, buttons) {
    modalTitle.textContent = title;
    modalContent.innerHTML = htmlContent;
    modalActions.innerHTML = '';

    buttons.forEach(btnConfig => {
        const button = document.createElement('button');
        button.textContent = btnConfig.text;
        button.className = `modal-btn ${btnConfig.className}`;
        button.addEventListener('click', () => {
            btnConfig.action();
            hideModal();
        });
        modalActions.appendChild(button);
    });

    modalOverlay.addEventListener('click', handleOverlayClick);
    modalOverlay.classList.add('open');
}

function handleOverlayClick(event) {
    if (event.target === modalOverlay) {
        hideModal();
    }
}

function showMessage(message, type) {
    msgBox.textContent = message;
    msgBox.className = `message-box show ${type}`;
    setTimeout(() => {
        msgBox.classList.remove('show');
        setTimeout(() => {
            msgBox.className = 'message-box';
        }, 500);
    }, 5000);
}

function goBack() {
    window.history.back();
}

function executeDeletion() {
    console.log('Final deletion confirmation received. Executing deletion...');
    setTimeout(() => {
        showMessage("Your account has been successfully deleted. Goodbye!", 'success');
        form.reset();
        setTimeout(() => {
            console.log("Redirecting to welcome page...");
            // window.location.href = 'welcome_page.html';
        }, 3000);
    }, 1500);
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const passwordConfirm = document.getElementById('password-confirm').value;

    if (passwordConfirm.length < 6) {
        showMessage("Please enter your current password to confirm.", 'error');
        return;
    }

    const content = `
        <p style="font-weight: 600;">This is your final warning.</p>
        <p>Are you absolutely sure you want to delete your RideEasy account? All data will be lost.</p>
    `;

    const buttons = [
        { text: 'Keep Account', className: 'cancel', action: () => console.log('Deletion cancelled.') },
        { text: 'DELETE PERMANENTLY', className: 'delete', action: executeDeletion }
    ];

    showModal('Confirm Account Deletion', content, buttons);
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.delete-btn, .back-btn').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        element.addEventListener('touchend', function() {
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });
});
