"use client";

import type { LiuNian } from "@/lib/bazi/types";
import { GAN_ELEMENT } from "@/lib/bazi/ganzhi";
import { getElementBgColor, getElementTextColor } from "@/lib/bazi/elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

interface LiunianListProps {
  liunian: LiuNian[];
}

export default function LiunianList({ liunian }: LiunianListProps) {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("liunian_title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {liunian.map((ly) => {
            const isCurrent = ly.year === currentYear;
            const isPast = ly.year < currentYear;
            const element = GAN_ELEMENT[ly.gan];
            const bgColor = getElementBgColor(element);
            const textColor = getElementTextColor(element);

            return (
              <div
                key={ly.year}
                className={`text-center p-2 rounded-lg transition-all ${
                  isCurrent ? "ring-2 ring-green-600 ring-offset-2" : ""
                } ${isPast ? "opacity-60" : ""}`}
                style={{ backgroundColor: bgColor }}
              >
                <div className="text-xs font-medium" style={{ color: textColor }}>{ly.year}</div>
                <div className="text-lg font-bold" style={{ color: textColor }}>{ly.ganzhi}</div>
                {isCurrent && (
                  <div className="text-xs text-green-700 font-semibold">{t("this_year")}</div>
                )}
                {isPast && (
                  <div className="text-xs font-medium" style={{ color: textColor }}>
                    {t("last_year")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
