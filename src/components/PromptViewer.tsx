"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

interface PromptViewerProps {
  systemPrompt: string;
  userPrompt: string;
  title?: string;
}

export default function PromptViewer({
  systemPrompt,
  userPrompt,
  title,
}: PromptViewerProps) {
  const { t } = useLocale();
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
    <Card className="py-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors rounded-t-xl"
      >
        <h2 className="text-lg font-semibold">{title ?? t("initial_prompt_title")}</h2>
        <ChevronDown
          className={`size-5 text-muted-foreground transform transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <CardContent className="pb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(systemPrompt, "system")}
            >
              {copied === "system" ? t("copied") : t("copy_system")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(userPrompt, "user")}
            >
              {copied === "user" ? t("copied") : t("copy_user")}
            </Button>
            <Button size="sm" onClick={() => copyToClipboard(combinedPrompt, "all")}>
              {copied === "all" ? t("copied") : t("copy_all")}
            </Button>
          </div>

          <div className="p-4 bg-amber-100 rounded-lg text-sm text-amber-900 border border-amber-200">
            <p className="font-semibold mb-1">{t("usage_title")}</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>{t("usage_step_1")}</li>
              <li>{t("usage_step_2")}</li>
              <li>{t("usage_step_3")}</li>
              <li>{t("usage_step_4")}</li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">System Prompt</h3>
            <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto border">
              {systemPrompt}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">User Prompt</h3>
            <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto border">
              {userPrompt}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
