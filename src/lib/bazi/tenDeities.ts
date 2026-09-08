/**
 * Ten Deities (十神) Calculation
 */

import type { Gan, Zhi, TenDeity, PositionalStatus, Element } from "./types";
import { GAN_ELEMENT, HIDDEN_STEMS } from "./ganzhi";

// Ten Deities mapping for each day master
// Key: day master, Value: mapping of other stems to ten deities
const TEN_DEITIES_MAP: Record<Gan, Record<Gan, TenDeity>> = {
  甲: { 甲: "比", 乙: "劫", 丙: "食", 丁: "傷", 戊: "才", 己: "財", 庚: "杀", 辛: "官", 壬: "梟", 癸: "印" },
  乙: { 甲: "劫", 乙: "比", 丙: "傷", 丁: "食", 戊: "財", 己: "才", 庚: "官", 辛: "杀", 壬: "印", 癸: "梟" },
  丙: { 丙: "比", 丁: "劫", 戊: "食", 己: "傷", 庚: "才", 辛: "財", 壬: "杀", 癸: "官", 甲: "梟", 乙: "印" },
  丁: { 丙: "劫", 丁: "比", 戊: "傷", 己: "食", 庚: "財", 辛: "才", 壬: "官", 癸: "杀", 甲: "印", 乙: "梟" },
  戊: { 戊: "比", 己: "劫", 庚: "食", 辛: "傷", 壬: "才", 癸: "財", 甲: "杀", 乙: "官", 丙: "梟", 丁: "印" },
  己: { 戊: "劫", 己: "比", 庚: "傷", 辛: "食", 壬: "財", 癸: "才", 甲: "官", 乙: "杀", 丙: "印", 丁: "梟" },
  庚: { 庚: "比", 辛: "劫", 壬: "食", 癸: "傷", 甲: "才", 乙: "財", 丙: "杀", 丁: "官", 戊: "梟", 己: "印" },
  辛: { 庚: "劫", 辛: "比", 壬: "傷", 癸: "食", 甲: "財", 乙: "才", 丙: "官", 丁: "杀", 戊: "印", 己: "梟" },
  壬: { 壬: "比", 癸: "劫", 甲: "食", 乙: "傷", 丙: "才", 丁: "財", 戊: "杀", 己: "官", 庚: "梟", 辛: "印" },
  癸: { 壬: "劫", 癸: "比", 甲: "傷", 乙: "食", 丙: "財", 丁: "才", 戊: "官", 己: "杀", 庚: "印", 辛: "梟" },
};

