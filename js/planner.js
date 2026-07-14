import { INV_ROMAN, parseEnchantLabelToNameLevel, anvilApplyJava } from "./anvilMath.js";

function consolidateEnchantList(labels) {
  const parsed = labels.map(parseEnchantLabelToNameLevel);
  const consolidated = {};
  for (const e of parsed) consolidated[e.name] = Math.max(consolidated[e.name] ?? 0, e.level);
  return consolidated;
}

function enchMapToLabelList(enchMap) {
  const parts = [];
  for (const [name, level] of Object.entries(enchMap)) {
    if (level <= 1) parts.push(name);
    else parts.push(`${name} ${INV_ROMAN[level] ?? level}`);
  }
  return parts.join(", ");
}

function canonKey(itemMask, itemUses, books) {
  const sorted = books
    .slice()
    .sort((a, b) => (a.mask - b.mask) || (a.uses - b.uses))
    .map(b => `${b.mask}:${b.uses}`)
    .join("|");
  return `${itemMask}:${itemUses}::${sorted}`;
}

export function optimalFullProcessPlan(selectedLabels, wantSteps) {
  const consolidated = consolidateEnchantList(selectedLabels);
  const names = Object.keys(consolidated);
  const n = names.length;

  if (n === 0) {
    return {
      feasible: true,
      total: 0,
      maxOp: 0,
      steps: [],
      operationCosts: []
    };
  };

  const nameToIdx = new Map(names.map((nm, i) => [nm, i]));
  const goalMask = (1 << n) - 1;

  function mapToMask(enchMap) {
    let m = 0;
    for (const nm of Object.keys(enchMap)) {
      const idx = nameToIdx.get(nm);
      if (idx !== undefined) m |= (1 << idx);
    }
    return m;
  }

  const leafBooks = names.map(nm => ({
    type: "book",
    ench: { [nm]: consolidated[nm] },
    uses: 0,
    mask: (1 << nameToIdx.get(nm)),
    label: `${nm}${consolidated[nm] > 1 ? " " + (INV_ROMAN[consolidated[nm]] ?? consolidated[nm]) : ""}`,
  }));

  const startItem = { type: "item", ench: {}, uses: 0, mask: 0, label: "Item" };

  const startBooks = leafBooks.map(b => ({ ...b }));
  const startKey = canonKey(startItem.mask, startItem.uses, startBooks);

  const dist = new Map([[startKey, 0]]);
  const bestMaxOp = new Map([[startKey, 0]]);
  const prev = new Map();
  const pq = [{ key: startKey, cost: 0 }];
  const payload = new Map([[startKey, { item: startItem, books: startBooks }]]);

  while (pq.length) {
    let mi = 0;
    for (let i = 1; i < pq.length; i++) if (pq[i].cost < pq[mi].cost) mi = i;
    const cur = pq.splice(mi, 1)[0];

    const curCost = dist.get(cur.key);
    if (curCost === undefined || cur.cost !== curCost) continue;

    const state = payload.get(cur.key);
    if (!state) continue;

    const { item, books } = state;

    if (item.mask === goalMask && books.length === 0) {
      const steps = [];
      const operationCosts = [];

      let k = cur.key;

      while (prev.has(k)) {
        const previous = prev.get(k);

        operationCosts.push(previous.opCost);

        if (wantSteps) {
          steps.push(previous.step);
        }

        k = previous.prevKey;
      }

      operationCosts.reverse();

      if (wantSteps) {
        steps.reverse();
        steps.push(`Total levels spent: ${curCost}`);
      }

      return {
        feasible: true,
        total: curCost,
        maxOp: bestMaxOp.get(cur.key) ?? 0,
        steps,
        operationCosts
      };
    }

    // book + book -> book
    for (let i = 0; i < books.length; i++) {
      for (let j = 0; j < books.length; j++) {
        if (i === j) continue;

        const A = books[i];
        const B = books[j];

        const res = anvilApplyJava(A.ench, A.uses, B.ench, B.uses);
        const opCost = res.opCost;
        if (opCost >= 40) continue;

        const newEnch = res.newTargetEnchants;
        const newMask = mapToMask(newEnch);
        const expectedMask = (A.mask | B.mask);
        if (newMask !== expectedMask) continue;

        const newBook = {
          type: "book",
          ench: newEnch,
          uses: res.newTargetUses,
          mask: newMask,
          label: `Book(${enchMapToLabelList(newEnch)})`,
        };

        const newBooks = books.filter((_, idx) => idx !== i && idx !== j);
        newBooks.push(newBook);

        const nextKey = canonKey(item.mask, item.uses, newBooks);
        const nextCost = curCost + opCost;
        const nextMax = Math.max(bestMaxOp.get(cur.key) ?? 0, opCost);

        const old = dist.get(nextKey);
        if (old === undefined || nextCost < old) {
          dist.set(nextKey, nextCost);
          bestMaxOp.set(nextKey, nextMax);
          payload.set(nextKey, { item, books: newBooks });
          pq.push({ key: nextKey, cost: nextCost });
          prev.set(nextKey, {
            prevKey: cur.key,
            opCost,
            step: `Combine (${A.label}) + (${B.label}) → Book (cost ${opCost})`
          });
        }
      }
    }

    // item + book -> item
    for (let j = 0; j < books.length; j++) {
      const B = books[j];

      const res = anvilApplyJava(item.ench, item.uses, B.ench, B.uses);
      const opCost = res.opCost;
      if (opCost >= 40) continue;

      const newEnch = res.newTargetEnchants;
      const newMask = mapToMask(newEnch);
      const expectedMask = (item.mask | B.mask);
      if (newMask !== expectedMask) continue;

      const nextItem = {
        type: "item",
        ench: newEnch,
        uses: res.newTargetUses,
        mask: newMask,
        label: "Item",
      };

      const newBooks = books.filter((_, idx) => idx !== j);

      const nextKey = canonKey(nextItem.mask, nextItem.uses, newBooks);
      const nextCost = curCost + opCost;
      const nextMax = Math.max(bestMaxOp.get(cur.key) ?? 0, opCost);

      const old = dist.get(nextKey);

      if (old === undefined || nextCost < old) {
        dist.set(nextKey, nextCost);
        bestMaxOp.set(nextKey, nextMax);
        payload.set(nextKey, {
          item: nextItem,
          books: newBooks
        });

        pq.push({
          key: nextKey,
          cost: nextCost
        });

        prev.set(nextKey, {
          prevKey: cur.key,
          opCost,
          step: `Apply (${B.label}) → Item (cost ${opCost})`
        });
      }
    }
  }

  return {
    feasible: false,
    total: Infinity,
    maxOp: Infinity,
    steps: wantSteps
      ? ["No valid <40-per-step anvil sequence found."]
      : [],
    operationCosts: []
  };
}

