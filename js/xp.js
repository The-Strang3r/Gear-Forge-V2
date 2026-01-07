import { getSelectedEnchants } from "./buttons.js";
import { estimateOptimalLevelsForItem, estimateNaiveLevelsForItem } from "./planner.js";

export function updateXpSummary() {
  const totalEl = document.getElementById("xp-total");
  const savedEl = document.getElementById("xp-saved");
  const breakdownEl = document.getElementById("xp-breakdown");
  if (!totalEl || !savedEl || !breakdownEl) return;

  let totalOptimal = 0;
  let totalNaive = 0;

  const lines = [];

  document.querySelectorAll(".armor-piece").forEach(pieceDiv => {
    const name = pieceDiv.dataset.name;
    const enchants = getSelectedEnchants(pieceDiv);
    if (enchants.length === 0) return;

    const opt = estimateOptimalLevelsForItem(enchants);
    const naive = estimateNaiveLevelsForItem(enchants);

    totalOptimal += opt;
    totalNaive += naive;

    const saved = Math.max(0, naive - opt);
    lines.push({ name, opt, saved });
  });

  const savedTotal = Math.max(0, totalNaive - totalOptimal);

  totalEl.textContent = String(totalOptimal);
  savedEl.textContent = String(savedTotal);

  breakdownEl.innerHTML = lines.length
    ? lines
        .sort((a, b) => b.opt - a.opt)
        .map(l => `
          <div class="xp-itemline">
            <span><b>${l.name}</b></span>
            <span>${l.opt} <span style="opacity:.8;">(saved ${l.saved})</span></span>
          </div>
        `).join("")
    : `<div style="opacity:.7;">Select some enchants to see totals.</div>`;
}
