fetch("Sections/header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header-container").innerHTML = data;

        // Now the burger button exists, add the event listener
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
    
fetch("Sections/socialbar.html").then(response => response.text()).then(data => { document.getElementById("social-bar-container").innerHTML = data; });
fetch("Sections/footer.html").then(response => response.text()).then(data => { document.getElementById("footer-container").innerHTML = data; });

window.addEventListener('scroll', function () {
    let images = document.querySelectorAll('img[data-src]');
    images.forEach(function (image) {
      if (image.getBoundingClientRect().top <= window.innerHeight && !image.src) {
        image.src = image.getAttribute('data-src');
      }
    });
  });


window.history.scrollRestoration = 'auto';
