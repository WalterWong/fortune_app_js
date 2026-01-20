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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Remove all non-digits
    const digits = input.replace(/\D/g, "");

    // Auto-format: yyyy-mm-dd
    let formatted = "";
    if (digits.length <= 4) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }

    setBirthday(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday) return;
    onCalculate(birthday, birthTime || undefined, gender);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          出生日期 (公曆)
        </label>
        <input
          type="text"
          value={birthday}
          onChange={handleDateChange}
          placeholder="yyyy-mm-dd"
          pattern="\d{4}-\d{2}-\d{2}"
          maxLength={10}
          className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-600 mt-1">輸入數字自動格式化，如: 19900101 → 1990-01-01</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          出生時間 (可選)
        </label>
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        <p className="text-xs text-gray-600 mt-1">不填則默認為中午12:00</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          性別
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center text-gray-900">
            <input
              type="radio"
              value="男"
              checked={gender === "男"}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="mr-2 accent-blue-600"
            />
            男
          </label>
          <label className="flex items-center text-gray-900">
            <input
              type="radio"
              value="女"
              checked={gender === "女"}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="mr-2 accent-blue-600"
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
