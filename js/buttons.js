import { isFeasibleUnder40FullProcess } from "./planner.js";
import { showPlanModal } from "./modal.js";

export function getSelectedEnchants(pieceDiv) {
  return Array.from(pieceDiv.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.dataset.enchant);
}

export function updateEnchantButtons() {
  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const btn = pieceDiv.querySelector(".item-enchant-btn");
    if (!btn) return;

    const enchants = getSelectedEnchants(pieceDiv);

    if (enchants.length === 0) {
      btn.disabled = true;
      btn.textContent = "Enchant!";
      btn.classList.remove("too-expensive");
      return;
    }

    const feasible = isFeasibleUnder40FullProcess(enchants);

    if (!feasible) {
      btn.disabled = true;
      btn.textContent = "Too Expensive!";
      btn.classList.add("too-expensive");
    } else {
      btn.disabled = false;
      btn.textContent = "Enchant!";
      btn.classList.remove("too-expensive");
    }
  });
}

export function wireEnchantButtons() {
  document.querySelectorAll(".item-enchant-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const pieceDiv = e.target.closest(".armor-piece");
      if (!pieceDiv) return;
      if (e.target.disabled) return;

      const itemName = pieceDiv.dataset.name;
      const enchants = getSelectedEnchants(pieceDiv);
      if (enchants.length === 0) return;

      showPlanModal(itemName, enchants);
    });
  });
}
