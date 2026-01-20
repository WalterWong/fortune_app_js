/**
 * Prompt Builder - Constructs prompts for LLM fortune-telling analysis
 */

import type { BaZiResult, Gender } from "../bazi/types";
import { GAN, ZHI } from "../bazi/ganzhi";

/**
 * Calculate the GanZhi for a given year
 */
export function calculateYearGanzhi(year: number): string {
  // Year 4 is 甲子 (first year of the 60-year cycle)
  const offset = ((year - 4) % 60 + 60) % 60;
  const ganIndex = offset % 10;
  const zhiIndex = offset % 12;
  return GAN[ganIndex] + ZHI[zhiIndex];
}

/**
 * Build comprehensive initial fortune reading prompt
 */
export function buildInitialPrompt(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string,
  includeClassical: boolean = false
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `你是一位精通中國傳統命理學的專家,包括八字命理、紫微斗數、姓名學等。你精通《滴天髓》、《子平真詮》、《窮通寶鑒》等經典著作,擅長運用五行生剋、十神意象、格局喜忌等理論,對人生命運進行分析和解讀。
請你以專業、理性、誠實的命理分析角度，根據命主提供的八字資訊進行全面解析。
分析過程中請務必忠於命局本身，不刻意迎合、不過度美化結果，對有利與不利之處都要如實說明，讓命主能清楚理解自身優勢、限制與風險，以作為人生規劃的參考。
分析應該全面、深入,並給出有價值的建議。`;

  // Get current year info
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

  // Add four pillars
  const { pillars } = baziData;

  userPrompt += `年柱: ${pillars.year.ganzhi}
納音: ${pillars.year.nayin}
天干: ${pillars.year.gan} (${pillars.year.ganElement})
地支: ${pillars.year.zhi}
藏干: ${pillars.year.hiddenStems.map(h => h.stem).join(", ")}

`;

  userPrompt += `月柱: ${pillars.month.ganzhi}
納音: ${pillars.month.nayin}
天干: ${pillars.month.gan} (${pillars.month.ganElement})
地支: ${pillars.month.zhi}
藏干: ${pillars.month.hiddenStems.map(h => h.stem).join(", ")}

`;

  userPrompt += `日柱: ${pillars.day.ganzhi} (日主)
納音: ${pillars.day.nayin}
天干: ${pillars.day.gan} (${pillars.day.ganElement})
地支: ${pillars.day.zhi}
藏干: ${pillars.day.hiddenStems.map(h => h.stem).join(", ")}

`;

  userPrompt += `時柱: ${pillars.hour.ganzhi}
納音: ${pillars.hour.nayin}
天干: ${pillars.hour.gan} (${pillars.hour.ganElement})
地支: ${pillars.hour.zhi}
藏干: ${pillars.hour.hiddenStems.map(h => h.stem).join(", ")}

`;

  // Add day master and element scores
  const { scores } = baziData.elementScores;
  userPrompt += `日主: ${baziData.dayMaster} (${baziData.dayMasterElement})
日主強弱: ${baziData.strength.assessment}

`;

  userPrompt += `五行分布:
`;
  const elementEntries = Object.entries(scores) as [string, number][];
  userPrompt += elementEntries.map(([elem, score]) => `${elem}: ${score.toFixed(1)}分`).join("、") + "\n";
  userPrompt += `最強五行: ${baziData.elementScores.strongest}
最弱五行: ${baziData.elementScores.weakest}

`;

  // Add relationships
  const { relationships } = baziData;
  if (relationships.he.length || relationships.chong.length || relationships.xing.length || relationships.hai.length || relationships.po.length) {
    userPrompt += `地支關係:
`;
    if (relationships.he.length) userPrompt += `合: ${relationships.he.join(", ")}\n`;
    if (relationships.chong.length) userPrompt += `冲: ${relationships.chong.join(", ")}\n`;
    if (relationships.xing.length) userPrompt += `刑: ${relationships.xing.join(", ")}\n`;
    if (relationships.hai.length) userPrompt += `害: ${relationships.hai.join(", ")}\n`;
    if (relationships.po.length) userPrompt += `破: ${relationships.po.join(", ")}\n`;
    userPrompt += "\n";
  }

  // Add ten deities
  userPrompt += `十神分布:
年柱天干: ${baziData.tenDeities.year.stem}
月柱天干: ${baziData.tenDeities.month.stem}
時柱天干: ${baziData.tenDeities.hour.stem}

`;

  // Add dayun (major luck cycles)
  userPrompt += `大運資訊:
`;
  userPrompt += baziData.dayun.slice(0, 10).map(cycle =>
    `${cycle.pillar} (${cycle.ageRange}歲, ${cycle.element})`
  ).join("、") + "\n\n";

  // Add fleeting years (流年)
  userPrompt += `流年資訊 (未來11年天干地支):
`;
  userPrompt += baziData.liunian.map((ly, i) => {
    const suffix = i === 0 ? " (今年)" : "";
    return `${ly.year}年 ${ly.ganzhi}${suffix}`;
  }).join("、") + "\n\n";

  // Add classical texts if requested
  if (includeClassical && baziData.classicalTexts) {
    if (baziData.classicalTexts.sizi) {
      userPrompt += `古籍《三命通會》對此日柱的論述:
${baziData.classicalTexts.sizi.slice(0, 500)}...

`;
    }
    if (baziData.classicalTexts.monthly) {
      userPrompt += `月令分析:
${baziData.classicalTexts.monthly.slice(0, 300)}...

`;
    }
  }

  // Add analysis tasks
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

/**
 * Build Luck Scale analysis prompt for quantitative fortune assessment
 */
export function buildLuckScalePrompt(
  baziData: BaZiResult,
  gender: Gender,
  birthday: string
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `你是一位精通中國傳統命理學的專家，擅長量化分析命主運勢。
請你以專業、理性、客觀的角度，根據命主的八字命局、當前大運及流年資訊，建立可量化的運勢評估系統。
你的分析必須基於五行生剋、十神作用、大運流年互動等傳統命理原理，並如實反映起伏變化。`;

  const currentYear = new Date().getFullYear();
  const currentYearGanzhi = calculateYearGanzhi(currentYear);

  // Calculate current age
  const birthYear = parseInt(birthday.split("-")[0]);
  const currentAge = currentYear - birthYear;

  const { pillars } = baziData;

  // Find current dayun
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

  // Add element scores
  const { scores } = baziData.elementScores;
  const elementEntries = Object.entries(scores) as [string, number][];
  userPrompt += elementEntries.map(([elem, score]) => `${elem}: ${score.toFixed(1)}分`).join("、") + "\n";
  userPrompt += `最強五行: ${baziData.elementScores.strongest}
最弱五行: ${baziData.elementScores.weakest}

五、當前大運

命主當前年齡: ${currentAge}歲
當前大運: ${currentDayun}

完整大運資訊（供參考）:
`;
  userPrompt += baziData.dayun.slice(0, 10).map(d => `${d.pillar} (${d.ageRange}歲)`).join("、") + "\n\n";

  // Add fleeting years
  userPrompt += `六、流年資訊

今年流年: ${currentYear}年 ${currentYearGanzhi}

未來10年流年:
`;
  userPrompt += baziData.liunian.map((ly, i) => {
    const suffix = i === 0 ? " (今年)" : "";
    return `${ly.year}年 ${ly.ganzhi}${suffix}`;
  }).join("、") + "\n\n";

  const yearNext = currentYear + 1;
  const yearEnd = currentYear + 10;

  userPrompt += `七、輸出要求

請完成以下運勢指數評估：

📌 今年（${currentYear}年）
📌 未來 10 年流年（逐年，${currentYear}–${yearEnd}年）

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
    },
    {
      "year": ${yearNext},
      "ganzhi": "...",
      "luck_scale": 55,
      "assessment": "平穩",
      "reason": "流年與命局無明顯沖剋，穩定為主"
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

/**
 * Build multi-turn chat prompt with conversation context
 */
export function buildChatPrompt(
  baziData: BaZiResult,
  initialReading: string | null,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userQuestion: string
): { role: string; content: string }[] {
  const systemPrompt = `你是一位精通中國傳統命理學的專家。你正在與一位求測者進行後續討論,回答他們關於八字命盤的具體問題。請基於之前的分析和八字資料,提供專業、準確的回答。使用 Markdown 格式來組織你的回覆。`;

  const messages: { role: string; content: string }[] = [
    { role: "system", content: systemPrompt }
  ];

  // Add initial reading as context
  if (initialReading) {
    messages.push({
      role: "assistant",
      content: initialReading
    });
  }

  // Add conversation history
  for (const msg of conversationHistory) {
    messages.push({
      role: msg.role,
      content: msg.content
    });
  }

  // Add current question
  messages.push({
    role: "user",
    content: userQuestion
  });

  return messages;
}
