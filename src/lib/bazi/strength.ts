/**
 * Day Master Strength Assessment
 */

import type { Gan, Zhi, FourPillars, StrengthAssessment, TenDeity } from "./types";
import { GAN_ELEMENT, HIDDEN_STEMS } from "./ganzhi";
import { getTenDeity, getPositionalStatus, isSupportingDeity, getHiddenStemDeities } from "./tenDeities";

// Positional statuses that indicate strength
const STRONG_POSITIONS = ["建", "帝", "冠", "长"];
const MODERATE_POSITIONS = ["沐", "养", "胎"];
const WEAK_POSITIONS = ["衰", "病", "死", "墓", "绝"];

/**
 * Calculate day master strength
 */
export function calculateStrength(pillars: FourPillars): StrengthAssessment {
  const dayMaster = pillars.day.gan;
  const dayMasterElement = GAN_ELEMENT[dayMaster];

  let supportCount = 0;
  let supportScore = 0;

  // Check positional status in month branch (most important)
  const monthStatus = getPositionalStatus(dayMaster, pillars.month.zhi);
  const statusScore = getStatusScore(monthStatus);
  supportScore += statusScore * 2; // Month weighted x2

  // Check all stems (year, month, hour - not day itself)
  const stemsToCheck: Gan[] = [pillars.year.gan, pillars.month.gan, pillars.hour.gan];
  for (const stem of stemsToCheck) {
    const deity = getTenDeity(dayMaster, stem);
    if (isSupportingDeity(deity)) {
      supportCount++;
      supportScore += 5;
    }
  }

  // Check hidden stems in all branches
  const branchesToCheck: Zhi[] = [
    pillars.year.zhi,
    pillars.month.zhi,
    pillars.day.zhi,
    pillars.hour.zhi,
  ];

  for (let i = 0; i < branchesToCheck.length; i++) {
    const branch = branchesToCheck[i];
    const hiddenDeities = getHiddenStemDeities(dayMaster, branch);
    const isMonth = i === 1;

    for (const { deity, weight } of hiddenDeities) {
      if (isSupportingDeity(deity)) {
        const multiplier = isMonth ? 2 : 1;
        supportScore += weight * multiplier;
      }
    }
  }

  // Determine if weak based on support score
  // Threshold is roughly 30 (adjustable based on traditional methods)
  const isWeak = supportScore < 30;

  return {
    isWeak,
    assessment: isWeak ? "弱" : "强",
    supportCount,
    supportScore,
  };
}

/**
 * Get score for positional status
 */
function getStatusScore(status: string): number {
  if (STRONG_POSITIONS.includes(status)) return 10;
  if (MODERATE_POSITIONS.includes(status)) return 5;
  if (WEAK_POSITIONS.includes(status)) return 0;
  return 3;
}

/**
 * Get detailed strength analysis text
 */
export function getStrengthAnalysis(
  pillars: FourPillars,
  strength: StrengthAssessment
): string {
  const dayMaster = pillars.day.gan;
  const dayMasterElement = GAN_ELEMENT[dayMaster];
  const monthStatus = getPositionalStatus(dayMaster, pillars.month.zhi);

  const lines: string[] = [];

  lines.push(`日主 ${dayMaster}${dayMasterElement}，`);
  lines.push(`月令 ${pillars.month.zhi} 处 ${monthStatus} 位。`);

  if (strength.isWeak) {
    lines.push(`日主偏弱，需生扶（印星、比劫）。`);
  } else {
    lines.push(`日主偏强，需泄耗（食伤、财星、官杀）。`);
  }

  lines.push(`支持度：${strength.supportScore.toFixed(1)} 分`);

  return lines.join("");
}

/**
 * Count occurrences of each ten deity in the chart
 */
export function countDeities(pillars: FourPillars): Record<TenDeity, number> {
  const dayMaster = pillars.day.gan;
  const counts: Record<TenDeity, number> = {
    比: 0, 劫: 0, 食: 0, 伤: 0, 才: 0,
    财: 0, 杀: 0, 官: 0, 枭: 0, 印: 0,
  };

  // Count stem deities
  const stemsToCheck: Gan[] = [pillars.year.gan, pillars.month.gan, pillars.hour.gan];
  for (const stem of stemsToCheck) {
    const deity = getTenDeity(dayMaster, stem);
    counts[deity]++;
  }

  // Count hidden stem deities
  const branches: Zhi[] = [
    pillars.year.zhi,
    pillars.month.zhi,
    pillars.day.zhi,
    pillars.hour.zhi,
  ];

  for (const branch of branches) {
    const hiddenDeities = getHiddenStemDeities(dayMaster, branch);
    for (const { deity } of hiddenDeities) {
      counts[deity] += 0.5; // Hidden stems count less
    }
  }

  return counts;
}
