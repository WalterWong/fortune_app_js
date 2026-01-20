/**
 * Ten Deities (十神) Calculation
 */

import type { Gan, Zhi, TenDeity, PositionalStatus, Element } from "./types";
import { GAN_ELEMENT, HIDDEN_STEMS } from "./ganzhi";

// Ten Deities mapping for each day master
// Key: day master, Value: mapping of other stems to ten deities
const TEN_DEITIES_MAP: Record<Gan, Record<Gan, TenDeity>> = {
  甲: { 甲: "比", 乙: "劫", 丙: "食", 丁: "伤", 戊: "才", 己: "财", 庚: "杀", 辛: "官", 壬: "枭", 癸: "印" },
  乙: { 甲: "劫", 乙: "比", 丙: "伤", 丁: "食", 戊: "财", 己: "才", 庚: "官", 辛: "杀", 壬: "印", 癸: "枭" },
  丙: { 丙: "比", 丁: "劫", 戊: "食", 己: "伤", 庚: "才", 辛: "财", 壬: "杀", 癸: "官", 甲: "枭", 乙: "印" },
  丁: { 丙: "劫", 丁: "比", 戊: "伤", 己: "食", 庚: "财", 辛: "才", 壬: "官", 癸: "杀", 甲: "印", 乙: "枭" },
  戊: { 戊: "比", 己: "劫", 庚: "食", 辛: "伤", 壬: "才", 癸: "财", 甲: "杀", 乙: "官", 丙: "枭", 丁: "印" },
  己: { 戊: "劫", 己: "比", 庚: "伤", 辛: "食", 壬: "财", 癸: "才", 甲: "官", 乙: "杀", 丙: "印", 丁: "枭" },
  庚: { 庚: "比", 辛: "劫", 壬: "食", 癸: "伤", 甲: "才", 乙: "财", 丙: "杀", 丁: "官", 戊: "枭", 己: "印" },
  辛: { 庚: "劫", 辛: "比", 壬: "伤", 癸: "食", 甲: "财", 乙: "才", 丙: "官", 丁: "杀", 戊: "印", 己: "枭" },
  壬: { 壬: "比", 癸: "劫", 甲: "食", 乙: "伤", 丙: "才", 丁: "财", 戊: "杀", 己: "官", 庚: "枭", 辛: "印" },
  癸: { 壬: "劫", 癸: "比", 甲: "伤", 乙: "食", 丙: "财", 丁: "才", 戊: "官", 己: "杀", 庚: "印", 辛: "枭" },
};

// Positional Status (十二长生) for each day master
const POSITIONAL_STATUS_MAP: Record<Gan, Record<Zhi, PositionalStatus>> = {
  甲: { 子: "沐", 丑: "冠", 寅: "建", 卯: "帝", 辰: "衰", 巳: "病", 午: "死", 未: "墓", 申: "绝", 酉: "胎", 戌: "养", 亥: "长" },
  乙: { 子: "病", 丑: "衰", 寅: "帝", 卯: "建", 辰: "冠", 巳: "沐", 午: "长", 未: "养", 申: "胎", 酉: "绝", 戌: "墓", 亥: "死" },
  丙: { 子: "胎", 丑: "养", 寅: "长", 卯: "沐", 辰: "冠", 巳: "建", 午: "帝", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "绝" },
  丁: { 子: "绝", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝", 午: "建", 未: "冠", 申: "沐", 酉: "长", 戌: "养", 亥: "胎" },
  戊: { 子: "胎", 丑: "养", 寅: "长", 卯: "沐", 辰: "冠", 巳: "建", 午: "帝", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "绝" },
  己: { 子: "绝", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝", 午: "建", 未: "冠", 申: "沐", 酉: "长", 戌: "养", 亥: "胎" },
  庚: { 子: "死", 丑: "墓", 寅: "绝", 卯: "胎", 辰: "养", 巳: "长", 午: "沐", 未: "冠", 申: "建", 酉: "帝", 戌: "衰", 亥: "病" },
  辛: { 子: "长", 丑: "养", 寅: "胎", 卯: "绝", 辰: "墓", 巳: "死", 午: "病", 未: "衰", 申: "帝", 酉: "建", 戌: "冠", 亥: "沐" },
  壬: { 子: "帝", 丑: "衰", 寅: "病", 卯: "死", 辰: "墓", 巳: "绝", 午: "胎", 未: "养", 申: "长", 酉: "沐", 戌: "冠", 亥: "建" },
  癸: { 子: "建", 丑: "冠", 寅: "沐", 卯: "长", 辰: "养", 巳: "胎", 午: "绝", 未: "墓", 申: "死", 酉: "病", 戌: "衰", 亥: "帝" },
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
 * Check if a ten deity supports the day master (比/劫/印/枭)
 */
export function isSupportingDeity(deity: TenDeity): boolean {
  return ["比", "劫", "印", "枭"].includes(deity);
}

/**
 * Get deity category
 * - 比劫: Self/siblings
 * - 食伤: Output/talent
 * - 财才: Wealth
 * - 官杀: Power/authority
 * - 印枭: Resource/support
 */
export function getDeityCategory(deity: TenDeity): string {
  switch (deity) {
    case "比":
    case "劫":
      return "比劫";
    case "食":
    case "伤":
      return "食伤";
    case "才":
    case "财":
      return "财星";
    case "官":
    case "杀":
      return "官杀";
    case "印":
    case "枭":
      return "印星";
  }
}

// Ten deity descriptions
export const TEN_DEITY_DESC: Record<TenDeity, { name: string; meaning: string }> = {
  比: { name: "比肩", meaning: "同类相助，兄弟姐妹，朋友同事" },
  劫: { name: "劫财", meaning: "竞争对手，争夺财物，损财之象" },
  食: { name: "食神", meaning: "才华表现，口福口才，性格温和" },
  伤: { name: "伤官", meaning: "聪明叛逆，艺术才华，克制官星" },
  才: { name: "偏财", meaning: "意外之财，投机收入，父亲之象" },
  财: { name: "正财", meaning: "正当收入，稳定财源，妻子之象" },
  杀: { name: "七杀", meaning: "权威压力，竞争对手，小人之象" },
  官: { name: "正官", meaning: "正当权力，上司领导，丈夫之象" },
  枭: { name: "偏印", meaning: "偏门学问，特殊技能，继母之象" },
  印: { name: "正印", meaning: "学问知识，贵人相助，母亲之象" },
};
