// Example functionality (can be expanded)
document.addEventListener("DOMContentLoaded", () => {
  const loginItems = document.querySelectorAll(".dropdown-item");
  loginItems.forEach(item => {
    item.addEventListener("click", () => {
      alert(`You clicked: ${item.textContent}`);
    });
  });
});
