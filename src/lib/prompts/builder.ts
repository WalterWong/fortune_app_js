/**
 * Prompt Builder — fortune-reading prompts in zh or en.
 * BaZi-specific characters (天干/地支/納音/五行/十神/ganzhi) stay Chinese in both locales —
 * the surrounding prose translates.
 */

import type { BaZiResult, Gender } from "../bazi/types";
import { GAN, ZHI } from "../bazi/ganzhi";
import type { Locale } from "../i18n/strings";

/** GanZhi for a given year. Year 4 CE = 甲子. */
export function calculateYearGanzhi(year: number): string {
  const offset = ((year - 4) % 60 + 60) % 60;
  return GAN[offset % 10] + ZHI[offset % 12];
}

// ─── Initial fortune-reading prompt ──────────────────────────────────────────

export function buildInitialPrompt(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string,
  includeClassical: boolean = false,
  locale: Locale = "zh"
): { systemPrompt: string; userPrompt: string } {
  return locale === "en"
    ? buildInitialPromptEn(baziData, gender, birthday, includeClassical)
    : buildInitialPromptZh(baziData, gender, birthday, includeClassical);
}

function buildInitialPromptZh(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string,
  includeClassical: boolean
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `你是一位精通中國傳統命理學的專家,包括八字命理、紫微斗數、姓名學等。你精通《滴天髓》、《子平真詮》、《窮通寶鑒》等經典著作,擅長運用五行生剋、十神意象、格局喜忌等理論,對人生命運進行分析和解讀。
請你以專業、理性、誠實的命理分析角度，根據命主提供的八字資訊進行全面解析。
分析過程中請務必忠於命局本身，不刻意迎合、不過度美化結果，對有利與不利之處都要如實說明，讓命主能清楚理解自身優勢、限制與風險，以作為人生規劃的參考。
分析應該全面、深入,並給出有價值的建議。`;

  const currentYear = new Date().getFullYear();
  const currentYearGanzhi = calculateYearGanzhi(currentYear);

  let userPrompt = `今年是西元${currentYear}年(${currentYearGanzhi}年)
現在你將面對一個八字命例,請你運用你的專業知識和經驗,對該命例進行全面、深入的分析,並給出有價值的建議。請你務必逐步思考、推理,並清晰地展示你的思考過程。

確保準確性,使用正確的資訊進行回應使用者的問題,切勿使用虛假的生日或其他資訊。

基礎八字命理規則:

五行生剋: 生(土生金,金生水,水生木,木生火,火生土).剋(土剋水,水剋火,火剋金,金剋木,木剋土)
天干生剋關係:
生 甲木/乙木生丙火/丁火,丙火/丁火生戊土/己土,戊土/己土生庚金/辛金,庚金/辛金生壬水/癸水,壬水/癸水生甲木/乙木。
剋 甲木/乙木剋戊土/己土,丙火/丁火剋庚金/辛金,戊土/己土剋壬水/癸水,庚金/辛金剋甲木/乙木,壬水/癸水剋丙火/丁火。

十神簡稱/別稱:
正官:官、七殺:殺,偏官、正印:印、偏印:梟、比肩:比、劫財:劫、食神:食、傷官:傷。正財:財、偏財:才
十神生剋: 生 印生比劫, 比劫生食傷,食傷生財,財生官殺,官殺生印。 剋 印剋食傷,食傷剋官殺,財剋(破)印,官殺剋比劫,比劫剋(奪)財。
透出指的是天干有某個五行或十神,如果地支有某個五行或十神,一般叫藏或得地

基本資訊:
性別: ${gender}
出生日期(新曆/陽曆/公曆): ${birthday}
農曆日期: ${baziData.birthInfo.lunarDate}

其八字命盤如下:

`;

  const { pillars } = baziData;
  const zhPillar = (label: string, p: typeof pillars.year, isDay = false) =>
    `${label}: ${p.ganzhi}${isDay ? " (日主)" : ""}
納音: ${p.nayin}
天干: ${p.gan} (${p.ganElement})
地支: ${p.zhi}
藏干: ${p.hiddenStems.map((h) => h.stem).join(", ")}

`;
  userPrompt += zhPillar("年柱", pillars.year);
  userPrompt += zhPillar("月柱", pillars.month);
  userPrompt += zhPillar("日柱", pillars.day, true);
  userPrompt += zhPillar("時柱", pillars.hour);

  const { scores } = baziData.elementScores;
  userPrompt += `日主: ${baziData.dayMaster} (${baziData.dayMasterElement})
日主強弱: ${baziData.strength.assessment}

五行分布:
`;
  const elementEntries = Object.entries(scores) as [string, number][];
  userPrompt += elementEntries.map(([e, s]) => `${e}: ${s.toFixed(1)}分`).join("、") + "\n";
  userPrompt += `最強五行: ${baziData.elementScores.strongest}
最弱五行: ${baziData.elementScores.weakest}

`;

  const { relationships } = baziData;
  if (
    relationships.he.length ||
    relationships.chong.length ||
    relationships.xing.length ||
    relationships.hai.length ||
    relationships.po.length
  ) {
    userPrompt += `地支關係:\n`;
    if (relationships.he.length) userPrompt += `合: ${relationships.he.join(", ")}\n`;
    if (relationships.chong.length) userPrompt += `冲: ${relationships.chong.join(", ")}\n`;
    if (relationships.xing.length) userPrompt += `刑: ${relationships.xing.join(", ")}\n`;
    if (relationships.hai.length) userPrompt += `害: ${relationships.hai.join(", ")}\n`;
    if (relationships.po.length) userPrompt += `破: ${relationships.po.join(", ")}\n`;
    userPrompt += "\n";
  }

  userPrompt += `十神分布:
年柱天干: ${baziData.tenDeities.year.stem}
月柱天干: ${baziData.tenDeities.month.stem}
時柱天干: ${baziData.tenDeities.hour.stem}

`;

  userPrompt += `大運資訊:
`;
  userPrompt += baziData.dayun
    .slice(0, 10)
    .map((c) => `${c.pillar} (${c.ageRange}歲, ${c.element})`)
    .join("、") + "\n\n";

  userPrompt += `流年資訊 (${baziData.liunian.length}年天干地支):
`;
  userPrompt += baziData.liunian
    .map((ly) => {
      const suffix = ly.year === currentYear ? " (今年)" : ly.year < currentYear ? " (去年)" : "";
      return `${ly.year}年 ${ly.ganzhi}${suffix}`;
    })
    .join("、") + "\n\n";

  if (includeClassical && baziData.classicalTexts) {
    if (baziData.classicalTexts.sizi) {
      userPrompt += `古籍《三命通會》對此日柱的論述:\n${baziData.classicalTexts.sizi.slice(0, 500)}...\n\n`;
    }
    if (baziData.classicalTexts.monthly) {
      userPrompt += `月令分析:\n${baziData.classicalTexts.monthly.slice(0, 300)}...\n\n`;
    }
  }

  userPrompt += `你的分析任務:
請你從以下幾個方面入手,展開你的分析:
1. 整體審視命局: 首先,請你對整個八字進行審視,從五行、陰陽、十神、格局等多個角度入手,對命局的整體特點進行概括性的描述。
2. 分析日元強弱: 日元代表命主自身,其強弱直接關係到命主的運勢。請你結合月令、地支、天干等因素,綜合判斷日元的強弱,並說明判斷的依據。
3. 剖析性格特徵: 性格決定命運。請你結合八字,分析命主的性格特點、優缺點,以及可能的發展方向。
4. 推斷事業發展: 事業是人生價值的重要體現。請你結合八字,分析命主的事業運勢、適合的職業、發展方向等。
5. 預測財富運勢: 財富是人生幸福的重要保障。請你結合八字,分析命主的財富狀況、財運走勢、理財建議等。
6. 研判婚姻情感: 婚姻是人生重要的組成部分。請你結合八字,分析命主的婚姻運勢、情感狀況、婚戀建議等。
7. 關注健康狀況: 健康是幸福人生的基石。請你結合八字,分析命主的健康狀況、可能存在的健康隱患、養生建議等。
8. 把握大運流年: 大運和流年是影響命主運勢的重要因素。請你結合大運,分析命主在不同人生階段的運勢變化,為命主提供人生規劃建議。
9. 未來五年流年預測: 請你重點分析未來五年的流年運勢,預測可能出現的重大事件,並給出相應的應對建議。

分析原則（請務必遵守）
不只說好話，也要指出風險與代價
不使用恐嚇、迷信或絕對化語言
以「趨勢 + 提醒」為主，而非命定論
語氣沉穩、尊重命主、自我負責

**重要提醒:**
- 上方已提供完整的大運資訊,這些都是經過精確計算的結果
- 在分析大運相關問題時,請務必使用上方提供的天干地支資料
- 切勿自行推算或估計大運的天干地支,請直接引用上方已計算好的數據

請開始你的分析吧!
`;

  return { systemPrompt, userPrompt };
}

