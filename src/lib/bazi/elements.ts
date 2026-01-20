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
 * Get element color for display (text color)
 */
export function getElementColor(element: Element): string {
  const colors: Record<Element, string> = {
    金: "#B8860B", // Dark Goldenrod (darker for contrast)
    木: "#166534", // Green-800
    水: "#1D4ED8", // Blue-700
    火: "#B91C1C", // Red-700
    土: "#92400E", // Amber-800
  };
  return colors[element];
}

/**
 * Get element background color (with better contrast)
 */
export function getElementBgColor(element: Element): string {
  const colors: Record<Element, string> = {
    金: "#FCD34D", // Amber-300 (golden yellow)
    木: "#86EFAC", // Green-300
    水: "#93C5FD", // Blue-300
    火: "#FCA5A5", // Red-300
    土: "#FDBA74", // Orange-300
  };
  return colors[element];
}

/**
 * Get element text color for use on element background
 */
export function getElementTextColor(element: Element): string {
  const colors: Record<Element, string> = {
    金: "#78350F", // Amber-900
    木: "#14532D", // Green-900
    水: "#1E3A8A", // Blue-900
    火: "#7F1D1D", // Red-900
    土: "#7C2D12", // Orange-900
  };
  return colors[element];
}
