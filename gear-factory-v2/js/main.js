import { state, setView, isArmorView } from "./state.js";
import { initTheme, toggleTheme } from "./theme.js";
import { initThornsToggle, toggleThorns } from "./thorns.js";
import { renderItems } from "./render.js";
import { wireModalControls } from "./modal.js";
import { resetArmorData } from "./reset.js";
import { saveCurrent } from "./storage.js";
import { updateXpSummary } from "./xp.js";
import { setupReceiptAutoMove } from "./receipt.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  const toggleViewBtn = document.getElementById("toggle-view-btn");
  const resetBtn = document.getElementById("reset-btn");
  const themeBtn = document.getElementById("theme-toggle");
  const thornsToggle = document.getElementById("thorns-toggle");

  if (toggleViewBtn) {
    toggleViewBtn.addEventListener("click", () => {
      saveCurrent();

      setView(isArmorView() ? "tools" : "armor");
      toggleViewBtn.textContent = isArmorView() ? "Show Tools" : "Show Armor";

      renderItems();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetArmorData();
      requestAnimationFrame(() => window.__updateReceiptAutoMove?.());
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  initThornsToggle();
  if (thornsToggle) {
    thornsToggle.addEventListener("change", () => {
      toggleThorns();
      updateXpSummary();
      requestAnimationFrame(() => window.__updateReceiptAutoMove?.());
    });
  }

  wireModalControls();
  renderItems();

  document.querySelector(".container")?.classList.add("show");

  setupReceiptAutoMove();
  requestAnimationFrame(() => window.__updateReceiptAutoMove?.());
});
