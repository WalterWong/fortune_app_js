/**
 * BaZi Data - NaYin, Relationships, and other lookup tables
 */

import type { Gan, Zhi } from "./types";

// 纳音 (NaYin) - 60 Jiazi cycle sounds
export const NAYIN: Record<string, string> = {
  "甲子": "海中金", "乙丑": "海中金",
  "丙寅": "炉中火", "丁卯": "炉中火",
  "戊辰": "大林木", "己巳": "大林木",
  "庚午": "路旁土", "辛未": "路旁土",
  "壬申": "剑锋金", "癸酉": "剑锋金",
  "甲戌": "山头火", "乙亥": "山头火",
  "丙子": "涧下水", "丁丑": "涧下水",
  "戊寅": "城头土", "己卯": "城头土",
  "庚辰": "白蜡金", "辛巳": "白蜡金",
  "壬午": "杨柳木", "癸未": "杨柳木",
  "甲申": "井泉水", "乙酉": "井泉水",
  "丙戌": "屋上土", "丁亥": "屋上土",
  "戊子": "霹雳火", "己丑": "霹雳火",
  "庚寅": "松柏木", "辛卯": "松柏木",
  "壬辰": "长流水", "癸巳": "长流水",
  "甲午": "砂中金", "乙未": "砂中金",
  "丙申": "山下火", "丁酉": "山下火",
  "戊戌": "平地木", "己亥": "平地木",
  "庚子": "壁上土", "辛丑": "壁上土",
  "壬寅": "金泊金", "癸卯": "金泊金",
  "甲辰": "覆灯火", "乙巳": "覆灯火",
  "丙午": "天河水", "丁未": "天河水",
  "戊申": "大驿土", "己酉": "大驿土",
  "庚戌": "钗钏金", "辛亥": "钗钏金",
  "壬子": "桑柘木", "癸丑": "桑柘木",
  "甲寅": "大溪水", "乙卯": "大溪水",
  "丙辰": "砂中土", "丁巳": "砂中土",
  "戊午": "天上火", "己未": "天上火",
  "庚申": "石榴木", "辛酉": "石榴木",
  "壬戌": "大海水", "癸亥": "大海水",
};

// 地支六冲 (Six Clashes)
export const ZHI_CHONG: Record<Zhi, Zhi> = {
  子: "午", 午: "子",
  丑: "未", 未: "丑",
  寅: "申", 申: "寅",
  卯: "酉", 酉: "卯",
  辰: "戌", 戌: "辰",
  巳: "亥", 亥: "巳",
};

// 地支六合 (Six Harmonies)
export const ZHI_LIUHE: [Zhi, Zhi, string][] = [
  ["子", "丑", "土"],
  ["寅", "亥", "木"],
  ["卯", "戌", "火"],
  ["辰", "酉", "金"],
  ["巳", "申", "水"],
  ["午", "未", "土"],
];

// 地支三合 (Three Harmonies)
export const ZHI_SANHE: [Zhi, Zhi, Zhi, string][] = [
  ["申", "子", "辰", "水"],
  ["巳", "酉", "丑", "金"],
  ["寅", "午", "戌", "火"],
  ["亥", "卯", "未", "木"],
];

// 地支三会 (Three Gatherings)
export const ZHI_SANHUI: [Zhi, Zhi, Zhi, string][] = [
  ["亥", "子", "丑", "水"],
  ["寅", "卯", "辰", "木"],
  ["巳", "午", "未", "火"],
  ["申", "酉", "戌", "金"],
];

// 地支相刑 (Punishments)
export const ZHI_XING: Record<Zhi, Zhi | null> = {
  寅: "巳", 巳: "申", 申: "寅",  // 无恩之刑
  未: "丑", 丑: "戌", 戌: "未",  // 持势之刑
  子: "卯", 卯: "子",            // 无礼之刑
  辰: "辰", 午: "午", 酉: "酉", 亥: "亥",  // 自刑
};

// 地支相害 (Harms)
export const ZHI_HAI: Record<Zhi, Zhi> = {
  子: "未", 未: "子",
  丑: "午", 午: "丑",
  寅: "巳", 巳: "寅",
  卯: "辰", 辰: "卯",
  申: "亥", 亥: "申",
  酉: "戌", 戌: "酉",
};

// 地支相破 (Breaks)
export const ZHI_PO: Record<Zhi, Zhi> = {
  子: "酉", 酉: "子",
  午: "卯", 卯: "午",
  辰: "丑", 丑: "辰",
  戌: "未", 未: "戌",
  寅: "亥", 亥: "寅",
  巳: "申", 申: "巳",
};

// 天干相合 (Stem Combinations)
export const GAN_HE: [Gan, Gan, string][] = [
  ["甲", "己", "土"],
  ["乙", "庚", "金"],
  ["丙", "辛", "水"],
  ["丁", "壬", "木"],
  ["戊", "癸", "火"],
];

