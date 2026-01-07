import { armorIcons, toolIcons, armorPieces, toolPieces, trims, colors } from "./data.js";
import { isArmorView } from "./state.js";
import { updateConflictGroupStateFromCheckbox, syncAllConflictGroupsInPiece } from "./conflicts.js";
import { saveArmor, saveTools, loadArmor, loadTools } from "./storage.js";
import { toggleThorns } from "./thorns.js";
import { updateEnchantButtons, wireEnchantButtons } from "./buttons.js";
import { updateXpSummary } from "./xp.js";
import { setupReceiptAutoMove } from "./receipt.js";

export function renderItems() {
  const grid = document.querySelector(".armor-grid");
  if (!grid) return;

  // Toggle grid layout based on view
  grid.classList.toggle("tools-view", !isArmorView());

  grid.classList.remove("fade-in");
  grid.classList.add("fade-out");

  setTimeout(() => {
    grid.innerHTML = "";

    const data = isArmorView() ? armorPieces : toolPieces;

    data.forEach((piece) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "armor-piece";
      itemDiv.dataset.name = piece.name;

      if (piece.comingSoon) {
        itemDiv.classList.add("coming-soon");
      }

      let dropdownHTML = "";
      if (isArmorView()) {
        dropdownHTML = `
          <div class="dropdown-group">
            <select class="trim-select">
              ${trims.map(trim => `<option value="${trim}">${trim}</option>`).join("")}
            </select>
            <select class="color-select">
              ${colors.map(color => `<option value="${color}">${color}</option>`).join("")}
            </select>
          </div>
        `;
      }

      let enchHTML = "";

      if (piece.comingSoon) {
        enchHTML = `
          <div class="enchantments coming-soon-text">
            Coming soon to Onemainworld! 1.22.x
          </div>
        `;
      } else {
        enchHTML = `
          <div class="enchantments">
            ${piece.enchantments.map((en) => {
              const label = (typeof en === "string") ? en : en.label;
              const group = (typeof en === "string") ? "" : (en.group || "");
              const conflicts = (typeof en === "string") ? [] : (en.conflictsWith || []);
              const thornsDisabled = label.includes("Thorns") ? "disabled" : "";

              const groupAttr = group ? `data-group="${group}"` : "";
              const conflictsAttr = conflicts.length ? `data-conflicts="${conflicts.join("|")}"` : "";

              return `
                <label class="enchantment">
                  <input type="checkbox"
                         data-enchant="${label}"
                         ${groupAttr}
                         ${conflictsAttr}
                         ${thornsDisabled}>
                  ${label}
                </label>
              `;
            }).join("")}
          </div>
        `;
      }

      const icon = isArmorView() ? armorIcons[piece.name] : toolIcons[piece.name];

      itemDiv.innerHTML = `
       <div class="armor-header">
         <h2>
           <img src="${icon}" alt="${piece.name}" class="item-icon">
           ${piece.name}
         </h2>

         ${piece.comingSoon ? `<div class="coming-soon-badge">Coming Soon</div>` : ""}

         ${dropdownHTML}
       </div>

        <div class="enchantments">
          ${enchHTML}
        </div>

        <div class="item-footer">
          ${
            piece.comingSoon
              ? ""
              : `<button class="item-enchant-btn" disabled>Enchant!</button>`
          }
        </div>
      `;

      grid.appendChild(itemDiv);
    });

    // Checkbox listeners
    document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
      el.addEventListener("change", (e) => {
        updateConflictGroupStateFromCheckbox(e.target);

        isArmorView() ? saveArmor() : saveTools();
        updateEnchantButtons();
        updateXpSummary();

        requestAnimationFrame(() => window.__updateReceiptAutoMove?.());
      });
    });

    // Select listeners
    document.querySelectorAll("select").forEach((el) => {
      el.addEventListener("change", () => {
        saveArmor();
        updateXpSummary();
        requestAnimationFrame(() => window.__updateReceiptAutoMove?.());
      });
    });

    // Enchant buttons
    wireEnchantButtons();

    // Restore state
    if (isArmorView()) {
      toggleThorns();
      loadArmor();
      toggleThorns();
    } else {
      loadTools();
    }

    document.querySelectorAll(".armor-piece").forEach(pieceDiv => {
      syncAllConflictGroupsInPiece(pieceDiv);
    });

    updateEnchantButtons();
    updateXpSummary();

    requestAnimationFrame(() => {
      grid.classList.remove("fade-out");
      grid.classList.add("fade-in");
    });

    setupReceiptAutoMove();
    requestAnimationFrame(() => window.__updateReceiptAutoMove?.());
  }, 200);
}
