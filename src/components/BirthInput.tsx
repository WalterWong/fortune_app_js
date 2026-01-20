"use client";

import { useState } from "react";
import type { Gender } from "@/lib/bazi/types";

interface BirthInputProps {
  onCalculate: (birthday: string, birthTime: string | undefined, gender: Gender) => void;
  isLoading?: boolean;
}

export default function BirthInput({ onCalculate, isLoading }: BirthInputProps) {
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState<Gender>("男");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday) return;
    onCalculate(birthday, birthTime || undefined, gender);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          出生日期 (公曆)
        </label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          min="1900-01-01"
          max="2100-12-31"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          出生時間 (可選)
        </label>
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">不填則默認為中午12:00</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          性別
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="男"
              checked={gender === "男"}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="mr-2"
            />
            男
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="女"
              checked={gender === "女"}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="mr-2"
            />
            女
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={!birthday || isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "計算中..." : "開始排盤"}
      </button>
    </form>
  );
}
