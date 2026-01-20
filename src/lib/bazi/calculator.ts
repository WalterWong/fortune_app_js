/**
 * BaZi Calculator - Main calculation engine
 * Uses lunar-typescript for calendar conversions
 */

import { Solar, Lunar } from "lunar-typescript";
import type {
  BaZiResult,
  FourPillars,
  Pillar,
  Gan,
  Zhi,
  Gender,
  DaYunCycle,
  LiuNian,
  Element,
  TenDeitiesMap,
  PillarTenDeity,
} from "./types";
import {
  GAN,
  ZHI,
  GAN_ELEMENT,
  ZHI_ELEMENT,
  HIDDEN_STEMS,
  ZODIAC,
  getGanIndex,
  getZhiIndex,
  getGanByIndex,
  getZhiByIndex,
  getHourBranch,
} from "./ganzhi";
import { getNayin, detectRelationships } from "./data";
import { getTenDeity, getHiddenStemDeities, DAY_MASTER_META } from "./tenDeities";
import { calculateElementScores, getFavorableElements } from "./elements";
import { calculateStrength } from "./strength";

/**
 * Main BaZi calculation function
 */
export function calculateBaZi(
  birthday: string,      // YYYY-MM-DD format
  birthTime?: string,    // HH:MM format (optional, defaults to 12:00)
  gender: Gender = "男"
): BaZiResult {
  // Parse date
  const [year, month, day] = birthday.split("-").map(Number);
  const time = birthTime || "12:00";
  const [hour, minute] = time.split(":").map(Number);

  // Create Solar date
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();

  // Get Eight Characters (BaZi) from lunar-typescript
  const eightChar = lunar.getEightChar();

  // Build four pillars
  const pillars = buildFourPillars(eightChar, time);

  // Get day master
  const dayMaster = pillars.day.gan;
  const dayMasterElement = GAN_ELEMENT[dayMaster];

  // Calculate relationships
  const branches: Zhi[] = [
    pillars.year.zhi,
    pillars.month.zhi,
    pillars.day.zhi,
    pillars.hour.zhi,
  ];
  const relationships = detectRelationships(branches);

  // Calculate ten deities
  const tenDeities = calculateTenDeities(pillars, dayMaster);

  // Calculate element scores
  const elementScores = calculateElementScores(pillars);

  // Calculate day master strength
  const strength = calculateStrength(pillars);

  // Get favorable/unfavorable elements
  const { favorable, unfavorable } = getFavorableElements(dayMasterElement, strength.isWeak);

  // Calculate DaYun (10-year cycles)
  const dayun = calculateDayun(eightChar, gender, year);

  // Calculate LiuNian (yearly fortune)
  const currentYear = new Date().getFullYear();
  const liunian = calculateLiunian(currentYear, 11);

  // Get zodiac
  const zodiac = ZODIAC[pillars.year.zhi];

  // Build birth info
  const birthInfo = {
    solarDate: birthday,
    lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    lunarMonth: lunar.getMonthInChinese(),
    lunarDay: lunar.getDayInChinese(),
    gender,
  };

  return {
    pillars,
    dayMaster,
    dayMasterElement,
    relationships,
    tenDeities,
    elementScores,
    dayun,
    liunian,
    strength,
    favorableElements: favorable,
    unfavorableElements: unfavorable,
    birthInfo,
    zodiac,
  };
}

/**
 * Build four pillars from EightChar object
 */
function buildFourPillars(eightChar: ReturnType<Lunar["getEightChar"]>, time: string): FourPillars {
  const yearGan = eightChar.getYearGan() as Gan;
  const yearZhi = eightChar.getYearZhi() as Zhi;
  const monthGan = eightChar.getMonthGan() as Gan;
  const monthZhi = eightChar.getMonthZhi() as Zhi;
  const dayGan = eightChar.getDayGan() as Gan;
  const dayZhi = eightChar.getDayZhi() as Zhi;
  const hourGan = eightChar.getTimeGan() as Gan;
  const hourZhi = eightChar.getTimeZhi() as Zhi;

  return {
    year: buildPillar(yearGan, yearZhi),
    month: buildPillar(monthGan, monthZhi),
    day: buildPillar(dayGan, dayZhi),
    hour: buildPillar(hourGan, hourZhi),
  };
}

/**
 * Build a single pillar
 */
function buildPillar(gan: Gan, zhi: Zhi): Pillar {
  return {
    gan,
    zhi,
    ganzhi: `${gan}${zhi}`,
    nayin: getNayin(gan, zhi),
    ganElement: GAN_ELEMENT[gan],
    zhiElement: ZHI_ELEMENT[zhi],
    hiddenStems: HIDDEN_STEMS[zhi].map(h => ({ stem: h.stem, weight: h.weight })),
  };
}

/**
 * Calculate ten deities for all pillars
 */
function calculateTenDeities(pillars: FourPillars, dayMaster: Gan): TenDeitiesMap {
  const buildPillarDeity = (pillar: Pillar): PillarTenDeity => ({
    stem: getTenDeity(dayMaster, pillar.gan),
    hiddenStems: getHiddenStemDeities(dayMaster, pillar.zhi).map(h => ({
      stem: h.stem,
      deity: h.deity,
    })),
  });

  return {
    year: buildPillarDeity(pillars.year),
    month: buildPillarDeity(pillars.month),
    day: buildPillarDeity(pillars.day),
    hour: buildPillarDeity(pillars.hour),
  };
}

/**
 * Calculate DaYun (10-year luck cycles)
 */
function calculateDayun(
  eightChar: ReturnType<Lunar["getEightChar"]>,
  gender: Gender,
  birthYear: number
): DaYunCycle[] {
  const cycles: DaYunCycle[] = [];

  // Get DaYun from lunar-typescript
  // getYun expects 1 for male, 0 for female
  const yun = eightChar.getYun(gender === "男" ? 1 : 0);
  const dayunList = yun.getDaYun();

  for (let i = 0; i < Math.min(10, dayunList.length); i++) {
    const dy = dayunList[i];
    const startAge = dy.getStartAge();
    const endAge = dy.getEndAge();
    const gan = dy.getGanZhi().substring(0, 1) as Gan;
    const zhi = dy.getGanZhi().substring(1, 2) as Zhi;

    cycles.push({
      cycle: i + 1,
      ageRange: `${startAge}-${endAge}`,
      pillar: dy.getGanZhi(),
      gan,
      zhi,
      element: GAN_ELEMENT[gan],
    });
  }

  return cycles;
}

/**
 * Calculate LiuNian (yearly fortune) for next N years
 */
function calculateLiunian(startYear: number, count: number): LiuNian[] {
  const result: LiuNian[] = [];

  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    // Use Feb 10 to ensure we're definitely after LiChun (立春)
    // LiChun typically falls between Feb 3-5, using Feb 10 is safe
    const solar = Solar.fromYmd(year, 2, 10);
    const lunar = solar.getLunar();
    const yearGanZhi = lunar.getYearInGanZhiExact();
    const gan = yearGanZhi.substring(0, 1) as Gan;
    const zhi = yearGanZhi.substring(1, 2) as Zhi;

    result.push({
      year,
      ganzhi: yearGanZhi,
      gan,
      zhi,
    });
  }

  return result;
}

/**
 * Get current age from birth year
 */
export function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

/**
 * Find current DaYun cycle based on age
 */
export function getCurrentDayunIndex(dayun: DaYunCycle[], age: number): number {
  for (let i = 0; i < dayun.length; i++) {
    const [start, end] = dayun[i].ageRange.split("-").map(Number);
    if (age >= start && age <= end) {
      return i;
    }
  }
  return 0;
}
