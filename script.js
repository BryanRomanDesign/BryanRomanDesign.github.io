fetch("footer.html").then(response => response.text()).then(data => { document.getElementById("footer-container").innerHTML = data; });


window.history.scrollRestoration = 'auto';

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("open"); // Toggle class for icon change

        // Change icon when menu is open
        if (menuToggle.classList.contains("open")) {
            menuToggle.innerHTML = "<i class='bx bx-x'></i>"; // X icon
        } else {
            menuToggle.innerHTML = "<i class='bx bx-menu'></i>"; // Menu icon
        }
    });
});