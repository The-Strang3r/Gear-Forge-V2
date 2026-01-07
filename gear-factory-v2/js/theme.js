export function toggleTheme() {
  if (localStorage.getItem("theme") === "light") {
    setDarkTheme();
    hideLightModeJoke();
  } else {
    setLightTheme();
    showLightModeJoke();
  }
}

export function initTheme() {
  (localStorage.getItem("theme") === "light") ? setLightTheme() : setDarkTheme();
}

export function setLightTheme() {
  const root = document.documentElement;
  root.style.setProperty("--bg-color", "#ffffff");
  root.style.setProperty("--text-color", "#000000");
  root.style.setProperty("--container-bg", "#f5f5f5");
  root.style.setProperty("--armor-piece-bg", "#e0e0e0");
  root.style.setProperty("--hover-bg", "#d0d0d0");
  root.style.setProperty("--checkbox-bg", "#ccc");
  root.style.setProperty("--checkbox-checked", "#4caf50");
  root.style.setProperty("--save-success", "#4caf50");
  root.style.setProperty("--reset-success", "#ff9800");
  root.style.setProperty("--footer-text", "#555");
  localStorage.setItem("theme", "light");
}

export function setDarkTheme() {
  const root = document.documentElement;
  root.style.setProperty("--bg-color", "#1e1e1e");
  root.style.setProperty("--text-color", "#ffffff");
  root.style.setProperty("--container-bg", "#2c2c2c");
  root.style.setProperty("--armor-piece-bg", "#3c3c3c");
  root.style.setProperty("--hover-bg", "#4a4a4a");
  root.style.setProperty("--checkbox-bg", "#555");
  root.style.setProperty("--checkbox-checked", "#4caf50");
  root.style.setProperty("--save-success", "#4caf50");
  root.style.setProperty("--reset-success", "#ff9800");
  root.style.setProperty("--footer-text", "#777");
  localStorage.setItem("theme", "dark");
}

function showLightModeJoke() {
  if (window.innerWidth <= 768) return;

  let joke = document.getElementById("light-mode-joke");
  if (!joke) {
    joke = document.createElement("div");
    joke.id = "light-mode-joke";
    joke.style.cssText =
      "position:fixed;bottom:20px;right:20px;background:rgba(0,0,0,0.7);color:white;padding:10px 15px;border-radius:10px;font-size:14px;z-index:9999;opacity:0;transition:opacity 0.5s;";
    joke.textContent = "Only fucken freaks use light mode -_-";
    document.body.appendChild(joke);
    requestAnimationFrame(() => { joke.style.opacity = "1"; });
  }
}

function hideLightModeJoke() {
  const joke = document.getElementById("light-mode-joke");
  if (joke) {
    joke.style.opacity = "0";
    setTimeout(() => { joke.remove(); }, 500);
  }
}
