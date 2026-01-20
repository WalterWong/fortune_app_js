"use client";

import type { ElementScores, Element } from "@/lib/bazi/types";
import { getElementColor, getElementBgColor } from "@/lib/bazi/elements";

interface ElementChartProps {
  scores: ElementScores;
  favorableElements: Element[];
  unfavorableElements: Element[];
}

export default function ElementChart({ scores, favorableElements, unfavorableElements }: ElementChartProps) {
  const elements: Element[] = ["金", "木", "水", "火", "土"];
  const maxScore = Math.max(...Object.values(scores.scores));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">五行分布</h2>

      <div className="space-y-3">
        {elements.map((elem) => {
          const score = scores.scores[elem];
          const percentage = (score / maxScore) * 100;
          const isFavorable = favorableElements.includes(elem);
          const isUnfavorable = unfavorableElements.includes(elem);

          return (
            <div key={elem} className="flex items-center">
              <div className="w-8 text-center font-bold" style={{ color: getElementColor(elem) }}>
                {elem}
              </div>
              <div className="flex-1 mx-3">
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getElementColor(elem),
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm">
                {score.toFixed(1)}分
              </div>
              <div className="w-12 text-center">
                {elem === scores.strongest && (
                  <span className="text-xs px-1 py-0.5 bg-green-100 text-green-700 rounded">最強</span>
                )}
                {elem === scores.weakest && (
                  <span className="text-xs px-1 py-0.5 bg-red-100 text-red-700 rounded">最弱</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-600">喜用神: </span>
            <span className="font-medium text-green-600">
              {favorableElements.join("、")}
            </span>
          </div>
          <div>
            <span className="text-gray-600">忌神: </span>
            <span className="font-medium text-red-600">
              {unfavorableElements.join("、")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
