"use client";

import type { LiuNian } from "@/lib/bazi/types";
import { GAN_ELEMENT } from "@/lib/bazi/ganzhi";
import { getElementBgColor } from "@/lib/bazi/elements";

interface LiunianListProps {
  liunian: LiuNian[];
}

export default function LiunianList({ liunian }: LiunianListProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">流年 (逐年運勢)</h2>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
        {liunian.map((ly, index) => {
          const isCurrent = ly.year === currentYear;
          const element = GAN_ELEMENT[ly.gan];
          const bgColor = getElementBgColor(element);

          return (
            <div
              key={ly.year}
              className={`text-center p-2 rounded-lg transition-all ${
                isCurrent ? "ring-2 ring-green-500 ring-offset-2" : ""
              }`}
              style={{ backgroundColor: bgColor }}
            >
              <div className="text-xs text-gray-600">{ly.year}</div>
              <div className="text-lg font-bold">{ly.ganzhi}</div>
              {isCurrent && (
                <div className="text-xs text-green-600 font-medium">今年</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
