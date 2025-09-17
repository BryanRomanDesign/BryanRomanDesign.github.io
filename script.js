// Set Cookie Function (Stores language choice in cookies)
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // cookie expiration time
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/"; // cookie set
  console.log("Cookie Set: ", name + "=" + value); // Debug log
}

// Get Cookie Function (Reads language choice from cookies)
function getCookie(name) {
  const nameWithEqual = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(nameWithEqual) == 0) {
      console.log("Cookie Found: ", c.substring(nameWithEqual.length, c.length)); // Debug log
      return c.substring(nameWithEqual.length, c.length);
    }
  }
  console.log("Cookie Not Found"); // Debug log
  return ""; // No cookie found
}

// Fetch Header
fetch("/Sections/header")
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

    // Close the menu if window is resized to desktop size
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active"); // Close the burger menu
        menuToggle.innerHTML = "<i class='bx bx-menu'></i>"; // Reset the icon to menu
        menuToggle.classList.remove("open"); // Remove open class from the button
      }
    });
  });


// Fetch Social Bar 
fetch("/Sections/socialbar")
  .then(response => response.text())
  .then(data => {
    document.getElementById("social-bar-container").innerHTML = data;

    // Now that the social bar is added, we can attach the language button event listeners
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        const selectedLang = e.target.getAttribute('data-lang');
        console.log('Language Selected:', selectedLang); // For debugging

        // Store the selected language in a cookie
        setCookie('language', selectedLang, 365); // Save for 365 days

        // Apply translations dynamically after language selection
        loadTranslations(selectedLang);  // For the general content (based on page name)
        loadTranslations(selectedLang, 'header'); // For header content
        loadTranslations(selectedLang, 'footer'); // For footer content

        // Update the social bar buttons to disable the selected language button
        updateSocialBarButtons(selectedLang);

        // Hide the language modal after selecting a language
        document.getElementById('language-modal').style.display = 'none'; // Hide the modal
      });
    });
  });

// Function to update Social Bar Language Buttons
function updateSocialBarButtons(selectedLang) {
  // Only target the buttons inside the social bar
  const socialBarLangButtons = document.querySelectorAll('#social-bar .lang-btn');
  socialBarLangButtons.forEach(button => {
    if (button.getAttribute('data-lang') === selectedLang) {
      button.disabled = true;  // Disable the button for the selected language
      button.style.opacity = '0.5';  // Optional: Reduce opacity to show the button is disabled
    } else {
      button.disabled = false;  // Enable the other language button
      button.style.opacity = '1';  // Reset opacity for the enabled button
    }
  });
}

// Function to load translations from JSON (with section-specific file)
function loadTranslations(language = 'en', section = '') {
  let translationFilePath;

  if (section === 'header') {
    translationFilePath = '/Sections/header/trans.json';
  } else if (section === 'footer') {
    translationFilePath = '/Sections/footer/trans.json';
  } else {
    translationFilePath = './trans.json'; // default: page-local
  }

  fetch(translationFilePath)
    .then(response => response.json())
    .then(translations => {
      document.querySelectorAll('[data-translate]').forEach(element => {
        const translationKey = element.getAttribute('data-translate');

        if (translations[language] && translations[language][translationKey]) {
          element.textContent = translations[language][translationKey];
        }
      });
    })
    .catch(error => {
      console.error(`Error loading translations for ${section || 'page'}:`, error);
    });
}


document.addEventListener('DOMContentLoaded', function () {
  const savedLang = getCookie('language');

  // Apply translations based on the saved language
  loadTranslations(savedLang);  // Apply translations for the general page (based on the page name)
  loadTranslations(savedLang, 'header'); // Apply translations for header content
  loadTranslations(savedLang, 'footer'); // Apply translations for footer content

  // Update the social bar buttons to disable the active language button
  updateSocialBarButtons(savedLang);

  // Hide the language modal after language is selected and the cookie is found
  const languageModal = document.getElementById('language-modal');
  if (languageModal) { // Ensure the modal exists before hiding it
    if (savedLang !== '') {
      console.log("We found a cookie");
      languageModal.style.display = 'none';  // Hide the modal if the language is set
    }
  } else {
    console.log("Language modal not found in DOM.");
  }

  //Carousel

  let currentIndex = 0;
  const slides = document.querySelectorAll('.slide'); // Select all the slides
  const totalSlides = slides.length;

  // Ensure the first image is visible on load (do it here for clarity)
  if (slides.length > 0) {
    slides[currentIndex].classList.add('active');
  }

  function showNextSlide() {
    slides[currentIndex].classList.remove('active'); // Hide current slide
    currentIndex = (currentIndex + 1) % totalSlides; // Move to the next slide, loop around if necessary
    slides[currentIndex].classList.add('active'); // Show next slide
  }

  // Automatically switch to the next slide every 3 seconds
  setInterval(showNextSlide, 4000); // Adjust the interval time as needed

  const toggleBtn = document.querySelector('.hide-overlay-btn');
  const overlay = document.querySelector('.overlay');
  const welcomeText = document.querySelector('.carousel-text');

  if (toggleBtn && overlay && welcomeText) {
    let isHidden = false;

    toggleBtn.addEventListener('click', () => {
      isHidden = !isHidden;

      overlay.classList.toggle('hidden', isHidden);
      welcomeText.classList.toggle('hidden', isHidden);

      toggleBtn.textContent = isHidden ? 'Show Overlay' : 'Hide Overlay';
    });
  }
});

