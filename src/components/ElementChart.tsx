"use client";

import type { ElementScores, Element } from "@/lib/bazi/types";
import { getElementColor } from "@/lib/bazi/elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

interface ElementChartProps {
  scores: ElementScores;
  favorableElements: Element[];
  unfavorableElements: Element[];
}

export default function ElementChart({
  scores,
  favorableElements,
  unfavorableElements,
}: ElementChartProps) {
  const { t } = useLocale();
  const elements: Element[] = ["金", "木", "水", "火", "土"];
  const maxScore = Math.max(...Object.values(scores.scores));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("elements_title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {elements.map((elem) => {
            const score = scores.scores[elem];
            const percentage = (score / maxScore) * 100;

            return (
              <div key={elem} className="flex items-center">
                <div className="w-8 text-center font-bold" style={{ color: getElementColor(elem) }}>
                  {elem}
                </div>
                <div className="flex-1 mx-3">
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getElementColor(elem),
                      }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium">
                  {score.toFixed(1)} {t("unit_pts")}
                </div>
                <div className="w-20 text-center">
                  {elem === scores.strongest && (
                    <span className="text-xs px-1.5 py-0.5 bg-green-200 text-green-900 rounded font-medium">{t("strongest")}</span>
                  )}
                  {elem === scores.weakest && (
                    <span className="text-xs px-1.5 py-0.5 bg-red-200 text-red-900 rounded font-medium">{t("weakest")}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-muted-foreground font-medium">{t("favorable")}: </span>
              <span className="font-semibold text-green-700">{favorableElements.join("、")}</span>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">{t("unfavorable")}: </span>
              <span className="font-semibold text-red-700">{unfavorableElements.join("、")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
