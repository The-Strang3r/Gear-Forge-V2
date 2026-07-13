import { isArmorView } from "./state.js";
import { toggleThorns } from "./thorns.js";
import { updateEnchantButtons } from "./buttons.js";
import { updateXpSummary } from "./xp.js";
import { updateShoppingList } from "./shoppingList.js";

export function resetArmorData() {
  document.querySelectorAll("select").forEach(select => (select.selectedIndex = 0));

  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    if (cb.dataset.group) {
      cb.disabled = false;
      const label = cb.closest("label");
      if (label) label.classList.remove("disabled-thorns");
    }
  });

  const storageKey = isArmorView() ? "armorData" : "toolData";
  localStorage.removeItem(storageKey);

  if (isArmorView()) toggleThorns();

  updateEnchantButtons();
  updateXpSummary();
  updateShoppingList();

  const btn = document.getElementById("reset-btn");
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 500);

  showSaveNotice("Reset Successful!");
}

export function showSaveNotice(message = "Saved!") {
  const notice = document.getElementById("save-notice");
  if (!notice) return;

  notice.textContent = message;
  notice.style.backgroundColor = (message === "Reset Successful!") ? "#ff9800" : "#4caf50";
  notice.style.opacity = "1";
  setTimeout(() => { notice.style.opacity = "0"; }, 1000);
}
