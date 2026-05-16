"use client";

import type { DaYunCycle } from "@/lib/bazi/types";
import { getElementBgColor, getElementTextColor } from "@/lib/bazi/elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

interface DayunTimelineProps {
  dayun: DaYunCycle[];
  currentAge?: number;
}

export default function DayunTimeline({ dayun, currentAge }: DayunTimelineProps) {
  const { t } = useLocale();

  const getCurrentCycleIndex = () => {
    if (!currentAge) return -1;
    for (let i = 0; i < dayun.length; i++) {
      const [start, end] = dayun[i].ageRange.split("-").map(Number);
      if (currentAge >= start && currentAge <= end) return i;
    }
    return -1;
  };

  const currentIndex = getCurrentCycleIndex();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dayun_title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {dayun.slice(0, 10).map((cycle, index) => {
            const isCurrent = index === currentIndex;
            const bgColor = getElementBgColor(cycle.element);
            const textColor = getElementTextColor(cycle.element);

            return (
              <div
                key={index}
                className={`text-center p-2 rounded-lg transition-all ${
                  isCurrent ? "ring-2 ring-purple-600 ring-offset-2" : ""
                }`}
                style={{ backgroundColor: bgColor }}
              >
                <div className="text-lg font-bold leading-tight" style={{ color: textColor }}>
                  {cycle.pillar}
                </div>
                <div className="text-xs font-medium mt-1" style={{ color: textColor }}>
                  {cycle.ageRange} {t("unit_age")}
                </div>
                <div className="text-[10px] opacity-80" style={{ color: textColor }}>
                  {cycle.startYear}–{cycle.endYear}
                </div>
                {isCurrent && (
                  <div className="text-xs text-purple-700 font-semibold mt-1">{t("current_dayun")}</div>
                )}
              </div>
            );
          })}
        </div>

        {currentAge && (
          <div className="mt-4 text-sm text-muted-foreground font-medium">
            {t("current_age")}: {currentAge} {t("unit_age")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
