"use client";

import type { Element } from "@/lib/bazi/types";
import { getElementBgColor, getElementTextColor } from "@/lib/bazi/elements";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

const ELEMENTS: Element[] = ["金", "木", "水", "火", "土"];

export default function ElementLegend() {
  const { t } = useLocale();

  return (
    <Card className="py-3">
      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="text-muted-foreground font-medium">{t("legend_label")}</span>
        {ELEMENTS.map((elem) => (
          <span
            key={elem}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold"
            style={{
              backgroundColor: getElementBgColor(elem),
              color: getElementTextColor(elem),
            }}
          >
            {elem}
          </span>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{t("legend_hint")}</span>
      </CardContent>
    </Card>
  );
}
