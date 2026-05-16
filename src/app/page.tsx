"use client";

import { useEffect, useState } from "react";
import BirthInput from "@/components/BirthInput";
import BaziChart from "@/components/BaziChart";
import ElementChart from "@/components/ElementChart";
import DayunTimeline from "@/components/DayunTimeline";
import LiunianList from "@/components/LiunianList";
import ElementLegend from "@/components/ElementLegend";
import PromptViewer from "@/components/PromptViewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { calculateBaZi, calculateAge, type BaZiResult, type Gender } from "@/lib/bazi";
import { buildInitialPrompt, buildLuckScalePrompt } from "@/lib/prompts";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export default function Home() {
  const { locale, setLocale, t } = useLocale();
  const [result, setResult] = useState<BaZiResult | null>(null);
  const [prompts, setPrompts] = useState<{
    initial: { systemPrompt: string; userPrompt: string } | null;
    luckScale: { systemPrompt: string; userPrompt: string } | null;
  }>({ initial: null, luckScale: null });
  const [birthday, setBirthday] = useState<string>("");
  const [gender, setGender] = useState<Gender>("男");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (
    birthdayInput: string,
    birthTime: string | undefined,
    genderInput: Gender
  ) => {
    setIsLoading(true);
    setError(null);
    setBirthday(birthdayInput);
    setGender(genderInput);

    try {
      const baziResult = calculateBaZi(birthdayInput, birthTime, genderInput);
      setResult(baziResult);

      const initialPrompt = buildInitialPrompt(baziResult, genderInput, birthdayInput, false, locale);
      const luckScalePrompt = buildLuckScalePrompt(baziResult, genderInput, birthdayInput, locale);

      setPrompts({ initial: initialPrompt, luckScale: luckScalePrompt });
    } catch (err) {
      console.error("Calculation error:", err);
      setError(t("err_invalid_date"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPrompts({ initial: null, luckScale: null });
    setBirthday("");
    setError(null);
  };

  const currentAge = birthday ? calculateAge(parseInt(birthday.split("-")[0])) : undefined;

  // When locale flips after a calculation, regenerate prompts in the new language.
  // The chart data is locale-agnostic — only the prompt templates differ.
  useEffect(() => {
    if (!result || !birthday) return;
    setPrompts({
      initial: buildInitialPrompt(result, gender, birthday, false, locale),
      luckScale: buildLuckScalePrompt(result, gender, birthday, locale),
    });
  }, [locale, result, gender, birthday]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            {t("app_title")}
          </h1>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-gray-600">
              {t("subtitle_pure_client")}
            </span>
            <div
              role="group"
              aria-label="Language"
              className="inline-flex items-center rounded-md border bg-background overflow-hidden"
            >
              {(["zh", "en"] as const).map((code) => {
                const label = code === "zh" ? "中" : "EN";
                const active = locale === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    aria-pressed={active}
                    title={code === "zh" ? "切換到中文" : "Switch to English"}
                    className={cn(
                      "px-3 py-1 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {!result ? (
          /* Input Form */
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl text-center">{t("landing_card_title")}</CardTitle>
                <CardDescription className="text-center">
                  {t("landing_card_desc")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <BirthInput onCalculate={handleCalculate} isLoading={isLoading} />
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="font-semibold text-lg mb-3">{t("about_title")}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t("about_body")}</p>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={handleReset} className="gap-2">
                <ArrowLeft className="size-4" />
                {t("btn_reset")}
              </Button>
            </div>

            {/* Birth Info */}
            <Card>
              <CardContent>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-900">
                  <div>
                    <span className="text-gray-700 font-medium">{t("label_gender")}: </span>
                    <span className="font-semibold">
                      {gender === "男" ? t("gender_male") : t("gender_female")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">{t("label_solar")}: </span>
                    <span className="font-semibold">{birthday}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">{t("label_lunar")}: </span>
                    <span className="font-semibold">{result.birthInfo.lunarDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">{t("label_zodiac")}: </span>
                    <span className="font-semibold">{result.zodiac}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ElementLegend />

            <BaziChart
              pillars={result.pillars}
              tenDeities={result.tenDeities}
              dayMaster={`${result.dayMaster} (${result.dayMasterElement})`}
              strength={result.strength.assessment}
            />

            <ElementChart
              scores={result.elementScores}
              favorableElements={result.favorableElements}
              unfavorableElements={result.unfavorableElements}
            />

            <DayunTimeline dayun={result.dayun} currentAge={currentAge} />

            <LiunianList liunian={result.liunian} />

            {(result.relationships.he.length > 0 ||
              result.relationships.chong.length > 0 ||
              result.relationships.xing.length > 0 ||
              result.relationships.hai.length > 0 ||
              result.relationships.po.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("branches_relations")}</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            {prompts.initial && (
              <PromptViewer
                systemPrompt={prompts.initial.systemPrompt}
                userPrompt={prompts.initial.userPrompt}
                title={t("initial_prompt_title")}
              />
            )}

            {prompts.luckScale && (
              <PromptViewer
                systemPrompt={prompts.luckScale.systemPrompt}
                userPrompt={prompts.luckScale.userPrompt}
                title={t("luck_scale_prompt_title")}
              />
            )}

            <div className="text-center text-sm text-gray-600 mt-8">
              <p>{t("footer_disclaimer")}</p>
              <p className="mt-1">{t("footer_credit")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
