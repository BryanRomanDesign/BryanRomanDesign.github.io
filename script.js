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
fetch("Sections/socialbar.html")
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
        loadTranslations(selectedLang, 'index');  // For general content
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
function loadTranslations(language = 'en', section = 'index') {
  // Construct the path to the translation JSON file for the specific section
  const translationFilePath = `${section}_trns.json`;

  // Fetch the translations JSON file
  fetch('Translations/' + translationFilePath)
    .then(response => response.json())  // Parse the JSON
    .then(translations => {
      // Get all elements with the data-translate attribute
      document.querySelectorAll('[data-translate]').forEach(element => {
        const translationKey = element.getAttribute('data-translate');

        // If the key exists in the translations object, set the translated text
        if (translations[language] && translations[language][translationKey]) {
          element.textContent = translations[language][translationKey];
        }
      });
    })
    .catch(error => {
      console.error('Error loading translations:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  // Check if there's a language cookie, if not, default to 'en'
  const savedLang = getCookie('language'); // Default to 'en' if no cookie is set

  // Apply translations based on the saved language
  loadTranslations(savedLang, 'index');  // Apply translations for the general page
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
});


// Footer Section
fetch("Sections/footer.html")
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
