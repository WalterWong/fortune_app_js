"use client";

import { useState, useRef } from "react";
import type { Gender } from "@/lib/bazi/types";

interface BirthInputProps {
  onCalculate: (birthday: string, birthTime: string | undefined, gender: Gender) => void;
  isLoading?: boolean;
}

export default function BirthInput({ onCalculate, isLoading }: BirthInputProps) {
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState<Gender>("男");
  const datePickerRef = useRef<HTMLInputElement>(null);

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

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Date picker returns yyyy-mm-dd format directly
    setBirthday(e.target.value);
  };

  const openDatePicker = () => {
    datePickerRef.current?.showPicker();
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
        <div className="relative">
          <input
            type="text"
            value={birthday}
            onChange={handleDateChange}
            placeholder="yyyy-mm-dd"
            pattern="\d{4}-\d{2}-\d{2}"
            maxLength={10}
            className="w-full px-4 py-2 pr-12 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
          />
          {/* Hidden date picker input */}
          <input
            ref={datePickerRef}
            type="date"
            value={birthday}
            onChange={handleDatePickerChange}
            min="1900-01-01"
            max="2100-12-31"
            className="absolute inset-0 opacity-0 w-0 h-0"
            tabIndex={-1}
          />
          {/* Calendar icon button */}
          <button
            type="button"
            onClick={openDatePicker}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
            title="選擇日期"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">輸入數字自動格式化，或點擊日曆圖示選擇日期</p>
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
