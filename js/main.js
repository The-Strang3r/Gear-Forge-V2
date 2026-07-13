import { setView, isArmorView } from "./state.js";
import { initTheme, toggleTheme } from "./theme.js";
import { initThornsToggle, toggleThorns } from "./thorns.js";
import { renderItems } from "./render.js";
import { wireModalControls } from "./modal.js";
import { resetArmorData, showSaveNotice } from "./reset.js";
import { saveCurrent } from "./storage.js";
import { updateXpSummary } from "./xp.js";
import { setupReceiptAutoMove } from "./receipt.js";
import { initServerStatus } from "./serverStatus.js";


import {
  copyShareLink,
  loadSharedBuildFromUrl
} from "./share.js";

document.addEventListener("DOMContentLoaded", () => {
  const sharedBuildLoaded = loadSharedBuildFromUrl();

  initTheme();
  initServerStatus();

  const toggleViewBtn =
    document.getElementById("toggle-view-btn");

  const resetBtn =
    document.getElementById("reset-btn");

  const themeBtn =
    document.getElementById("theme-toggle");

  const thornsToggle =
    document.getElementById("thorns-toggle");

  const shareButton =
    document.getElementById("copy-share-link");

  if (toggleViewBtn) {
    toggleViewBtn.textContent = isArmorView()
      ? "Show Tools"
      : "Show Armor";

    toggleViewBtn.addEventListener("click", () => {
      saveCurrent();

      setView(isArmorView() ? "tools" : "armor");

      toggleViewBtn.textContent = isArmorView()
        ? "Show Tools"
        : "Show Armor";

      renderItems();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetArmorData();

      requestAnimationFrame(() => {
        window.__updateReceiptAutoMove?.();
      });
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      await copyShareLink();
    });
  }

  const shoppingToggle =
    document.getElementById("shopping-list-toggle");

  const shoppingContent =
    document.getElementById("shopping-list-content");

  if (shoppingToggle && shoppingContent) {
    const collapsed =
      localStorage.getItem("shoppingListCollapsed") === "true";

    shoppingToggle.setAttribute(
      "aria-expanded",
      String(!collapsed)
    );

    shoppingContent.classList.toggle(
      "is-collapsed",
      collapsed
    );

    shoppingToggle.addEventListener("click", () => {
      const isExpanded =
        shoppingToggle.getAttribute("aria-expanded") === "true";

      const shouldCollapse = isExpanded;

      shoppingToggle.setAttribute(
        "aria-expanded",
        String(!shouldCollapse)
      );

      shoppingContent.classList.toggle(
        "is-collapsed",
        shouldCollapse
      );

      localStorage.setItem(
        "shoppingListCollapsed",
        String(shouldCollapse)
      );
    });
  }


  const breakdownToggle =
    document.getElementById("xp-breakdown-toggle");

  const breakdown =
    document.getElementById("xp-breakdown");

  if (breakdownToggle && breakdown) {
    const collapsed =
      localStorage.getItem("xpBreakdownCollapsed") === "true";

    breakdownToggle.setAttribute(
      "aria-expanded",
      String(!collapsed)
    );

    breakdown.classList.toggle(
      "is-collapsed",
      collapsed
    );

    breakdownToggle.addEventListener("click", () => {
      const isExpanded =
        breakdownToggle.getAttribute("aria-expanded") === "true";

      const shouldCollapse = isExpanded;

      breakdownToggle.setAttribute(
        "aria-expanded",
        String(!shouldCollapse)
      );

      breakdown.classList.toggle(
        "is-collapsed",
        shouldCollapse
      );

      localStorage.setItem(
        "xpBreakdownCollapsed",
        String(shouldCollapse)
      );
    });
  }

  initThornsToggle();

  if (thornsToggle) {
    thornsToggle.addEventListener("change", () => {
      toggleThorns();
      updateXpSummary();

      requestAnimationFrame(() => {
        window.__updateReceiptAutoMove?.();
      });
    });
  }

  wireModalControls();
  renderItems();

  document
    .querySelector(".container")
    ?.classList.add("show");

  setupReceiptAutoMove();

  requestAnimationFrame(() => {
    window.__updateReceiptAutoMove?.();
  });

  if (sharedBuildLoaded) {
    setTimeout(() => {
      showSaveNotice("Shared build loaded!");
    }, 300);
  }
});
