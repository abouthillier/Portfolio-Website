import home from './pages/home';

// Allow transition animations once page is fully loaded
window.addEventListener("load", () => {
    document.body.classList.remove("preload");
    home.init();
});