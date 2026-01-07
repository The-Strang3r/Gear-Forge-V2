export function updateConflictGroupStateFromCheckbox(changedCheckbox) {
  if (!changedCheckbox) return;

  const pieceDiv = changedCheckbox.closest(".armor-piece");
  if (!pieceDiv) return;

  // Instead of syncing only one group, re-sync EVERYTHING in this piece
  // so pairwise + groups always end up consistent.
  syncAllConflictGroupsInPiece(pieceDiv);
}

export function syncAllConflictGroupsInPiece(pieceDiv) {
  // 1) group-based conflicts (mutually exclusive)
  const groups = new Set();
  pieceDiv
    .querySelectorAll('input[type="checkbox"][data-group]')
    .forEach(cb => groups.add(cb.dataset.group));

  groups.forEach(g => syncConflictGroup(pieceDiv, g));

  // 2) pairwise conflicts (trident-style)
  syncPairwiseConflictsInPiece(pieceDiv);
}

export function syncConflictGroup(pieceDiv, group) {
  const list = Array.from(
    pieceDiv.querySelectorAll(
      `input[type="checkbox"][data-group="${CSS.escape(group)}"]`
    )
  );
  if (list.length === 0) return;

  const checked = list.filter(cb => cb.checked);

  // No selection in group → enable them (except Thorns handled elsewhere)
  if (checked.length === 0) {
    list.forEach(cb => {
      if (cb.dataset.enchant === "Thorns III") return;
      cb.disabled = false;
      cb.closest("label")?.classList.remove("disabled-thorns");
    });
    return;
  }

  // One selected → disable all others in that group
  const keeper = checked[0];
  checked.slice(1).forEach(cb => (cb.checked = false));

  list.forEach(cb => {
    if (cb.dataset.enchant === "Thorns III") return;

    const isOther = cb !== keeper;
    cb.disabled = isOther;
    cb.closest("label")?.classList.toggle("disabled-thorns", isOther);
  });
}

// ------------------------
// Pairwise conflicts (data-conflicts="A|B|C")
// IMPORTANT: This must *NOT* re-enable things that group logic disabled.
// So we compute "groupDisabled" first, then OR it with pairwise.
// ------------------------
function syncPairwiseConflictsInPiece(pieceDiv) {
  const all = Array.from(pieceDiv.querySelectorAll('input[type="checkbox"][data-enchant]'));

  // Build selected set
  const selected = new Set(all.filter(cb => cb.checked).map(cb => cb.dataset.enchant));

  // Conflicts map: enchant label -> [labels...]
  const conflictsMap = new Map();
  for (const cb of all) {
    const raw = cb.dataset.conflicts || "";
    const list = raw
      ? raw.split("|").map(s => s.trim()).filter(Boolean)
      : [];
    conflictsMap.set(cb.dataset.enchant, list);
  }

  // Compute which enchants should be disabled due to GROUPS (without touching UI)
  const groupDisabled = new Set();
  const groups = new Map(); // group -> [checkboxes]
  for (const cb of all) {
    const g = cb.dataset.group;
    if (!g) continue;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(cb);
  }

  for (const [g, list] of groups.entries()) {
    const checked = list.filter(cb => cb.checked);
    if (checked.length === 0) continue;

    const keeper = checked[0];
    for (const cb of list) {
      if (cb === keeper) continue;
      groupDisabled.add(cb.dataset.enchant);
    }
  }

  // Apply combined disables: groupDisabled OR pairwiseDisabled
  for (const cb of all) {
    // leave thorns alone (thorns.js controls it)
    if (cb.dataset.enchant === "Thorns III") continue;

    if (cb.checked) {
      cb.disabled = false;
      cb.closest("label")?.classList.remove("disabled-thorns");
      continue;
    }

    // Pairwise: if this conflicts with selected, OR selected conflicts with this
    let pairwiseDisable = false;
    const mine = conflictsMap.get(cb.dataset.enchant) || [];

    for (const s of selected) {
      if (mine.includes(s)) { pairwiseDisable = true; break; }
      const theirs = conflictsMap.get(s) || [];
      if (theirs.includes(cb.dataset.enchant)) { pairwiseDisable = true; break; }
    }

    const shouldDisable = groupDisabled.has(cb.dataset.enchant) || pairwiseDisable;

    cb.disabled = shouldDisable;
    cb.closest("label")?.classList.toggle("disabled-thorns", shouldDisable);
  }
}