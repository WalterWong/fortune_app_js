/**
 * BaZi Type Definitions
 */

// Five Elements
export type Element = "金" | "木" | "水" | "火" | "土";

// Heavenly Stems
export type Gan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

// Earthly Branches
export type Zhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

// Ten Deities
export type TenDeity = "比" | "劫" | "食" | "伤" | "才" | "财" | "杀" | "官" | "枭" | "印";

// Positional Status (12 stages of life)
export type PositionalStatus = "长" | "沐" | "冠" | "建" | "帝" | "衰" | "病" | "死" | "墓" | "绝" | "胎" | "养";

// Gender
export type Gender = "男" | "女";

// Hidden stem with weight
export interface HiddenStem {
  stem: Gan;
  weight: number;
}

// Single Pillar
export interface Pillar {
  gan: Gan;
  zhi: Zhi;
  ganzhi: string;
  nayin: string;
  ganElement: Element;
  zhiElement: Element;
  hiddenStems: HiddenStem[];
}

// Four Pillars
export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

// Branch Relationships
export interface Relationships {
  he: string[];      // 合 (Combinations)
  chong: string[];   // 冲 (Clashes)
  xing: string[];    // 刑 (Punishments)
  hai: string[];     // 害 (Harms)
  po: string[];      // 破 (Breaks)
}

// Ten Deities for a pillar
export interface PillarTenDeity {
  stem: TenDeity;
  hiddenStems: { stem: Gan; deity: TenDeity }[];
}

// Ten Deities Map
export interface TenDeitiesMap {
  year: PillarTenDeity;
  month: PillarTenDeity;
  day: PillarTenDeity;
  hour: PillarTenDeity;
}

// Element Scores
export interface ElementScores {
  scores: Record<Element, number>;
  ganScores: Record<Element, number>;
  strongest: Element;
  weakest: Element;
  total: number;
}

// DaYun (10-year luck cycle)
export interface DaYunCycle {
  cycle: number;
  ageRange: string;
  pillar: string;
  gan: Gan;
  zhi: Zhi;
  element: Element;
}

// LiuNian (Yearly fortune)
export interface LiuNian {
  year: number;
  ganzhi: string;
  gan: Gan;
  zhi: Zhi;
}

// Day Master Strength Assessment
export interface StrengthAssessment {
  isWeak: boolean;
  assessment: "强" | "弱";
  supportCount: number;
  supportScore: number;
}

// Birth Info
export interface BirthInfo {
  solarDate: string;
  lunarDate: string;
  lunarMonth: string;
  lunarDay: string;
  gender: Gender;
}

// Complete BaZi Result
export interface BaZiResult {
  pillars: FourPillars;
  dayMaster: Gan;
  dayMasterElement: Element;
  relationships: Relationships;
  tenDeities: TenDeitiesMap;
  elementScores: ElementScores;
  dayun: DaYunCycle[];
  liunian: LiuNian[];
  strength: StrengthAssessment;
  favorableElements: Element[];
  unfavorableElements: Element[];
  classicalTexts?: {
    sizi: string;
    monthly: string;
  };
  birthInfo: BirthInfo;
  zodiac: string;
}
