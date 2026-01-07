import { isArmorView } from "./state.js";
import { updateEnchantButtons } from "./buttons.js";

export function initThornsToggle() {
  const thornsToggle = document.getElementById("thorns-toggle");
  if (!thornsToggle) return;

  const thornsEnabled = localStorage.getItem("thornsEnabled") === "true";
  thornsToggle.checked = thornsEnabled;
}

export function toggleThorns() {
  if (!isArmorView()) return;

  const thornsToggle = document.getElementById("thorns-toggle");
  if (!thornsToggle) return;

  localStorage.setItem("thornsEnabled", String(thornsToggle.checked));

  const savedData = JSON.parse(localStorage.getItem("armorData")) || {};

  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const armorName = pieceDiv.dataset.name;
    const savedEnchantments = savedData[armorName]?.enchantments || [];

    const checkbox = pieceDiv.querySelector('input[data-enchant="Thorns III"]');
    if (!checkbox) return;

    if (thornsToggle.checked) {
      checkbox.disabled = false;
      checkbox.checked = savedEnchantments.includes("Thorns III");
      const label = checkbox.closest("label");
      if (label) label.classList.remove("disabled-thorns");
    } else {
      checkbox.checked = false;
      checkbox.disabled = true;
      const label = checkbox.closest("label");
      if (label) label.classList.add("disabled-thorns");
    }
  });

  updateEnchantButtons();
}
