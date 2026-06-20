import { describe, expect, it } from "vitest";
import { createFixtureResult } from "../../src/app/fixtures";
import { buildAiPrompt, EMPTY_PROMPT_INPUTS } from "../../src/domain/prompt";

describe("AI prompt", () => {
  it("works with all optional inputs blank", () => {
    const prompt = buildAiPrompt(createFixtureResult(), EMPTY_PROMPT_INPUTS);
    expect(prompt).toContain("현재 답변 기준");
    expect(prompt).toContain("고정된 성격이 아니라");
    expect(prompt).toContain("아직 입력하지 않았습니다");
    expect(prompt).toContain("30~40분");
    expect(prompt).toContain("스스로 점검할 질문 3개");
    expect(prompt).toContain("후속 질문 예시 2개");
  });

  it("includes all optional inputs when set", () => {
    const prompt = buildAiPrompt(createFixtureResult(), {
      subject: "과학",
      unit: "소화와 순환",
      goal: "핵심 개념 정리",
      situation: "시험 전날",
      difficulty: "용어가 헷갈림",
      desiredHelp: "짧은 암기 전략",
      memo: "",
      includeMemo: false,
    });
    expect(prompt).toContain("이번에 공부할 과목: 과학");
    expect(prompt).toContain("이번에 공부할 단원: 소화와 순환");
    expect(prompt).toContain("이번 학습 목표: 핵심 개념 정리");
  });

  it("keeps memo excluded by default and included only when checked", () => {
    const withoutMemo = buildAiPrompt(createFixtureResult(), {
      ...EMPTY_PROMPT_INPUTS,
      memo: "나는 문제풀이가 더 편해요.",
      includeMemo: false,
    });
    const withMemo = buildAiPrompt(createFixtureResult(), {
      ...EMPTY_PROMPT_INPUTS,
      memo: "나는 문제풀이가 더 편해요.",
      includeMemo: true,
    });
    expect(withoutMemo).not.toContain("나는 문제풀이가 더 편해요.");
    expect(withMemo).toContain("나는 문제풀이가 더 편해요.");
  });
});
