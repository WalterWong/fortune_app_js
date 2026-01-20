/**
 * Five Elements Scoring
 */

import type { Element, Gan, Zhi, ElementScores, FourPillars } from "./types";
import { GAN_ELEMENT, HIDDEN_STEMS } from "./ganzhi";

// Base score for heavenly stems
const GAN_BASE_SCORE = 5;

/**
 * Calculate element scores from the four pillars
 * - Heavenly stems: 5 points each
 * - Hidden stems: weighted by position (主氣 > 中氣 > 餘氣)
 * - Month branch is counted twice (more influential)
 */
export function calculateElementScores(pillars: FourPillars): ElementScores {
  const scores: Record<Element, number> = {
    金: 0, 木: 0, 水: 0, 火: 0, 土: 0,
  };
  const ganScores: Record<Element, number> = {
    金: 0, 木: 0, 水: 0, 火: 0, 土: 0,
  };

  // Process each pillar
  const pillarKeys = ["year", "month", "day", "hour"] as const;

  for (const key of pillarKeys) {
    const pillar = pillars[key];
    const isMonth = key === "month";

    // Heavenly stem score
    const ganElement = GAN_ELEMENT[pillar.gan];
    scores[ganElement] += GAN_BASE_SCORE;
    ganScores[ganElement] += GAN_BASE_SCORE;

    // Hidden stems score
    const hiddenStems = HIDDEN_STEMS[pillar.zhi];
    for (const { stem, weight } of hiddenStems) {
      const element = GAN_ELEMENT[stem];
      // Month branch counted twice
      const multiplier = isMonth ? 2 : 1;
      scores[element] += weight * multiplier;
    }
  }

  // Calculate total
  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);

  // Find strongest and weakest
  const sortedElements = (Object.entries(scores) as [Element, number][])
    .sort((a, b) => b[1] - a[1]);

  return {
    scores,
    ganScores,
    strongest: sortedElements[0][0],
    weakest: sortedElements[sortedElements.length - 1][0],
    total,
  };
}

/**
 * Get favorable elements based on day master strength
 * - If weak: need elements that support (生我, 同类)
 * - If strong: need elements that drain (我生, 我克)
 */
export function getFavorableElements(
  dayMasterElement: Element,
  isWeak: boolean
): { favorable: Element[]; unfavorable: Element[] } {
  const relations = {
    金: { generates: "水", generatedBy: "土", overcomes: "木", overcomeBy: "火" },
    木: { generates: "火", generatedBy: "水", overcomes: "土", overcomeBy: "金" },
    水: { generates: "木", generatedBy: "金", overcomes: "火", overcomeBy: "土" },
    火: { generates: "土", generatedBy: "木", overcomes: "金", overcomeBy: "水" },
    土: { generates: "金", generatedBy: "火", overcomes: "水", overcomeBy: "木" },
  };

  const rel = relations[dayMasterElement];

  if (isWeak) {
    // Weak day master needs support
    return {
      favorable: [dayMasterElement, rel.generatedBy as Element], // 同类 + 生我
      unfavorable: [rel.generates as Element, rel.overcomes as Element, rel.overcomeBy as Element],
    };
  } else {
    // Strong day master needs to be drained
    return {
      favorable: [rel.generates as Element, rel.overcomes as Element, rel.overcomeBy as Element],
      unfavorable: [dayMasterElement, rel.generatedBy as Element],
    };
  }
}

/**
 * Get element color for display
 */
export function getElementColor(element: Element): string {
  const colors: Record<Element, string> = {
    金: "#FFD700", // Gold
    木: "#228B22", // Forest Green
    水: "#1E90FF", // Dodger Blue
    火: "#FF4500", // Orange Red
    土: "#DEB887", // Burlywood
  };
  return colors[element];
}

/**
 * Get element background color (lighter version)
 */
export function getElementBgColor(element: Element): string {
  const colors: Record<Element, string> = {
    金: "#FFFACD", // Lemon Chiffon
    木: "#90EE90", // Light Green
    水: "#ADD8E6", // Light Blue
    火: "#FFB6C1", // Light Pink
    土: "#F5DEB3", // Wheat
  };
  return colors[element];
}
