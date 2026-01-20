"use client";

import { useState } from "react";
import BirthInput from "@/components/BirthInput";
import BaziChart from "@/components/BaziChart";
import ElementChart from "@/components/ElementChart";
import DayunTimeline from "@/components/DayunTimeline";
import LiunianList from "@/components/LiunianList";
import PromptViewer from "@/components/PromptViewer";
import { calculateBaZi, calculateAge, type BaZiResult, type Gender } from "@/lib/bazi";
import { buildInitialPrompt, buildLuckScalePrompt } from "@/lib/prompts";

export default function Home() {
  const [result, setResult] = useState<BaZiResult | null>(null);
  const [prompts, setPrompts] = useState<{
    initial: { systemPrompt: string; userPrompt: string } | null;
    luckScale: { systemPrompt: string; userPrompt: string } | null;
  }>({ initial: null, luckScale: null });
  const [birthday, setBirthday] = useState<string>("");
  const [gender, setGender] = useState<Gender>("男");
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = (birthdayInput: string, birthTime: string | undefined, genderInput: Gender) => {
    setIsLoading(true);
    setBirthday(birthdayInput);
    setGender(genderInput);

    try {
      // Calculate BaZi
      const baziResult = calculateBaZi(birthdayInput, birthTime, genderInput);
      setResult(baziResult);

      // Generate prompts
      const initialPrompt = buildInitialPrompt(baziResult, genderInput, birthdayInput, false);
      const luckScalePrompt = buildLuckScalePrompt(baziResult, genderInput, birthdayInput);

      setPrompts({
        initial: initialPrompt,
        luckScale: luckScalePrompt,
      });
    } catch (error) {
      console.error("Calculation error:", error);
      alert("計算出錯，請檢查輸入的日期是否有效");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPrompts({ initial: null, luckScale: null });
    setBirthday("");
  };

  const currentAge = birthday ? calculateAge(parseInt(birthday.split("-")[0])) : undefined;

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DestinyAI 八字排盤</h1>
          <p className="text-gray-700">專業八字命理分析工具 · 純前端計算</p>
        </div>

        {!result ? (
          /* Input Form */
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">輸入出生資料</h2>
            <BirthInput onCalculate={handleCalculate} isLoading={isLoading} />
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                ← 重新排盤
              </button>
            </div>

            {/* Birth Info */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-900">
                <div>
                  <span className="text-gray-700 font-medium">性別: </span>
                  <span className="font-semibold">{gender}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">公曆: </span>
                  <span className="font-semibold">{birthday}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">農曆: </span>
                  <span className="font-semibold">{result.birthInfo.lunarDate}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">生肖: </span>
                  <span className="font-semibold">{result.zodiac}</span>
                </div>
              </div>
            </div>

            {/* BaZi Chart */}
            <BaziChart
              pillars={result.pillars}
              tenDeities={result.tenDeities}
              dayMaster={`${result.dayMaster} (${result.dayMasterElement})`}
              strength={result.strength.assessment}
            />

            {/* Element Distribution */}
            <ElementChart
              scores={result.elementScores}
              favorableElements={result.favorableElements}
              unfavorableElements={result.unfavorableElements}
            />

            {/* DaYun Timeline */}
            <DayunTimeline dayun={result.dayun} currentAge={currentAge} />

            {/* LiuNian List */}
            <LiunianList liunian={result.liunian} />

            {/* Relationships */}
            {(result.relationships.he.length > 0 ||
              result.relationships.chong.length > 0 ||
              result.relationships.xing.length > 0 ||
              result.relationships.hai.length > 0 ||
              result.relationships.po.length > 0) && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">地支關係</h2>
                <div className="flex flex-wrap gap-2">
                  {result.relationships.he.map((r, i) => (
                    <span key={`he-${i}`} className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm font-medium">
                      {r}
                    </span>
                  ))}
                  {result.relationships.chong.map((r, i) => (
                    <span key={`chong-${i}`} className="px-3 py-1 bg-red-200 text-red-900 rounded-full text-sm font-medium">
                      {r}
                    </span>
                  ))}
                  {result.relationships.xing.map((r, i) => (
                    <span key={`xing-${i}`} className="px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm font-medium">
                      {r}
                    </span>
                  ))}
                  {result.relationships.hai.map((r, i) => (
                    <span key={`hai-${i}`} className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-medium">
                      {r}
                    </span>
                  ))}
                  {result.relationships.po.map((r, i) => (
                    <span key={`po-${i}`} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prompts Section */}
            {prompts.initial && (
              <PromptViewer
                systemPrompt={prompts.initial.systemPrompt}
                userPrompt={prompts.initial.userPrompt}
                title="命理分析提示詞 (複製到 ChatGPT/Claude)"
              />
            )}

            {prompts.luckScale && (
              <PromptViewer
                systemPrompt={prompts.luckScale.systemPrompt}
                userPrompt={prompts.luckScale.userPrompt}
                title="運勢指數提示詞 (Luck Scale)"
              />
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-700 mt-8">
              <p>本工具僅供參考，請勿迷信</p>
              <p className="mt-1">計算結果基於 lunar-typescript 農曆庫</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
