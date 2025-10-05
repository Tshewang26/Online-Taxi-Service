// JavaScript for About Us page functionality
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.querySelector('.back-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
});
