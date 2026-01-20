/**
 * BaZi Library - Main exports
 */

// Types
export type {
  Element,
  Gan,
  Zhi,
  TenDeity,
  PositionalStatus,
  Gender,
  HiddenStem,
  Pillar,
  FourPillars,
  Relationships,
  PillarTenDeity,
  TenDeitiesMap,
  ElementScores,
  DaYunCycle,
  LiuNian,
  StrengthAssessment,
  BirthInfo,
  BaZiResult,
} from "./types";

// Core constants
export {
  GAN,
  ZHI,
  GAN_ELEMENT,
  ZHI_ELEMENT,
  HIDDEN_STEMS,
  ZODIAC,
  ELEMENT_RELATIONS,
  ZHI_TIME,
  getGanIndex,
  getZhiIndex,
  getGanByIndex,
  getZhiByIndex,
  getHiddenStems,
  getHourBranch,
} from "./ganzhi";

// Data
export {
  NAYIN,
  ZHI_CHONG,
  ZHI_LIUHE,
  ZHI_SANHE,
  ZHI_SANHUI,
  ZHI_XING,
  ZHI_HAI,
  ZHI_PO,
  GAN_HE,
  GAN_CHONG,
  ZHI_ATTRS,
  getNayin,
  detectRelationships,
} from "./data";

// Ten Deities
export {
  getTenDeity,
  getPositionalStatus,
  getHiddenStemDeities,
  isSupportingDeity,
  getDeityCategory,
  DAY_MASTER_META,
  TEN_DEITY_DESC,
} from "./tenDeities";

// Elements
export {
  calculateElementScores,
  getFavorableElements,
  getElementColor,
  getElementBgColor,
} from "./elements";

// Strength
export {
  calculateStrength,
  getStrengthAnalysis,
  countDeities,
} from "./strength";

// Calculator (main entry point)
export {
  calculateBaZi,
  calculateAge,
  getCurrentDayunIndex,
} from "./calculator";