function buildInitialPromptEn(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string,
  includeClassical: boolean
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are an expert in classical Chinese astrology (BaZi / 八字命理), well-versed in canonical texts such as Di Tian Sui (《滴天髓》), Zi Ping Zhen Quan (《子平真詮》), and Qiong Tong Bao Jian (《窮通寶鑒》). You analyze life destiny through the Five Elements (五行) generation/control cycles, the Ten Deities (十神), and structural patterns (格局).

Be professional, rational, and honest. Stay faithful to the chart itself — don't flatter, don't sugar-coat. State both strengths and risks plainly so the reader understands their advantages, limitations, and exposures, and can plan accordingly. The analysis should be comprehensive, deep, and give actionable advice.

Use English prose, but keep the Chinese symbols for stems/branches/elements/ten-deities (e.g. 庚, 辰, 金, 比肩) — those are the canonical names and should not be transliterated.`;

  const gEn = gender === "男" ? "Male (男)" : "Female (女)";
  const currentYear = new Date().getFullYear();
  const currentYearGanzhi = calculateYearGanzhi(currentYear);

  let userPrompt = `Current year: ${currentYear} CE (${currentYearGanzhi} 年).

You are now reading a BaZi chart. Apply your knowledge step by step and show your reasoning. Use the data below — do not invent or re-derive any of the stems / branches.

Five Elements generation and control (五行生剋):
- Generation: 土→金, 金→水, 水→木, 木→火, 火→土
- Control:    土→水, 水→火, 火→金, 金→木, 木→土

Ten Deities short forms (十神簡稱):
- 正官: 官 | 七殺: 殺 (偏官) | 正印: 印 | 偏印: 梟
- 比肩: 比 | 劫財: 劫 | 食神: 食 | 傷官: 傷
- 正財: 財 | 偏財: 才

"透出" means a stem/element appears in the Heavenly Stems; "藏" or "得地" means it sits inside an Earthly Branch's hidden stems.

──── Subject ────
Gender: ${gEn}
Solar birth date: ${birthday}
Lunar date: ${baziData.birthInfo.lunarDate}

──── BaZi chart ────

`;

  const { pillars } = baziData;
  const enPillar = (label: string, p: typeof pillars.year, isDay = false) =>
    `${label} Pillar: ${p.ganzhi}${isDay ? "  ← Day Master (日主)" : ""}
  NaYin (納音): ${p.nayin}
  Heavenly Stem (天干): ${p.gan} (${p.ganElement})
  Earthly Branch (地支): ${p.zhi}
  Hidden Stems (藏干): ${p.hiddenStems.map((h) => h.stem).join(", ")}

`;
  userPrompt += enPillar("Year (年)", pillars.year);
  userPrompt += enPillar("Month (月)", pillars.month);
  userPrompt += enPillar("Day (日)", pillars.day, true);
  userPrompt += enPillar("Hour (時)", pillars.hour);

  const strengthEn = baziData.strength.assessment === "强" ? "Strong (强)" : "Weak (弱)";
  userPrompt += `Day Master: ${baziData.dayMaster} (${baziData.dayMasterElement})
Day Master strength: ${strengthEn}

Five Elements distribution:
`;
  const elementEntries = Object.entries(baziData.elementScores.scores) as [string, number][];
  userPrompt += elementEntries.map(([e, s]) => `  ${e}: ${s.toFixed(1)}`).join("\n") + "\n";
  userPrompt += `Strongest element: ${baziData.elementScores.strongest}
Weakest element: ${baziData.elementScores.weakest}

`;

  const { relationships } = baziData;
  if (
    relationships.he.length ||
    relationships.chong.length ||
    relationships.xing.length ||
    relationships.hai.length ||
    relationships.po.length
  ) {
    userPrompt += `Branch relationships (地支關係):
`;
    if (relationships.he.length) userPrompt += `  合 (harmony): ${relationships.he.join(", ")}\n`;
    if (relationships.chong.length) userPrompt += `  沖 (clash):   ${relationships.chong.join(", ")}\n`;
    if (relationships.xing.length) userPrompt += `  刑 (punish):  ${relationships.xing.join(", ")}\n`;
    if (relationships.hai.length) userPrompt += `  害 (harm):    ${relationships.hai.join(", ")}\n`;
    if (relationships.po.length) userPrompt += `  破 (break):   ${relationships.po.join(", ")}\n`;
    userPrompt += "\n";
  }

  userPrompt += `Ten Deities on stems (十神):
  Year stem:  ${baziData.tenDeities.year.stem}
  Month stem: ${baziData.tenDeities.month.stem}
  Hour stem:  ${baziData.tenDeities.hour.stem}

`;

  userPrompt += `DaYun — 10-year luck cycles (大運):
`;
  userPrompt += baziData.dayun
    .slice(0, 10)
    .map(
      (c) =>
        `  ${c.pillar} | ages ${c.ageRange} | years ${c.startYear}–${c.endYear} | element ${c.element}`
    )
    .join("\n") + "\n\n";

  userPrompt += `LiuNian — annual stems/branches (流年, ${baziData.liunian.length} years):
`;
  userPrompt += baziData.liunian
    .map((ly) => {
      const suffix =
        ly.year === currentYear ? "  ← this year" : ly.year < currentYear ? "  (last year)" : "";
      return `  ${ly.year}: ${ly.ganzhi}${suffix}`;
    })
    .join("\n") + "\n\n";

  if (includeClassical && baziData.classicalTexts) {
    if (baziData.classicalTexts.sizi) {
      userPrompt += `Sanming Tonghui (《三命通會》) note on this Day pillar:
${baziData.classicalTexts.sizi.slice(0, 500)}...

`;
    }
    if (baziData.classicalTexts.monthly) {
      userPrompt += `Monthly command analysis:
${baziData.classicalTexts.monthly.slice(0, 300)}...

`;
    }
  }

  userPrompt += `──── Your task ────

Cover all of the following, in order:

1. Overall reading of the chart — Five Elements, yin/yang, Ten Deities, structural pattern.
2. Day Master strength — using month command, branches, and stems. Show the reasoning.
3. Personality — traits, strengths, weaknesses, likely growth directions.
4. Career — career outlook, suitable industries/roles, direction.
5. Wealth — wealth picture, money-luck trajectory, practical advice.
6. Relationships & marriage — outlook, emotional patterns, advice.
7. Health — likely tendencies, watch-outs, lifestyle suggestions.
8. DaYun + LiuNian — how life phases shift; planning suggestions.
9. Next 5 years (LiuNian) — major events to watch for, with concrete coping advice.

Analysis principles (mandatory):
- Don't only flatter. Name the risks and the costs.
- No fear-mongering, no superstition, no absolute claims.
- Frame as "trend + caution," not deterministic fate.
- Calm, respectful tone; treat the reader as a responsible adult.

**Important:**
- The DaYun / LiuNian / Ten Deities above are precisely computed. Use them as the source of truth.
- Do not re-derive stems or branches yourself. Cite the values above.

Begin.
`;

  return { systemPrompt, userPrompt };
}

// ─── Luck-scale prompt ───────────────────────────────────────────────────────

export function buildLuckScalePrompt(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string,
  locale: Locale = "zh"
): { systemPrompt: string; userPrompt: string } {
  return locale === "en"
    ? buildLuckScalePromptEn(baziData, gender, birthday)
    : buildLuckScalePromptZh(baziData, gender, birthday);
}

function buildLuckScalePromptZh(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `你是一位精通中國傳統命理學的專家，擅長量化分析命主運勢。
請你以專業、理性、客觀的角度，根據命主的八字命局、當前大運及流年資訊，建立可量化的運勢評估系統。
你的分析必須基於五行生剋、十神作用、大運流年互動等傳統命理原理，並如實反映起伏變化。`;

  const currentYear = new Date().getFullYear();
  const currentYearGanzhi = calculateYearGanzhi(currentYear);
  const birthYear = parseInt(birthday.split("-")[0]);
  const currentAge = currentYear - birthYear;

  const { pillars } = baziData;
  let currentDayun = "未知";
  for (const d of baziData.dayun) {
    const [start, end] = d.ageRange.split("-").map(Number);
    if (currentAge >= start && currentAge <= end) {
      currentDayun = d.pillar;
      break;
    }
  }

  let userPrompt = `今年是西元${currentYear}年(${currentYearGanzhi}年)

運勢指數（Luck Scale）分析任務

請你以專業、理性、誠實的命理分析角度，根據命主的【本命八字命局】，結合【當前所處大運】以及【指定流年】，建立一套可量化的運勢評估（Luck Scale）。

此運勢指數的目的，是用來反映命主在不同年份中，整體順逆程度與現實可發揮性，而非單純吉凶判斷。

一、Luck Scale 定義說明

請為每一年給出一個 0–100 分的運勢指數（Luck Scale），並遵守以下原則：

• 50 分：中性年份，運勢平穩，成敗取決於個人選擇
• 60–70 分：偏順，有助力，但仍需努力
• 80 分以上：明顯順勢年，機會多、成果可見
• 40–49 分：偏逆年，阻力增加，需保守應對
• 30 分以下：明顯壓力年，宜避險、調整、不強求

⚠️ 請避免所有年份都集中在高分，必須如實呈現高低起伏。

二、評分依據（必須納入）

Luck Scale 的評估請同時考量以下三個層面，並說明其影響方向（加分或扣分）：

1️⃣ 命主本命命局（基礎盤）
• 日元強弱與用忌神
• 原局五行是否失衡
• 命局可承受的運勢上限與下限
👉 此為「底盤分數」，影響整體波動幅度。

2️⃣ 當前大運（十年運）
• 大運五行是否扶助或克制日元
• 是否引動原局關鍵十神（如財、官、印、食傷）
• 大運屬於發展期、消耗期或修正期
👉 此為「長期趨勢分數」，決定一段人生高低走向。

3️⃣ 流年影響（逐年變化）
• 流年天干地支與命局、大運的生剋、刑沖合害
• 是否形成好用之合，或明顯衝破、壓制
• 對現實層面（事業、財務、感情、健康）的觸發性
👉 此為「年度修正分數」，決定某一年特別好或特別辛苦。

三、命主基本資訊

性別: ${gender}
出生日期: ${birthday}
農曆日期: ${baziData.birthInfo.lunarDate}
當前年齡: ${currentAge}歲

四、八字命局資訊

年柱: ${pillars.year.ganzhi} (${pillars.year.ganElement})
月柱: ${pillars.month.ganzhi} (${pillars.month.ganElement})
日柱: ${pillars.day.ganzhi} (${pillars.day.ganElement}) ← 日主
時柱: ${pillars.hour.ganzhi} (${pillars.hour.ganElement})

日主: ${baziData.dayMaster} (${baziData.dayMasterElement})
日主強弱: ${baziData.strength.assessment}

五行分布:
`;
  const elementEntries = Object.entries(baziData.elementScores.scores) as [string, number][];
  userPrompt += elementEntries.map(([e, s]) => `${e}: ${s.toFixed(1)}分`).join("、") + "\n";
  userPrompt += `最強五行: ${baziData.elementScores.strongest}
最弱五行: ${baziData.elementScores.weakest}

五、當前大運

命主當前年齡: ${currentAge}歲
當前大運: ${currentDayun}

完整大運資訊（供參考）:
`;
  userPrompt += baziData.dayun
    .slice(0, 10)
    .map((d) => `${d.pillar} (${d.ageRange}歲, ${d.startYear}–${d.endYear}年)`)
    .join("、") + "\n\n";

  userPrompt += `六、流年資訊

今年流年: ${currentYear}年 ${currentYearGanzhi}

流年清單 (${baziData.liunian.length}年):
`;
  userPrompt += baziData.liunian
    .map((ly) => {
      const suffix = ly.year === currentYear ? " (今年)" : ly.year < currentYear ? " (去年)" : "";
      return `${ly.year}年 ${ly.ganzhi}${suffix}`;
    })
    .join("、") + "\n\n";

  const yearNext = currentYear + 1;
  const yearEnd = currentYear + 5;

  userPrompt += `七、輸出要求

請完成以下運勢指數評估：

📌 去年 (${currentYear - 1}年)、今年（${currentYear}年）、未來五年 (${yearNext}–${yearEnd}年)

每一年都需給出：
• Luck Scale 分數（0–100）
• 運勢定性：偏順 / 平穩 / 偏逆 / 壓力年
• 關鍵原因：一句話說明（命局 × 大運 × 流年的互動）

八、輸出格式（嚴格遵守）

請使用以下 JSON 格式輸出，確保可被程式解析：

\`\`\`json
{
  "luck_scale_analysis": [
    {
      "year": ${currentYear},
      "ganzhi": "${currentYearGanzhi}",
      "luck_scale": 65,
      "assessment": "偏順",
      "reason": "大運扶助日主，流年財星得力，事業有進展機會"
    }
  ]
}
\`\`\`

九、重要提醒

• 請基於傳統命理原理進行分析，不得憑空猜測
• 分數必須如實反映起伏，避免所有年份都是高分或低分
• 必須使用上方提供的準確天干地支資料，切勿自行推算
• 輸出必須是有效的 JSON 格式，方便前端解析
• 關鍵原因需簡潔明確，點出核心互動因素

請開始你的運勢指數分析吧！
`;

  return { systemPrompt, userPrompt };
}

