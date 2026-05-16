import { describe, it, expect } from "vitest";
import { calculateBaZi } from "@/lib/bazi";

describe("calculateBaZi — round-trip regression", () => {
  it("returns stable four pillars for 1990-01-15 12:00 男", () => {
    const r = calculateBaZi("1990-01-15", "12:00", "男");

    expect(r.pillars.year.ganzhi).toBe("己巳");
    expect(r.pillars.month.ganzhi).toBe("丁丑");
    expect(r.pillars.day.ganzhi).toBe("庚辰");
    expect(r.pillars.hour.ganzhi).toBe("壬午");

    expect(r.dayMaster).toBe("庚");
    expect(r.dayMasterElement).toBe("金");
    expect(r.zodiac).toBe("蛇");
  });

  it("falls back to 12:00 when birthTime is omitted", () => {
    const a = calculateBaZi("2000-06-30", undefined, "女");
    const b = calculateBaZi("2000-06-30", "12:00", "女");
    expect(a.pillars.hour.ganzhi).toBe(b.pillars.hour.ganzhi);
  });

  it("produces 10 dayun cycles and a non-empty liunian list", () => {
    const r = calculateBaZi("1990-01-15", "12:00", "男");
    expect(r.dayun).toHaveLength(10);
    expect(r.liunian.length).toBeGreaterThan(0);
  });
});
