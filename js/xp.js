import { getSelectedEnchants } from "./buttons.js";

import {
  optimalFullProcessPlan,
  estimateOptimalLevelsForItem,
  estimateNaiveLevelsForItem
} from "./planner.js";

import {
  xpForOperations,
  formatXp
} from "./xpMath.js";

export function updateXpSummary() {
  const totalEl = document.getElementById("xp-total");
  const pointsEl = document.getElementById("xp-points");
  const savedEl = document.getElementById("xp-saved");
  const breakdownEl = document.getElementById("xp-breakdown");

  if (!totalEl || !pointsEl || !savedEl || !breakdownEl) return;

  let totalOptimal = 0;
  let totalNaive = 0;
  let totalXpPoints = 0;
  let exactXpAvailable = true;

  const lines = [];

  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const name = pieceDiv.dataset.name;
    const enchants = getSelectedEnchants(pieceDiv);

    if (enchants.length === 0) return;

    const plan = optimalFullProcessPlan(enchants, false);

    const optimalLevels = plan.feasible
      ? plan.total
      : estimateOptimalLevelsForItem(enchants);

    const naiveLevels = estimateNaiveLevelsForItem(enchants);

    const xpPoints = plan.feasible
      ? xpForOperations(plan.operationCosts)
      : 0;

    if (!plan.feasible) {
      exactXpAvailable = false;
    }

    totalOptimal += optimalLevels;
    totalNaive += naiveLevels;
    totalXpPoints += xpPoints;

    const saved = Math.max(0, naiveLevels - optimalLevels);

    lines.push({
      name,
      optimalLevels,
      saved,
      xpPoints,
      feasible: plan.feasible
    });
  });

  const savedTotal = Math.max(0, totalNaive - totalOptimal);

  totalEl.textContent = String(totalOptimal);
  savedEl.textContent = String(savedTotal);

  pointsEl.textContent = exactXpAvailable
    ? formatXp(totalXpPoints)
    : "Unavailable";

  breakdownEl.innerHTML = lines.length
    ? lines
        .sort((a, b) => b.optimalLevels - a.optimalLevels)
        .map((line) => {
          const xpText = line.feasible
            ? `${formatXp(line.xpPoints)} XP`
            : "No valid plan";

          return `
            <div class="xp-itemline">
              <span>
                <b>${line.name}</b>
                <small class="xp-item-points">${xpText}</small>
              </span>

              <span>
                ${line.optimalLevels}
                <span style="opacity:.8;">
                  (saved ${line.saved})
                </span>
              </span>
            </div>
          `;
        })
        .join("")
    : `
      <div style="opacity:.7;">
        Select some enchants to see totals.
      </div>
    `;
}