// 天干相冲 (Stem Clashes)
export const GAN_CHONG: [Gan, Gan][] = [
  ["甲", "庚"],
  ["乙", "辛"],
  ["丙", "壬"],
  ["丁", "癸"],
];

// Branch attributes for relationship detection
export const ZHI_ATTRS: Record<Zhi, {
  chong: Zhi;
  liuhe: Zhi;
  sanhe: [Zhi, Zhi];
  sanhui: [Zhi, Zhi];
  hai: Zhi;
  po: Zhi;
  xing: Zhi | null;
}> = {
  子: { chong: "午", liuhe: "丑", sanhe: ["申", "辰"], sanhui: ["亥", "丑"], hai: "未", po: "酉", xing: "卯" },
  丑: { chong: "未", liuhe: "子", sanhe: ["巳", "酉"], sanhui: ["亥", "子"], hai: "午", po: "辰", xing: "戌" },
  寅: { chong: "申", liuhe: "亥", sanhe: ["午", "戌"], sanhui: ["卯", "辰"], hai: "巳", po: "亥", xing: "巳" },
  卯: { chong: "酉", liuhe: "戌", sanhe: ["亥", "未"], sanhui: ["寅", "辰"], hai: "辰", po: "午", xing: "子" },
  辰: { chong: "戌", liuhe: "酉", sanhe: ["申", "子"], sanhui: ["寅", "卯"], hai: "卯", po: "丑", xing: "辰" },
  巳: { chong: "亥", liuhe: "申", sanhe: ["酉", "丑"], sanhui: ["午", "未"], hai: "寅", po: "申", xing: "申" },
  午: { chong: "子", liuhe: "未", sanhe: ["寅", "戌"], sanhui: ["巳", "未"], hai: "丑", po: "卯", xing: "午" },
  未: { chong: "丑", liuhe: "午", sanhe: ["亥", "卯"], sanhui: ["巳", "午"], hai: "子", po: "戌", xing: "丑" },
  申: { chong: "寅", liuhe: "巳", sanhe: ["子", "辰"], sanhui: ["酉", "戌"], hai: "亥", po: "巳", xing: "寅" },
  酉: { chong: "卯", liuhe: "辰", sanhe: ["巳", "丑"], sanhui: ["申", "戌"], hai: "戌", po: "子", xing: "酉" },
  戌: { chong: "辰", liuhe: "卯", sanhe: ["寅", "午"], sanhui: ["申", "酉"], hai: "酉", po: "未", xing: "未" },
  亥: { chong: "巳", liuhe: "寅", sanhe: ["卯", "未"], sanhui: ["子", "丑"], hai: "申", po: "寅", xing: "亥" },
};

// Helper function to get NaYin
export function getNayin(gan: Gan, zhi: Zhi): string {
  return NAYIN[`${gan}${zhi}`] || "";
}

// Detect relationships between branches
export function detectRelationships(branches: Zhi[]): {
  he: string[];
  chong: string[];
  xing: string[];
  hai: string[];
  po: string[];
} {
  const result = {
    he: [] as string[],
    chong: [] as string[],
    xing: [] as string[],
    hai: [] as string[],
    po: [] as string[],
  };

  // Check each pair
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];
      const attrs = ZHI_ATTRS[b1];

      // 六合 (Six Harmonies)
      if (attrs.liuhe === b2) {
        const heElement = ZHI_LIUHE.find(h =>
          (h[0] === b1 && h[1] === b2) || (h[0] === b2 && h[1] === b1)
        )?.[2];
        result.he.push(`${b1}${b2}合${heElement || ""}`);
      }

      // 六冲 (Six Clashes)
      if (attrs.chong === b2) {
        result.chong.push(`${b1}${b2}冲`);
      }

      // 相害 (Harms)
      if (attrs.hai === b2) {
        result.hai.push(`${b1}${b2}害`);
      }

      // 相破 (Breaks)
      if (attrs.po === b2) {
        result.po.push(`${b1}${b2}破`);
      }

      // 相刑 (Punishments)
      if (attrs.xing === b2) {
        result.xing.push(`${b1}刑${b2}`);
      }
    }
  }

  // Check for three harmonies (三合)
  for (const [z1, z2, z3, element] of ZHI_SANHE) {
    if (branches.includes(z1) && branches.includes(z2) && branches.includes(z3)) {
      result.he.push(`${z1}${z2}${z3}三合${element}局`);
    }
  }

  // Check for three gatherings (三会)
  for (const [z1, z2, z3, element] of ZHI_SANHUI) {
    if (branches.includes(z1) && branches.includes(z2) && branches.includes(z3)) {
      result.he.push(`${z1}${z2}${z3}三会${element}局`);
    }
  }

  return result;
}
