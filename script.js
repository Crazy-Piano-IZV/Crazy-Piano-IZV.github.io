// Add event listeners to each key
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => playSound(key.dataset.note));
  });
  
  // Function to play sound
  function playSound(note) {
    const audio = new Audio(`sounds/${note}.mp3`);
    audio.play();
  }

  // Library script
  function toggleLanguage() {
    var langToggle = document.getElementById("languageToggle");
    var lang = langToggle.textContent === "LV" ? "en" : "lv";
    var translations = {
        lv: { title: "Virtuālās Klavieres", library: "Skaņu bibliotēka", download: "Lejupielādēt melodiju", training: "Apmācības režīms", tones: "Mainīt toņus", libraryTitle: "Skaņu bibliotēka", home: "Galvenā" },
        en: { title: "Virtual Piano", library: "Sound Library", download: "Download melody", training: "Training mode", tones: "Change tones", libraryTitle: "Sound Library", home: "Home" }
    };
    document.querySelectorAll("[data-lang]").forEach(el => {
        var key = el.getAttribute("data-lang");
        el.textContent = translations[lang][key];
    });
    document.getElementById("libraryTitle").textContent = translations[lang].libraryTitle;
    langToggle.textContent = lang.toUpperCase();
}
function toggleLibrary() {
    var library = document.getElementById("musicLibrary");
    library.style.display = (library.style.display === "none" || library.style.display === "") ? "block" : "none";
}
function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.style.left = menu.style.left === "-25%" ? "0px" : "-25%";
    menu.style.opacity = menu.style.opacity === "0" ? "1" : "0";
}
function goHome() {
    location.reload();
}
document.getElementById("toggleButton").addEventListener("click", toggleMenu);
toggleLanguage();
