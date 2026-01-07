import { isArmorView } from "./state.js";
import { showSaveNotice } from "./reset.js";
import { syncAllConflictGroupsInPiece } from "./conflicts.js";

export function saveArmor() {
  const data = {};
  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const name = pieceDiv.dataset.name;
    const trimSelect = pieceDiv.querySelector(".trim-select");
    const colorSelect = pieceDiv.querySelector(".color-select");
    const trim = trimSelect ? trimSelect.value : null;
    const color = colorSelect ? colorSelect.value : null;

    const enchants = Array.from(pieceDiv.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.dataset.enchant);

    data[name] = {
      ...(trim && { trim }),
      ...(color && { color }),
      enchantments: enchants,
    };
  });

  localStorage.setItem("armorData", JSON.stringify(data));
  showSaveNotice();
}

export function saveTools() {
  const data = {};
  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const name = pieceDiv.dataset.name;
    const enchants = Array.from(pieceDiv.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.dataset.enchant);

    data[name] = { enchantments: enchants };
  });

  localStorage.setItem("toolData", JSON.stringify(data));
  showSaveNotice();
}

export function saveCurrent() {
  isArmorView() ? saveArmor() : saveTools();
}

export function loadArmor() {
  const savedData = JSON.parse(localStorage.getItem("armorData"));
  if (!savedData) return;

  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const name = pieceDiv.dataset.name;
    const pieceData = savedData[name];
    if (!pieceData) return;

    const trimSelect = pieceDiv.querySelector(".trim-select");
    const colorSelect = pieceDiv.querySelector(".color-select");

    if (trimSelect && pieceData.trim) trimSelect.value = pieceData.trim;
    if (colorSelect && pieceData.color) colorSelect.value = pieceData.color;

    pieceDiv.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = pieceData.enchantments.includes(checkbox.dataset.enchant);
    });

    syncAllConflictGroupsInPiece(pieceDiv);
  });
}

export function loadTools() {
  const savedData = JSON.parse(localStorage.getItem("toolData"));
  if (!savedData) return;

  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const name = pieceDiv.dataset.name;
    const pieceData = savedData[name];
    if (!pieceData) return;

    pieceDiv.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = pieceData.enchantments.includes(checkbox.dataset.enchant);
    });

    syncAllConflictGroupsInPiece(pieceDiv);
  });
}
