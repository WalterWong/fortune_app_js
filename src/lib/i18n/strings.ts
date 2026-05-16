export type Locale = "zh" | "en";

export const LOCALES: Locale[] = ["zh", "en"];

type Dict = Record<string, { zh: string; en: string }>;

export const STRINGS: Dict = {
  // Header
  app_title: { zh: "DestinyAI 八字排盤", en: "DestinyAI · BaZi Reader" },
  subtitle_pure_client: { zh: "純前端計算 · 無需後端", en: "Client-side only · No backend" },
  toggle_to_en: { zh: "EN", en: "EN" },
  toggle_to_zh: { zh: "中", en: "中" },

  // Landing card
  landing_card_title: { zh: "八字命盤計算", en: "Calculate Your BaZi Chart" },
  landing_card_desc: {
    zh: "請輸入您的出生資料，所有計算在瀏覽器中完成",
    en: "Enter your birth details. All calculations run in your browser.",
  },
  about_title: { zh: "關於八字命理", en: "About BaZi" },
  about_body: {
    zh: "八字命理是中國傳統命理學的重要分支，通過出生年月日時推算出四柱八字，分析五行生剋、十神關係、大運流年等因素。本工具完全在您的瀏覽器中運算，不會上傳任何資料；產生的提示詞可貼到 ChatGPT 或 Claude 進行解讀。",
    en: "BaZi (八字, \"Eight Characters\") is a classical Chinese astrology system that derives four pillars from birth year/month/day/hour and reads them through the five elements (五行), the ten deities (十神), and DaYun/LiuNian luck cycles. This tool runs entirely in your browser — no data is uploaded. The generated prompt can be pasted into ChatGPT or Claude for interpretation.",
  },

  // Form
  label_birthday: { zh: "出生日期 (公曆)", en: "Birth Date (Gregorian)" },
  label_birth_time: { zh: "出生時間", en: "Birth Time" },
  optional_marker: { zh: "(選填)", en: "(optional)" },
  hint_birth_time: {
    zh: "若不確定出生時間，將使用中午 12:00 進行計算",
    en: "If unknown, noon (12:00) will be used.",
  },
  label_gender: { zh: "性別", en: "Gender" },
  gender_male: { zh: "男", en: "Male (男)" },
  gender_female: { zh: "女", en: "Female (女)" },
  placeholder_gender: { zh: "請選擇性別", en: "Select gender" },
  btn_calculate: { zh: "開始排盤", en: "Calculate Chart" },
  btn_calculating: { zh: "計算中...", en: "Calculating..." },
  btn_reset: { zh: "重新排盤", en: "New chart" },
  err_invalid_date: {
    zh: "計算出錯，請檢查輸入的日期是否有效",
    en: "Calculation failed. Please check that the birth date is valid.",
  },
  err_birthday_required: { zh: "請選擇出生日期", en: "Please pick a birth date" },

  // Birth info row
  label_solar: { zh: "公曆", en: "Solar" },
  label_lunar: { zh: "農曆", en: "Lunar" },
  label_zodiac: { zh: "生肖", en: "Zodiac" },

  // Legend
  legend_label: { zh: "五行配色：", en: "Five-element colors:" },
  legend_hint: {
    zh: "(適用於八字命盤、大運、流年)",
    en: "(applies to BaZi chart, DaYun, LiuNian)",
  },

  // BaziChart
  bazi_title: { zh: "八字命盤", en: "BaZi Chart" },
  day_master: { zh: "日主", en: "Day Master" },
  pillar_year: { zh: "年柱", en: "Year" },
  pillar_month: { zh: "月柱", en: "Month" },
  pillar_day: { zh: "日柱", en: "Day" },
  pillar_hour: { zh: "時柱", en: "Hour" },
  hidden_label: { zh: "藏", en: "Hidden" },
  // 日主 self in EN — keep using Chinese label inside the BaZi chart cell
  self_marker: { zh: "日主", en: "Self" },

  // Elements
  elements_title: { zh: "五行分布", en: "Five-Element Distribution" },
  unit_pts: { zh: "分", en: "pts" },
  strongest: { zh: "最強", en: "Strongest" },
  weakest: { zh: "最弱", en: "Weakest" },
  favorable: { zh: "喜用神", en: "Favorable (喜用神)" },
  unfavorable: { zh: "忌神", en: "Unfavorable (忌神)" },

  // Dayun
  dayun_title: { zh: "大運 (十年運)", en: "DaYun · 10-Year Luck Cycles" },
  unit_age: { zh: "歲", en: "yrs" },
  current_dayun: { zh: "當前", en: "Now" },
  current_age: { zh: "當前年齡", en: "Current age" },

  // Liunian
  liunian_title: { zh: "流年 (逐年運勢)", en: "LiuNian · Year-by-Year" },
  this_year: { zh: "今年", en: "This year" },
  last_year: { zh: "去年", en: "Last year" },

  // Relationships
  branches_relations: { zh: "地支關係", en: "Branch Relationships" },

  // Prompt viewer
  initial_prompt_title: {
    zh: "命理分析提示詞 (複製到 ChatGPT / Claude / Gemini 等 LLM)",
    en: "Fortune-reading prompt (paste into ChatGPT / Claude / Gemini or other LLM)",
  },
  luck_scale_prompt_title: {
    zh: "運勢指數提示詞 (Luck Scale)",
    en: "Luck-scale prompt",
  },
  copy_system: { zh: "複製 System Prompt", en: "Copy System Prompt" },
  copy_user: { zh: "複製 User Prompt", en: "Copy User Prompt" },
  copy_all: { zh: "複製全部", en: "Copy All" },
  copied: { zh: "已複製!", en: "Copied!" },
  usage_title: { zh: "使用說明:", en: "How to use:" },
  usage_step_1: { zh: "複製上方的提示詞", en: "Copy the prompt above" },
  usage_step_2: {
    zh: "打開 ChatGPT、Claude、Gemini 或其他 LLM 界面",
    en: "Open ChatGPT, Claude, Gemini, or any other LLM",
  },
  usage_step_3: {
    zh: "將 System Prompt 設為系統指令 (若支持)",
    en: "Paste the System Prompt into system instructions (if supported)",
  },
  usage_step_4: {
    zh: "將 User Prompt 貼入對話框發送",
    en: "Paste the User Prompt into the chat and send",
  },

  // Footer
  footer_disclaimer: {
    zh: "本工具僅供參考，請勿迷信",
    en: "For reference only — please don't take it as deterministic advice",
  },
  footer_credit: {
    zh: "計算結果基於 lunar-typescript 農曆庫",
    en: "Calendar conversions via lunar-typescript",
  },
};

export function translate(key: string, locale: Locale): string {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[locale];
}
