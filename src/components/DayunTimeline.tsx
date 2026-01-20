"use client";

import type { DaYunCycle } from "@/lib/bazi/types";
import { getElementBgColor, getElementTextColor } from "@/lib/bazi/elements";

interface DayunTimelineProps {
  dayun: DaYunCycle[];
  currentAge?: number;
}

export default function DayunTimeline({ dayun, currentAge }: DayunTimelineProps) {
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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">大運 (十年運)</h2>

      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {dayun.slice(0, 10).map((cycle, index) => {
          const isCurrent = index === currentIndex;
          const bgColor = getElementBgColor(cycle.element);
          const textColor = getElementTextColor(cycle.element);

          return (
            <div
              key={index}
              className={`text-center p-2 rounded-lg transition-all ${
                isCurrent ? "ring-2 ring-blue-600 ring-offset-2" : ""
              }`}
              style={{ backgroundColor: bgColor }}
            >
              <div className="text-lg font-bold" style={{ color: textColor }}>{cycle.pillar}</div>
              <div className="text-xs font-medium" style={{ color: textColor }}>{cycle.ageRange}歲</div>
              {isCurrent && (
                <div className="text-xs text-blue-700 font-semibold mt-1">當前</div>
              )}
            </div>
          );
        })}
      </div>

      {currentAge && (
        <div className="mt-4 text-sm text-gray-700 font-medium">
          當前年齡: {currentAge}歲
        </div>
      )}
    </div>
  );
}
