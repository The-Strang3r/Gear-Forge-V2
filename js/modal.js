import { optimalFullProcessPlan } from "./planner.js";
import { showSaveNotice } from "./reset.js";

export function wireModalControls() {
  const modal = document.getElementById("enchant-modal");
  const closeBtn = document.getElementById("modal-close");
  const okBtn = document.getElementById("modal-ok");
  const copyBtn = document.getElementById("modal-copy");

  if (!modal || !closeBtn || !okBtn || !copyBtn) return;

  const hide = () => hidePlanModal();

  closeBtn.addEventListener("click", hide);
  okBtn.addEventListener("click", hide);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) hide();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });

  copyBtn.addEventListener("click", () => {
    const title = document.getElementById("modal-title")?.textContent || "";
    const subtitle = document.getElementById("modal-subtitle")?.textContent || "";
    const steps = Array.from(document.querySelectorAll("#modal-steps li"))
      .map(li => `- ${li.textContent}`).join("\n");

    const text = `${title}\n${subtitle ? subtitle + "\n" : ""}${steps}`;
    navigator.clipboard?.writeText(text).then(() => showSaveNotice("Copied!"));
  });
}

export function showPlanModal(itemName, enchants) {
  const modal = document.getElementById("enchant-modal");
  if (!modal) return;

  const titleEl = document.getElementById("modal-title");
  const subtitleEl = document.getElementById("modal-subtitle");
  const stepsEl = document.getElementById("modal-steps");

  if (titleEl) titleEl.textContent = `Enchant Plan — ${itemName}`;
  if (subtitleEl) subtitleEl.textContent = `Selected enchantments: ${enchants.join(", ")}`;

  const plan = optimalFullProcessPlan(enchants, true);
  const steps = plan.steps.length ? plan.steps : ["No valid plan found."];
  if (stepsEl) stepsEl.innerHTML = steps.map(s => `<li>${s}</li>`).join("");

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

export function hidePlanModal() {
  const modal = document.getElementById("enchant-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