export function isFeasibleUnder40FullProcess(selectedLabels) {
  return optimalFullProcessPlan(selectedLabels, false).feasible;
}

// fallback optimizer (used only for XP display if infeasible)
function optimalBookMergeFallback(enchants) {
  const consolidated = consolidateEnchantList(enchants);
  const names = Object.keys(consolidated);
  const n = names.length;
  if (n === 0) return { total: 0 };

  const leafBooks = names.map(name => ({
    enchants: { [name]: consolidated[name] },
    uses: 0,
  }));

  const FULL = (1 << n) - 1;
  const dp = Array.from({ length: 1 << n }, () => new Map());

  for (let i = 0; i < n; i++) {
    dp[1 << i].set(0, {
      cost: 0,
      uses: 0,
      enchants: { ...leafBooks[i].enchants },
    });
  }

  const relax = (map, uses, cand) => {
    const ex = map.get(uses);
    if (!ex || cand.cost < ex.cost) map.set(uses, cand);
  };

  for (let mask = 1; mask <= FULL; mask++) {
    if ((mask & (mask - 1)) === 0) continue;

    for (let a = (mask - 1) & mask; a > 0; a = (a - 1) & mask) {
      const b = mask ^ a;
      if (b === 0) continue;
      if (a > b) continue;

      for (const A of dp[a].values()) {
        for (const B of dp[b].values()) {
          {
            const res = anvilApplyJava(A.enchants, A.uses, B.enchants, B.uses);
            relax(dp[mask], res.newTargetUses, {
              cost: A.cost + B.cost + res.opCost,
              uses: res.newTargetUses,
              enchants: res.newTargetEnchants,
            });
          }
          {
            const res = anvilApplyJava(B.enchants, B.uses, A.enchants, A.uses);
            relax(dp[mask], res.newTargetUses, {
              cost: A.cost + B.cost + res.opCost,
              uses: res.newTargetUses,
              enchants: res.newTargetEnchants,
            });
          }
        }
      }
    }
  }

  let best = null;
  for (const s of dp[FULL].values()) {
    if (!best || s.cost < best.cost) best = s;
  }

  const apply = anvilApplyJava({}, 0, best.enchants, best.uses);
  return { total: best.cost + apply.opCost };
}

export function estimateOptimalLevelsForItem(enchants) {
  const plan = optimalFullProcessPlan(enchants, false);
  if (plan.feasible) return plan.total;
  return optimalBookMergeFallback(enchants).total;
}

export function estimateNaiveLevelsForItem(enchants) {
  let itemUses = 0;
  let itemEnchants = {};
  let total = 0;

  for (const label of enchants) {
    const { name, level } = parseEnchantLabelToNameLevel(label);
    const bookEnchants = { [name]: level };
    const res = anvilApplyJava(itemEnchants, itemUses, bookEnchants, 0);
    total += res.opCost;
    itemEnchants = res.newTargetEnchants;
    itemUses = res.newTargetUses;
  }

  return total;
}
