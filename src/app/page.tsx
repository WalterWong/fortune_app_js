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
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DestinyAI 八字排盤</h1>
          <p className="text-gray-600">專業八字命理分析工具 · 純前端計算</p>
        </div>

        {!result ? (
          /* Input Form */
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">輸入出生資料</h2>
            <BirthInput onCalculate={handleCalculate} isLoading={isLoading} />
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 重新排盤
              </button>
            </div>

            {/* Birth Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-gray-600">性別: </span>
                  <span className="font-medium">{gender}</span>
                </div>
                <div>
                  <span className="text-gray-600">公曆: </span>
                  <span className="font-medium">{birthday}</span>
                </div>
                <div>
                  <span className="text-gray-600">農曆: </span>
                  <span className="font-medium">{result.birthInfo.lunarDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">生肖: </span>
                  <span className="font-medium">{result.zodiac}</span>
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">地支關係</h2>
                <div className="flex flex-wrap gap-2">
                  {result.relationships.he.map((r, i) => (
                    <span key={`he-${i}`} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {r}
                    </span>
                  ))}
                  {result.relationships.chong.map((r, i) => (
                    <span key={`chong-${i}`} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {r}
                    </span>
                  ))}
                  {result.relationships.xing.map((r, i) => (
                    <span key={`xing-${i}`} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {r}
                    </span>
                  ))}
                  {result.relationships.hai.map((r, i) => (
                    <span key={`hai-${i}`} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      {r}
                    </span>
                  ))}
                  {result.relationships.po.map((r, i) => (
                    <span key={`po-${i}`} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
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
            <div className="text-center text-sm text-gray-500 mt-8">
              <p>本工具僅供參考，請勿迷信</p>
              <p className="mt-1">計算結果基於 lunar-typescript 農曆庫</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