// Positional Status (十二長生) for each day master
const POSITIONAL_STATUS_MAP: Record<Gan, Record<Zhi, PositionalStatus>> = {
  甲: { 子: "沐", 丑: "冠", 寅: "建", 卯: "帝", 辰: "衰", 巳: "病", 午: "死", 未: "墓", 申: "絕", 酉: "胎", 戌: "養", 亥: "長" },
  乙: { 子: "病", 丑: "衰", 寅: "帝", 卯: "建", 辰: "冠", 巳: "沐", 午: "長", 未: "養", 申: "胎", 酉: "絕", 戌: "墓", 亥: "死" },
  丙: { 子: "胎", 丑: "養", 寅: "長", 卯: "沐", 辰: "冠", 巳: "建", 午: "帝", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "絕" },
  丁: { 子: "絕", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝", 午: "建", 未: "冠", 申: "沐", 酉: "長", 戌: "養", 亥: "胎" },
  戊: { 子: "胎", 丑: "養", 寅: "長", 卯: "沐", 辰: "冠", 巳: "建", 午: "帝", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "絕" },
  己: { 子: "絕", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝", 午: "建", 未: "冠", 申: "沐", 酉: "長", 戌: "養", 亥: "胎" },
  庚: { 子: "死", 丑: "墓", 寅: "絕", 卯: "胎", 辰: "養", 巳: "長", 午: "沐", 未: "冠", 申: "建", 酉: "帝", 戌: "衰", 亥: "病" },
  辛: { 子: "長", 丑: "養", 寅: "胎", 卯: "絕", 辰: "墓", 巳: "死", 午: "病", 未: "衰", 申: "帝", 酉: "建", 戌: "冠", 亥: "沐" },
  壬: { 子: "帝", 丑: "衰", 寅: "病", 卯: "死", 辰: "墓", 巳: "絕", 午: "胎", 未: "養", 申: "長", 酉: "沐", 戌: "冠", 亥: "建" },
  癸: { 子: "建", 丑: "冠", 寅: "沐", 卯: "長", 辰: "養", 巳: "胎", 午: "絕", 未: "墓", 申: "死", 酉: "病", 戌: "衰", 亥: "帝" },
};

// Day master metadata
export const DAY_MASTER_META: Record<Gan, {
  element: Element;
  overcomes: Element;
  overcomeBy: Element;
  generates: Element;
  generatedBy: Element;
  combines: Gan;
}> = {
  甲: { element: "木", overcomes: "土", overcomeBy: "金", generates: "火", generatedBy: "水", combines: "己" },
  乙: { element: "木", overcomes: "土", overcomeBy: "金", generates: "火", generatedBy: "水", combines: "庚" },
  丙: { element: "火", overcomes: "金", overcomeBy: "水", generates: "土", generatedBy: "木", combines: "辛" },
  丁: { element: "火", overcomes: "金", overcomeBy: "水", generates: "土", generatedBy: "木", combines: "壬" },
  戊: { element: "土", overcomes: "水", overcomeBy: "木", generates: "金", generatedBy: "火", combines: "癸" },
  己: { element: "土", overcomes: "水", overcomeBy: "木", generates: "金", generatedBy: "火", combines: "甲" },
  庚: { element: "金", overcomes: "木", overcomeBy: "火", generates: "水", generatedBy: "土", combines: "乙" },
  辛: { element: "金", overcomes: "木", overcomeBy: "火", generates: "水", generatedBy: "土", combines: "丙" },
  壬: { element: "水", overcomes: "火", overcomeBy: "土", generates: "木", generatedBy: "金", combines: "丁" },
  癸: { element: "水", overcomes: "火", overcomeBy: "土", generates: "木", generatedBy: "金", combines: "戊" },
};

/**
 * Get ten deity for a given day master and target stem
 */
export function getTenDeity(dayMaster: Gan, targetStem: Gan): TenDeity {
  return TEN_DEITIES_MAP[dayMaster][targetStem];
}

/**
 * Get positional status for a given day master and branch
 */
export function getPositionalStatus(dayMaster: Gan, branch: Zhi): PositionalStatus {
  return POSITIONAL_STATUS_MAP[dayMaster][branch];
}

/**
 * Get ten deities for hidden stems in a branch
 */
export function getHiddenStemDeities(dayMaster: Gan, branch: Zhi): { stem: Gan; deity: TenDeity; weight: number }[] {
  const hiddenStems = HIDDEN_STEMS[branch];
  return hiddenStems.map(h => ({
    stem: h.stem,
    deity: getTenDeity(dayMaster, h.stem),
    weight: h.weight,
  }));
}

/**
 * Check if a ten deity supports the day master (比/劫/印/梟)
 */
export function isSupportingDeity(deity: TenDeity): boolean {
  return ["比", "劫", "印", "梟"].includes(deity);
}

/**
 * Get deity category
 * - 比劫: Self/siblings
 * - 食傷: Output/talent
 * - 財才: Wealth
 * - 官杀: Power/authority
 * - 印梟: Resource/support
 */
export function getDeityCategory(deity: TenDeity): string {
  switch (deity) {
    case "比":
    case "劫":
      return "比劫";
    case "食":
    case "傷":
      return "食傷";
    case "才":
    case "財":
      return "財星";
    case "官":
    case "杀":
      return "官杀";
    case "印":
    case "梟":
      return "印星";
  }
}

// Ten deity descriptions
export const TEN_DEITY_DESC: Record<TenDeity, { name: string; meaning: string }> = {
  比: { name: "比肩", meaning: "同類相助，兄弟姐妹，朋友同事" },
  劫: { name: "劫財", meaning: "競爭對手，爭奪財物，損財之象" },
  食: { name: "食神", meaning: "才華表現，口福口才，性格溫和" },
  傷: { name: "傷官", meaning: "聰明叛逆，藝術才華，剋制官星" },
  才: { name: "偏財", meaning: "意外之財，投機收入，父親之象" },
  財: { name: "正財", meaning: "正當收入，穩定財源，妻子之象" },
  杀: { name: "七殺", meaning: "權威壓力，競爭對手，小人之象" },
  官: { name: "正官", meaning: "正當權力，上司領導，丈夫之象" },
  梟: { name: "偏印", meaning: "偏門學問，特殊技能，繼母之象" },
  印: { name: "正印", meaning: "學問知識，貴人相助，母親之象" },
};
