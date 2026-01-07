let setupDone = false;

export function setupReceiptAutoMove() {
  if (setupDone) return;
  setupDone = true;

  const layout = document.querySelector(".main-layout");
  if (!layout) return;

  const BUFFER = 20;

  function rectsOverlapWithBuffer(a, b, buffer) {
    const bExp = {
      left: b.left - buffer,
      right: b.right + buffer,
      top: b.top - buffer,
      bottom: b.bottom + buffer,
    };

    const overlapX = !(a.right <= bExp.left || a.left >= bExp.right);
    const overlapY = !(a.bottom <= bExp.top || a.top >= bExp.bottom);
    return overlapX && overlapY;
  }

  function update() {
    const receipt = document.querySelector(".xp-summary");
    const resetBtn = document.getElementById("reset-btn");
    if (!receipt || !resetBtn) return;

    const isTwoColumn = window.matchMedia("(min-width: 901px)").matches;
    if (!isTwoColumn) {
      layout.classList.remove("receipt-bottom");
      return;
    }

    layout.classList.remove("receipt-bottom");

    const rRect = receipt.getBoundingClientRect();
    const bRect = resetBtn.getBoundingClientRect();

    const coveredOrTooClose = rectsOverlapWithBuffer(rRect, bRect, BUFFER);
    layout.classList.toggle("receipt-bottom", coveredOrTooClose);
  }

  // keep compatibility with your previous code
  window.__updateReceiptAutoMove = update;

  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("scroll", update, { passive: true });

  const ro = new ResizeObserver(() => requestAnimationFrame(update));
  ro.observe(document.body);

  requestAnimationFrame(update);
}
