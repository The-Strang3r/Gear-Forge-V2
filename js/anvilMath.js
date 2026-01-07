export const ROMAN = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10 };
export const INV_ROMAN = {1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII",9:"IX",10:"X"};

export function parseEnchantLabelToNameLevel(label) {
  const parts = label.trim().split(" ");
  const last = parts[parts.length - 1];
  if (ROMAN[last]) return { name: parts.slice(0, -1).join(" "), level: ROMAN[last] };
  return { name: label.trim(), level: 1 };
}

export function priorPenalty(uses) { return (1 << uses) - 1; }

// Java anvil book multipliers
export const BOOK_MULT = {
  "Protection": 1,
  "Fire Protection": 1,
  "Blast Protection": 2,
  "Projectile Protection": 1,

  "Unbreaking": 1,
  "Mending": 2,
  "Respiration": 2,
  "Aqua Affinity": 2,
  "Thorns": 4,
  "Swift Sneak": 4,
  "Feather Falling": 1,
  "Depth Strider": 2,
  "Frost Walker": 2,
  "Soul Speed": 4,

  "Sharpness": 1,
  "Smite": 1,
  "Bane of Arthropods": 1,
  "Knockback": 1,
  "Fire Aspect": 2,
  "Looting": 2,
  "Sweeping Edge": 2,

  "Efficiency": 1,
  "Fortune": 2,
  "Silk Touch": 4,

  "Impaling": 1,
  "Loyalty": 1,
  "Riptide": 2,
  "Channeling": 4,

  "Density": 1,
  "Breach": 2,
  "Wind Burst": 2,

  "Power": 1,
  "Punch": 4,
  "Flame": 2,
  "Infinity": 8,
};

export const MAX_LEVEL = {
  "Protection": 4,
  "Fire Protection": 4,
  "Blast Protection": 4,
  "Projectile Protection": 4,

  "Unbreaking": 3,
  "Mending": 1,
  "Respiration": 3,
  "Aqua Affinity": 1,
  "Thorns": 3,
  "Swift Sneak": 3,
  "Feather Falling": 4,
  "Depth Strider": 3,
  "Frost Walker": 2,
  "Soul Speed": 3,

  "Sharpness": 5,
  "Smite": 5,
  "Bane of Arthropods": 5,
  "Knockback": 2,
  "Fire Aspect": 2,
  "Looting": 3,
  "Sweeping Edge": 3,

  "Efficiency": 5,
  "Fortune": 3,
  "Silk Touch": 1,

  "Impaling": 5,
  "Loyalty": 3,
  "Riptide": 3,
  "Channeling": 1,

  "Density": 5,
  "Breach": 4,
  "Wind Burst": 3,

  "Power": 5,
  "Punch": 2,
  "Flame": 1,
  "Infinity": 1,
};

const INCOMP_GROUPS = [
  new Set(["Sharpness", "Smite", "Bane of Arthropods"]),
  new Set(["Fortune", "Silk Touch"]),
  new Set(["Depth Strider", "Frost Walker"]),
  new Set(["Protection", "Fire Protection", "Blast Protection", "Projectile Protection"]),
  new Set(["Density", "Breach", "Smite", "Bane of Arthropods"]),
  new Set(["Infinity", "Mending"]),
];

function isIncompatible(existingMap, candidateName) {
  // Trident special rule:
  // Riptide conflicts with Loyalty and Channeling, but Loyalty + Channeling is allowed.
  if (candidateName === "Riptide") {
    return ("Loyalty" in existingMap) || ("Channeling" in existingMap);
  }
  if (candidateName === "Loyalty" || candidateName === "Channeling") {
    return ("Riptide" in existingMap);
  }

  for (const group of INCOMP_GROUPS) {
    if (!group.has(candidateName)) continue;
    for (const ex of Object.keys(existingMap)) {
      if (group.has(ex) && ex !== candidateName) return true;
    }
  }
  return false;
}

function mergedLevel(targetLevel, sacrificeLevel, maxLevel) {
  if (targetLevel === sacrificeLevel && targetLevel < maxLevel) return targetLevel + 1;
  return Math.max(targetLevel, sacrificeLevel);
}

export function applyEnchantmentsJava(targetEnchants, sacrificeEnchants) {
  const result = { ...targetEnchants };
  let enchantCost = 0;

  for (const [name, sLevel] of Object.entries(sacrificeEnchants)) {
    const mult = BOOK_MULT[name];
    if (!mult) continue;

    if (isIncompatible(result, name)) {
      enchantCost += 1;
      continue;
    }

    const maxL = MAX_LEVEL[name] ?? 1;
    const tLevel = result[name] ?? 0;
    const finalL = mergedLevel(tLevel, sLevel, maxL);

    enchantCost += finalL * mult;
    result[name] = Math.max(finalL, tLevel);
  }

  return { resultEnchants: result, enchantCost };
}

export function anvilApplyJava(targetEnchants, targetUses, sacrificeEnchants, sacrificeUses) {
  const { resultEnchants, enchantCost } = applyEnchantmentsJava(targetEnchants, sacrificeEnchants);
  const opPenalty = priorPenalty(targetUses) + priorPenalty(sacrificeUses);
  const opCost = enchantCost + opPenalty;

  return {
    opCost,
    newTargetEnchants: resultEnchants,
    newTargetUses: Math.max(targetUses, sacrificeUses) + 1,
  };
}
