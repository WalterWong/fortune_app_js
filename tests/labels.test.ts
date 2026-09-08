import { describe, it, expect } from "vitest";
import { TEN_DEITY_DESC } from "../src/lib/bazi/tenDeities";
import { HIDDEN_STEMS } from "../src/lib/bazi/ganzhi";
import { NAYIN } from "../src/lib/bazi/data";

/**
 * Script-integrity pins for the user-facing label tables.
 *
 * WHY THIS EXISTS: on 2026-09-08 a Simplified→Traditional sweep converted only the
 * characters on a hand-written list and left 94 others behind, producing mixed-script
 * strings ("競爭對手" beside "损財之象") that went straight into the prompt — which is
 * this app's entire product. The whole suite stayed green, because nothing pinned a
 * single label. These tests are that missing pin.
 *
 * The rule is NOT "convert everything to Traditional". A blanket converter destroys the
 * domain: 丑 (地支) becomes 醜 "ugly", 干 (天干) becomes 幹, 斗 (斗數) becomes 鬥, and 冲
 * becomes 衝 where the canon wants 沖. The authority is 麥燕芬師傅's canon in
 * ../../bazi/, not a conversion library.
 */

/** BaZi domain characters that are correct as-is and must never be "corrected". */
const DOMAIN_KEEP = new Set(["丑", "干", "斗", "凶", "杀"]);

/** Simplified forms the canon decisively rejects (Traditional:Simplified counts in ../../bazi/). */
const BANNED: Record<string, string> = {
  "枭": "梟", "强": "強", "冲": "沖", "会": "會", "克": "剋", "无": "無",
  "对": "對", "类": "類", "应": "應", "争": "爭", "竞": "競", "华": "華",
  "亲": "親", "当": "當", "权": "權", "学": "學", "问": "問", "纳": "納",
  "处": "處", "夺": "奪", "损": "損", "现": "現", "聪": "聰", "艺": "藝",
  "术": "術", "机": "機", "稳": "穩", "压": "壓", "领": "領", "导": "導",
  "门": "門", "继": "繼", "识": "識", "炉": "爐", "蜡": "蠟", "雳": "靂",
  "灯": "燈", "驿": "驛", "伤": "傷", "财": "財", "长": "長", "绝": "絕",
  "养": "養", "贵": "貴", "龙": "龍", "马": "馬", "鸡": "雞", "猪": "豬",
};

function offenders(s: string): string[] {
  return [...s].filter((c) => c in BANNED && !DOMAIN_KEEP.has(c));
}

describe("十神 label table is uniformly zh-Hant", () => {
  for (const [key, { name, meaning }] of Object.entries(TEN_DEITY_DESC)) {
    it(`${key} — name and meaning carry no rejected Simplified forms`, () => {
      expect(offenders(name), `name "${name}"`).toEqual([]);
      expect(offenders(meaning), `meaning "${meaning}"`).toEqual([]);
    });
  }

  it("keeps 杀 as the short mark but writes the full name 七殺", () => {
    // Her guide states the pairing literally: 七殺 → 杀. Canon counts in ../../bazi/:
    // 杀 525 vs 殺 166 for the mark, but 七殺 56 vs 七杀 2 for the full name.
    expect(TEN_DEITY_DESC).toHaveProperty("杀");
    expect(TEN_DEITY_DESC["杀"].name).toBe("七殺");
    expect(TEN_DEITY_DESC["杀"].name).not.toBe("七杀");
  });

  it("uses 梟 for 偏印, not the Simplified 枭", () => {
    // The 杀 exception does NOT extend here: the backend canon has no 枭 at all
    // (it writes "P" for 偏印), and ../../bazi/ has 梟 12 : 枭 0.
    expect(Object.keys(TEN_DEITY_DESC)).toContain("梟");
    expect(Object.keys(TEN_DEITY_DESC)).not.toContain("枭");
  });
});

describe("納音 table is uniformly zh-Hant", () => {
  it("no rejected Simplified forms across all 60 NaYin names", () => {
    const bad = Object.entries(NAYIN)
      .map(([gz, name]) => [gz, offenders(String(name))] as const)
      .filter(([, o]) => o.length > 0);
    expect(bad).toEqual([]);
  });

  it("has all 60 ganzhi keys", () => {
    expect(Object.keys(NAYIN)).toHaveLength(60);
  });
});

describe("BaZi domain characters survive any future script sweep", () => {
  it("丑 is a branch, not 醜", () => {
    expect(HIDDEN_STEMS).toHaveProperty("丑");
    expect(HIDDEN_STEMS).not.toHaveProperty("醜");
  });

  it("午 keeps the fan two-stem 丁己 ruling (expert, 2026-07-02)", () => {
    expect(HIDDEN_STEMS["午"].map((h) => h.stem)).toEqual(["丁", "己"]);
  });
});
