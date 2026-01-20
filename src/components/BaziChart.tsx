"use client";

import type { FourPillars, TenDeitiesMap } from "@/lib/bazi/types";
import { getElementBgColor } from "@/lib/bazi/elements";

interface BaziChartProps {
  pillars: FourPillars;
  tenDeities: TenDeitiesMap;
  dayMaster: string;
  strength: string;
}

export default function BaziChart({ pillars, tenDeities, dayMaster, strength }: BaziChartProps) {
  const pillarKeys = ["year", "month", "day", "hour"] as const;
  const pillarLabels = ["年柱", "月柱", "日柱", "時柱"];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">八字命盤</h2>
        <div className="text-sm">
          <span className="text-gray-600">日主: </span>
          <span className="font-bold">{dayMaster}</span>
          <span className="ml-2 px-2 py-1 rounded text-xs" style={{
            backgroundColor: strength === "强" ? "#90EE90" : "#FFB6C1"
          }}>
            {strength}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {pillarKeys.map((key, index) => {
          const pillar = pillars[key];
          const deity = tenDeities[key];
          const bgColor = getElementBgColor(pillar.ganElement);

          return (
            <div key={key} className="text-center">
              <div className="text-sm text-gray-600 mb-2">{pillarLabels[index]}</div>

              {/* Ten Deity */}
              <div className="text-xs text-purple-600 mb-1">
                {key === "day" ? "日主" : deity.stem}
              </div>

              {/* Heavenly Stem */}
              <div
                className="text-2xl font-bold py-2 rounded-t-lg"
                style={{ backgroundColor: bgColor }}
              >
                {pillar.gan}
              </div>

              {/* Earthly Branch */}
              <div
                className="text-2xl font-bold py-2 rounded-b-lg border-t border-white"
                style={{ backgroundColor: getElementBgColor(pillar.zhiElement) }}
              >
                {pillar.zhi}
              </div>

              {/* NaYin */}
              <div className="text-xs text-gray-500 mt-2">{pillar.nayin}</div>

              {/* Hidden Stems */}
              <div className="text-xs text-gray-400 mt-1">
                藏: {pillar.hiddenStems.map(h => h.stem).join("")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
