// Function to change the language content
function changeLanguage(language) {
    const elements = document.querySelectorAll("[data-translate]");
  
    elements.forEach(element => {
      const key = element.getAttribute("data-translate");
      if (translations[language] && translations[language][key]) {
        element.innerHTML = translations[language][key];
      }
    });
  }
  
  // Event listener to change the language when a button is clicked
  document.getElementById("lang-english").addEventListener("click", () => changeLanguage("en"));
  document.getElementById("lang-spanish").addEventListener("click", () => changeLanguage("es"));