"use client";

import type { FourPillars, TenDeitiesMap } from "@/lib/bazi/types";
import { getElementBgColor, getElementTextColor } from "@/lib/bazi/elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

interface BaziChartProps {
  pillars: FourPillars;
  tenDeities: TenDeitiesMap;
  dayMaster: string;
  strength: string;
}

export default function BaziChart({ pillars, tenDeities, dayMaster, strength }: BaziChartProps) {
  const { t } = useLocale();
  const pillarKeys = ["year", "month", "day", "hour"] as const;
  const pillarLabelKeys = ["pillar_year", "pillar_month", "pillar_day", "pillar_hour"] as const;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("bazi_title")}</CardTitle>
        <div className="text-sm">
          <span className="text-muted-foreground font-medium">{t("day_master")}: </span>
          <span className="font-bold text-foreground">{dayMaster}</span>
          <span
            className="ml-2 px-2 py-1 rounded text-xs font-semibold"
            style={{
              backgroundColor: strength === "強" ? "#86EFAC" : "#FCA5A5",
              color: strength === "強" ? "#14532D" : "#7F1D1D",
            }}
          >
            {strength}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {pillarKeys.map((key, index) => {
            const pillar = pillars[key];
            const deity = tenDeities[key];
            const ganBgColor = getElementBgColor(pillar.ganElement);
            const ganTextColor = getElementTextColor(pillar.ganElement);
            const zhiBgColor = getElementBgColor(pillar.zhiElement);
            const zhiTextColor = getElementTextColor(pillar.zhiElement);

            return (
              <div key={key} className="text-center">
                <div className="text-sm text-muted-foreground font-medium mb-2">
                  {t(pillarLabelKeys[index])}
                </div>

                <div className="text-xs text-purple-700 font-medium mb-1">
                  {key === "day" ? t("self_marker") : deity.stem}
                </div>

                <div
                  className="text-2xl font-bold py-2 rounded-t-lg"
                  style={{ backgroundColor: ganBgColor, color: ganTextColor }}
                >
                  {pillar.gan}
                </div>

                <div
                  className="text-2xl font-bold py-2 rounded-b-lg border-t-2 border-white"
                  style={{ backgroundColor: zhiBgColor, color: zhiTextColor }}
                >
                  {pillar.zhi}
                </div>

                <div className="text-xs text-muted-foreground mt-2">{pillar.nayin}</div>

                <div className="text-xs text-muted-foreground mt-1">
                  {t("hidden_label")}: {pillar.hiddenStems.map((h) => h.stem).join("")}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