function buildLuckScalePromptEn(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are an expert in classical Chinese astrology (BaZi / 八字), specializing in quantitative luck assessment.

Score the reader's year-by-year fortune objectively, based on the natal chart (本命), the current DaYun (10-year cycle), and the LiuNian (annual stems/branches). Ground every number in traditional BaZi reasoning — Five Elements generation/control, Ten Deity interactions, DaYun-vs-LiuNian dynamics — and reflect actual highs and lows. Don't flatten the curve.

Use English prose. Keep Chinese symbols (天干/地支/五行/十神) intact — they are the canonical names.`;

  const gEn = gender === "男" ? "Male (男)" : "Female (女)";
  const currentYear = new Date().getFullYear();
  const currentYearGanzhi = calculateYearGanzhi(currentYear);
  const birthYear = parseInt(birthday.split("-")[0]);
  const currentAge = currentYear - birthYear;

  const { pillars } = baziData;
  let currentDayun = "unknown";
  for (const d of baziData.dayun) {
    const [start, end] = d.ageRange.split("-").map(Number);
    if (currentAge >= start && currentAge <= end) {
      currentDayun = d.pillar;
      break;
    }
  }

  const strengthEn = baziData.strength.assessment === "强" ? "Strong (强)" : "Weak (弱)";

  let userPrompt = `Current year: ${currentYear} CE (${currentYearGanzhi} 年).

──── Task: Luck-Scale assessment ────

Produce a quantitative luck score for each requested year, blending the natal chart (本命), the current DaYun, and the LiuNian. The score reflects how favorable conditions are and how realistic it is to push on goals — not a simple good/bad verdict.

1. Score definition (0–100):
   • 50    — neutral; flat year, outcome rides on the reader's choices.
   • 60–70 — supportive; tailwinds, but still requires effort.
   • 80+   — strongly favorable; opportunities abundant, results visible.
   • 40–49 — adverse; resistance is up, play conservatively.
   • <30   — high pressure; defend, restructure, don't force matters.

   ⚠ Don't cluster everything at the top. Show the real ups and downs.

2. Score must blend three layers (state each layer's contribution):

   ① Natal chart (base score)
     - Day Master strength + favorable/unfavorable elements
     - Five-Element balance / imbalance
     - The ceiling and floor the chart can withstand
     → Sets the amplitude of the swings.

   ② Current DaYun (long-term trend)
     - Does DaYun nourish or attack the Day Master?
     - Does it trigger key Ten Deities (財/官/印/食傷)?
     - Is the DaYun a growth phase, a drain phase, or a correction phase?
     → Sets the multi-year baseline.

   ③ LiuNian (annual modifier)
     - LiuNian stem/branch interactions with chart + DaYun (生剋/刑沖合害)
     - Useful combinations vs. clear clashes/breaks/suppression
     - Real-world triggers (career, money, relationships, health)
     → Sets the year-to-year deviation.

──── Subject ────
Gender: ${gEn}
Solar birth date: ${birthday}
Lunar date: ${baziData.birthInfo.lunarDate}
Current age: ${currentAge}

──── BaZi chart ────

Year Pillar:  ${pillars.year.ganzhi}  (${pillars.year.ganElement})
Month Pillar: ${pillars.month.ganzhi}  (${pillars.month.ganElement})
Day Pillar:   ${pillars.day.ganzhi}  (${pillars.day.ganElement}) ← Day Master
Hour Pillar:  ${pillars.hour.ganzhi}  (${pillars.hour.ganElement})

Day Master: ${baziData.dayMaster} (${baziData.dayMasterElement})
Day Master strength: ${strengthEn}

Five Elements distribution:
`;
  const elementEntries = Object.entries(baziData.elementScores.scores) as [string, number][];
  userPrompt += elementEntries.map(([e, s]) => `  ${e}: ${s.toFixed(1)}`).join("\n") + "\n";
  userPrompt += `Strongest element: ${baziData.elementScores.strongest}
Weakest element: ${baziData.elementScores.weakest}

──── Current DaYun ────

Age: ${currentAge}
Current DaYun: ${currentDayun}

Full DaYun timeline:
`;
  userPrompt += baziData.dayun
    .slice(0, 10)
    .map(
      (d) => `  ${d.pillar} | ages ${d.ageRange} | years ${d.startYear}–${d.endYear}`
    )
    .join("\n") + "\n\n";

  userPrompt += `──── LiuNian ────

This year: ${currentYear} ${currentYearGanzhi}

LiuNian list (${baziData.liunian.length} years):
`;
  userPrompt += baziData.liunian
    .map((ly) => {
      const suffix =
        ly.year === currentYear ? "  ← this year" : ly.year < currentYear ? "  (last year)" : "";
      return `  ${ly.year}: ${ly.ganzhi}${suffix}`;
    })
    .join("\n") + "\n\n";

  const yearEnd = currentYear + 5;

  userPrompt += `──── Output requirements ────

Score every year in the LiuNian list above (${currentYear - 1} through ${yearEnd}).

For each year, give:
  • luck_scale: integer 0–100
  • assessment: one of "favorable" | "neutral" | "adverse" | "high_pressure"
  • reason: one sentence naming the chart × DaYun × LiuNian interaction that drove the score.

──── Output format (strict) ────

Return valid JSON parseable by a frontend, in this exact shape:

\`\`\`json
{
  "luck_scale_analysis": [
    {
      "year": ${currentYear},
      "ganzhi": "${currentYearGanzhi}",
      "luck_scale": 65,
      "assessment": "favorable",
      "reason": "DaYun nourishes the Day Master; LiuNian 財星 activates — career momentum."
    }
  ]
}
\`\`\`

──── Important ────

• Reason only from classical BaZi principles — no guessing.
• Reflect real volatility; don't cluster at one end.
• Use the precise stems/branches above as the source of truth; do not re-derive.
• Output must be valid JSON for parsing.
• Keep reasons short and specific — name the dominant interaction.

Begin.
`;

  return { systemPrompt, userPrompt };
}

// ─── Multi-turn chat prompt ──────────────────────────────────────────────────

export function buildChatPrompt(
  baziData: BaZiResult,
  initialReading: string | null,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userQuestion: string,
  locale: Locale = "zh"
): { role: string; content: string }[] {
  // Reference baziData so future versions can ground replies in chart data.
  void baziData;
  const systemPrompt =
    locale === "en"
      ? `You are an expert in classical Chinese BaZi astrology (八字命理). You are continuing a conversation with a reader and answering follow-up questions about their chart. Ground your answers in the prior reading and the chart data already provided. Use Markdown to structure your response.`
      : `你是一位精通中國傳統命理學的專家。你正在與一位求測者進行後續討論,回答他們關於八字命盤的具體問題。請基於之前的分析和八字資料,提供專業、準確的回答。使用 Markdown 格式來組織你的回覆。`;

  const messages: { role: string; content: string }[] = [
    { role: "system", content: systemPrompt },
  ];

  if (initialReading) {
    messages.push({ role: "assistant", content: initialReading });
  }
  for (const msg of conversationHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }
  messages.push({ role: "user", content: userQuestion });

  return messages;
}
