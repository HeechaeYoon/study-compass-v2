import { describe, expect, it } from "vitest";
import { AXES } from "../../src/data/axes";
import { QUESTIONS } from "../../src/data/questions";
import {
  computeAxisBounds,
  normalizeScore,
  scoreAnswers,
  toAxisLabel,
  toDisplayScore,
} from "../../src/domain/scoring";
import { validateAnswers } from "../../src/domain/validation";

const minimumAnswers = {
  Q01: 1,
  Q02: 1,
  Q03: 1,
  Q04: 1,
  Q05: 1,
  Q06: "A",
  Q07: 1,
  Q08: 1,
  Q09: 1,
  Q10: 1,
  Q11: 1,
  Q12: 1,
  Q13: "A",
  Q14: 1,
  Q15: "A",
  Q16: "A",
};

const mixedAnswers = {
  Q01: 4,
  Q02: 3,
  Q03: 4,
  Q04: 4,
  Q05: 3,
  Q06: "D",
  Q07: 3,
  Q08: 4,
  Q09: 3,
  Q10: 4,
  Q11: 3,
  Q12: 3,
  Q13: "A",
  Q14: 3,
  Q15: "D",
  Q16: "B",
};

describe("scoring", () => {
  it("derives axis bounds from question data", () => {
    const bounds = computeAxisBounds(QUESTIONS);
    expect(bounds.min.P).toBeLessThan(bounds.max.P);
    expect(bounds.min.E).toBeLessThan(bounds.max.E);
    expect(bounds.min.U).toBeLessThan(bounds.max.U);
    expect(bounds.min.M).toBeLessThan(bounds.max.M);
    expect(bounds.min.H).toBeLessThan(bounds.max.H);
  });

  it("validates the 16-question answer map", () => {
    expect(validateAnswers(QUESTIONS, minimumAnswers).ok).toBe(true);
    expect(QUESTIONS).toHaveLength(16);
    expect(QUESTIONS.filter((question) => question.type === "likert")).toHaveLength(12);
    expect(QUESTIONS.filter((question) => question.type === "scenario")).toHaveLength(4);
  });

  it("keeps normalized scores in range", () => {
    const scores = scoreAnswers(QUESTIONS, mixedAnswers);
    for (const axis of AXES) {
      expect(scores[axis]).toBeGreaterThanOrEqual(0);
      expect(scores[axis]).toBeLessThanOrEqual(100);
    }
  });

  it("applies label thresholds exactly", () => {
    expect(toAxisLabel(0)).toBe("성장 포인트");
    expect(toAxisLabel(39)).toBe("성장 포인트");
    expect(toAxisLabel(40)).toBe("균형");
    expect(toAxisLabel(69)).toBe("균형");
    expect(toAxisLabel(70)).toBe("강점");
    expect(toAxisLabel(100)).toBe("강점");
  });

  it("maps display scores from 0-100 to 1.0-5.0", () => {
    expect(toDisplayScore(0)).toBe(1);
    expect(toDisplayScore(100)).toBe(5);
    expect(toDisplayScore(80)).toBe(4.2);
  });

  it("normalizes defensively when max equals min", () => {
    expect(normalizeScore(4, 4, 4)).toBe(0);
  });
});