// Footer Section
fetch("/Sections/footer")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer-container").innerHTML = data;

    // Reapply translations for the footer after loading
    const savedLang = getCookie('language') || 'en';  // Get the selected language from the cookie
    loadTranslations(savedLang, 'footer'); // Dynamically load footer translations
  });

// Lazy Loading of Images
window.addEventListener('scroll', function () {
  let images = document.querySelectorAll('img[data-src]');
  images.forEach(function (image) {
    if (image.getBoundingClientRect().top <= window.innerHeight && !image.src) {
      image.src = image.getAttribute('data-src');
    }
  });
});

// Enable Scroll Restoration
window.history.scrollRestoration = 'auto';

document.querySelectorAll('.slide img').forEach(img => {
  img.addEventListener('dragstart', e => e.preventDefault());
});


// FAQ's

document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other items
        items.forEach(i => {
          i.classList.remove('active');
          const ans = i.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  const iconURLs = [
    '/Images/Projects/BryanRoman/ICONS/BRYANROMAN_TRIANGLE.png',
    '/Images/Projects/BryanRoman/ICONS/BRYANROMAN_STAR.png',
    '/Images/Projects/BryanRoman/ICONS/BRYANROMAN_SQUARE.png'
  ];

  const hoverColors = ['#2d9cdb', '#f9cb40', '#e84545'];

  document.querySelectorAll('.faq-question').forEach((el, index) => {
    const icon = el.querySelector('.faq-icon');
    if (icon) { // ✅ Null check
      const imgURL = iconURLs[index % iconURLs.length];
      icon.src = imgURL;
    }

    const color = hoverColors[index % hoverColors.length];
    el.addEventListener('mouseenter', () => el.style.color = color);
    el.addEventListener('mouseleave', () => el.style.color = '');
  });
});


//CONTACT
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('form');
  const result = document.getElementById('result');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        if (response.ok) {
          form.reset();
          window.location.href = "/contact_thanks/index.html";
        } else {
          //console.error("Web3Forms responded with an error:", result);
          window.location.href = "/contact_failed/index.html";
        }

      } catch (error) {
        //console.error("Network or JavaScript error occurred:", error);
        //alert("Network error: " + error.message);
        window.location.href = "/contact_failed/index.html";
      }
    });
  }

  // Function to close the popup
  window.closeMessageModal = function () {
    messageModal.style.display = 'none';
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const icon = document.getElementById("icon");

    if (!icon) {
        console.log("Icon not found!");
        return;
    }

    icon.addEventListener("click", () => {
        console.log("Icon clicked!"); // debug

        // Remove class if already there to restart animation
        icon.classList.remove("animate-spin");
        void icon.offsetWidth; // force reflow
        icon.classList.add("animate-spin");
    });
});

const icon = document.getElementById('icon');

// Disable right-click on the image
icon.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log('Right-click disabled on icon');
});

// ===== STAR BURST ON ICON CLICK =====
var stars = 15;
var starSize = 80;
var starDistance = 200;
var starSpeed = 1.25;
var colors = ["#e84545", "#f9cb40", "#2d9cdb", "#48cc61"];

function buildStars() {
  for (let i = 0; i < stars; i++) {
    var id = 'gStar' + i;
    var sz = Math.floor((Math.random() * (starSize)) + (starSize / 3));
    var createStar = {
      id: id,
      class: "gStar",
      html: '<i class="fa fa-star"></i>',
      css: {
        position: 'absolute',
        zIndex: 510,
        fontSize: sz + 'px',
        opacity: 0
      }
    };
    $("body").append($("<div>", createStar));
  }
}

function fireStars(e) {
  e.preventDefault();

  const icon = $(e.currentTarget)[0];

  // Get the icon's center relative to the document, works on mobile & desktop
  const rect = icon.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const iconCenterX = rect.left + scrollLeft + rect.width / 2;
  const iconCenterY = rect.top + scrollTop + rect.height / 2;

  const colors = ["#e84545", "#f9cb40", "#2d9cdb", "#48cc61"];

  for (let i = 0; i < stars; i++) {
    const sz = parseFloat($("#gStar" + i).css("font-size"));
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * starDistance;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    const tl = gsap.timeline();
    tl.set('#gStar' + i, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.35,
      left: iconCenterX - sz / 2,
      top: iconCenterY - sz / 2,
      color: colors[i % colors.length]
    })
    .to('#gStar' + i, 0.35, { autoAlpha: 0.7 })
    .to('#gStar' + i, 0.6, {
      x: x,
      y: y - 50,
      rotation: 280,
      scale: 1,
      ease: "power1.out"
    }, '<')
    .to('#gStar' + i, 0.35, {
      autoAlpha: 0,
      y: "+=50",
      force3D: true
    }, ">-.25");
  }
}

// Build stars once
buildStars();

// Trigger when clicking your floating icon
$("#icon").click(fireStars);
