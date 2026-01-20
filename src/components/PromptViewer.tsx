"use client";

import { useState } from "react";

interface PromptViewerProps {
  systemPrompt: string;
  userPrompt: string;
  title?: string;
}

export default function PromptViewer({ systemPrompt, userPrompt, title = "命理分析提示詞" }: PromptViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<"system" | "user" | "all" | null>(null);

  const copyToClipboard = async (text: string, type: "system" | "user" | "all") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const combinedPrompt = `[System Prompt]\n${systemPrompt}\n\n[User Prompt]\n${userPrompt}`;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
      >
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-700 transform transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4">
          {/* Copy Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyToClipboard(systemPrompt, "system")}
              className="px-4 py-2 bg-blue-200 text-blue-900 rounded-lg text-sm font-medium hover:bg-blue-300 transition-colors"
            >
              {copied === "system" ? "已複製!" : "複製 System Prompt"}
            </button>
            <button
              onClick={() => copyToClipboard(userPrompt, "user")}
              className="px-4 py-2 bg-green-200 text-green-900 rounded-lg text-sm font-medium hover:bg-green-300 transition-colors"
            >
              {copied === "user" ? "已複製!" : "複製 User Prompt"}
            </button>
            <button
              onClick={() => copyToClipboard(combinedPrompt, "all")}
              className="px-4 py-2 bg-purple-200 text-purple-900 rounded-lg text-sm font-medium hover:bg-purple-300 transition-colors"
            >
              {copied === "all" ? "已複製!" : "複製全部"}
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-amber-100 rounded-lg text-sm text-amber-900 border border-amber-200">
            <p className="font-semibold mb-1">使用說明:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>複製上方的提示詞</li>
              <li>打開 ChatGPT、Claude 或其他 LLM 界面</li>
              <li>將 System Prompt 設為系統指令 (若支持)</li>
              <li>將 User Prompt 貼入對話框發送</li>
            </ol>
          </div>

          {/* System Prompt */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">System Prompt</h3>
            <pre className="p-4 bg-gray-100 rounded-lg text-sm text-gray-900 overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto border border-gray-200">
              {systemPrompt}
            </pre>
          </div>

          {/* User Prompt */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">User Prompt</h3>
            <pre className="p-4 bg-gray-100 rounded-lg text-sm text-gray-900 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto border border-gray-200">
              {userPrompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
