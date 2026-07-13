/**
 * Returns the total XP points required to reach a Minecraft level
 * starting from level 0.
 */
export function xpToReachLevel(level) {
  const safeLevel = Math.max(0, Math.floor(level));

  if (safeLevel <= 16) {
    return (safeLevel * safeLevel) + (6 * safeLevel);
  }

  if (safeLevel <= 31) {
    return Math.floor(
      (2.5 * safeLevel * safeLevel) -
      (40.5 * safeLevel) +
      360
    );
  }

  return Math.floor(
    (4.5 * safeLevel * safeLevel) -
    (162.5 * safeLevel) +
    2220
  );
}

/**
 * Calculates the XP points needed for a complete anvil plan.
 *
 * Each operation is treated separately because Minecraft level costs
 * are nonlinear.
 */
export function xpForOperations(operationCosts) {
  if (!Array.isArray(operationCosts)) return 0;

  return operationCosts.reduce((total, levelCost) => {
    return total + xpToReachLevel(levelCost);
  }, 0);
}

/**
 * Adds commas to large XP values.
 */
export function formatXp(value) {
  return Math.max(0, Math.floor(value)).toLocaleString();
}