const modalOverlay = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalActions = document.getElementById('modal-actions');

let isMuted = localStorage.getItem('isMuted') === 'true';

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
  if (event.target === modalOverlay) hideModal();
}

function toggleMute(checked) {
  isMuted = checked;
  localStorage.setItem('isMuted', isMuted);
  const statusText = document.getElementById('mute-status');
  if (statusText) statusText.textContent = isMuted ? 'Status: Muted 🔇' : 'Status: Unmuted 🔊';
}

function showNotificationSettings() {
  const content = `
    <p>Control whether you receive push notifications from RideEasy on this device.</p>
    <div class="toggle-container">
      <span class="toggle-label">Mute All Notifications</span>
      <label class="switch">
        <input type="checkbox" id="mute-toggle" ${isMuted ? 'checked' : ''} onchange="toggleMute(this.checked)">
        <span class="slider"></span>
      </label>
    </div>
    <p id="mute-status" style="margin-top: 20px; font-style: italic; color: #888;">
      Status: ${isMuted ? 'Muted 🔇' : 'Unmuted 🔊'}
    </p>
  `;
  showModal('Notification Settings', content, [{ text: 'Close', className: 'cancel', action: () => {} }]);
}

function showContactInfo() {
  const contactNumber = '+97517913862';
  const contactEmail = '05240157.jnec@rub.edu.bt';

  const content = `
    <p style="margin-bottom: 25px;">Need assistance? Reach out to our dedicated support team.</p>
    <div><p><b>Phone:</b> <span style="color:#fbc02d">${contactNumber}</span></p></div>
    <div><p><b>Email:</b> <span style="color:#fbc02d">${contactEmail}</span></p></div>
  `;
  showModal('Contact RideEasy Support', content, [{ text: 'Close', className: 'cancel', action: () => {} }]);
}

function handleLogout() {
  const content = '<p>Are you sure you want to log out?</p>';
  const buttons = [
    { text: 'Cancel', className: 'cancel', action: () => {} },
    { text: 'Log Out', className: 'confirm', action: () => { console.log('Logging out...'); /* window.location.href="login.html"; */ } }
  ];
  showModal('Confirm Log Out', content, buttons);
}

function goBack() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('notifications-setting')?.addEventListener('click', showNotificationSettings);
  document.getElementById('contact-setting')?.addEventListener('click', showContactInfo);

  document.querySelectorAll('.menu-link, .logout-btn, .back-btn').forEach(el => {
    el.addEventListener('touchstart', function() { this.style.transform = 'scale(0.98)'; });
    el.addEventListener('touchend', function() { setTimeout(() => this.style.transform = '', 150); });
  });
});