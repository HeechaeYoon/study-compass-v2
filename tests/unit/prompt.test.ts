import { describe, expect, it } from "vitest";
import { createFixtureResult } from "../../src/app/fixtures";
import {
  buildAiPrompt,
  buildPrompt,
  buildQuestionAnswerContext,
  EMPTY_PROMPT_INPUTS,
  type PromptMode,
} from "../../src/domain/prompt";

describe("AI prompt", () => {
  it("works with all optional inputs blank", () => {
    const prompt = buildAiPrompt(createFixtureResult(), EMPTY_PROMPT_INPUTS);
    expect(prompt).toContain("현재 답변 기준");
    expect(prompt).toContain("고정된 성격이 아니라");
    expect(prompt).toContain("앱은 프롬프트를 자동으로 전송하지 않습니다");
    expect(prompt).toContain("민감한 개인정보");
    expect(prompt).toContain("아직 입력하지 않았습니다");
    expect(prompt).toContain("30~40분");
    expect(prompt).toContain("스스로 점검할 질문 3개");
    expect(prompt).toContain("후속 질문 예시 2개");
  });

  it("builds all prompt modes with current-response safety language", () => {
    const modes: PromptMode[] = [
      "studyPlan",
      "conceptLearning",
      "studyPlanInfographic",
      "conceptInfographic",
    ];

    for (const mode of modes) {
      const prompt = buildPrompt(createFixtureResult(), EMPTY_PROMPT_INPUTS, mode);
      expect(prompt).toContain("현재 답변 기준");
      expect(prompt).toContain("고정된 성격이 아니라");
      expect(prompt).toContain("문항과 답변 전체 맥락");
      expect(prompt).toContain("앱은 프롬프트를 자동으로 전송하지 않습니다");
    }
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
    });
    expect(prompt).toContain("이번에 공부할 과목: 과학");
    expect(prompt).toContain("이번에 공부할 단원: 소화와 순환");
    expect(prompt).toContain("이번 학습 목표: 핵심 개념 정리");
  });

  it("includes memo automatically when the student writes one", () => {
    const withoutMemo = buildAiPrompt(createFixtureResult(), EMPTY_PROMPT_INPUTS);
    const withMemo = buildAiPrompt(createFixtureResult(), {
      ...EMPTY_PROMPT_INPUTS,
      memo: "나는 문제풀이가 더 편해요.",
    });
    expect(withoutMemo).not.toContain("나는 문제풀이가 더 편해요.");
    expect(withMemo).toContain("나는 문제풀이가 더 편해요.");
  });

  it("includes all question and answer context", () => {
    const context = buildQuestionAnswerContext(createFixtureResult());
    expect(context.match(/^Q\d{2}\./gm)).toHaveLength(16);
    expect(context).toContain("Q01. [계획] 공부를 시작하기 전에");
    expect(context).toContain("답변: 매우 그렇다 (4점 척도 중 4)");
    expect(context).toContain("Q06. [실행] 최근 공부할 때");
    expect(context).toContain("정한 시간 동안 이어가고 끝나면 한 번 확인해요.");
    expect(context).toContain("Q16. [점검] 공부를 마친 뒤");
  });

  it("adds concept learning instructions", () => {
    const prompt = buildPrompt(
      createFixtureResult(),
      EMPTY_PROMPT_INPUTS,
      "conceptLearning",
    );
    expect(prompt).toContain("개념 학습용 설명");
    expect(prompt).toContain("핵심 개념 3~5개");
    expect(prompt).toContain("오개념");
    expect(prompt).toContain("확인문제 3개");
    expect(prompt).toContain("채점 기준");
  });

  it("adds safe infographic image-generation instructions", () => {
    const planPrompt = buildPrompt(
      createFixtureResult(),
      EMPTY_PROMPT_INPUTS,
      "studyPlanInfographic",
    );
    const conceptPrompt = buildPrompt(
      createFixtureResult(),
      EMPTY_PROMPT_INPUTS,
      "conceptInfographic",
    );
    expect(planPrompt).toContain("학습 계획 인포그래픽");
    expect(conceptPrompt).toContain("개념 학습 인포그래픽");
    expect(planPrompt).toContain("이미지에 그대로 쓰지 말 것");
    expect(conceptPrompt).toContain("이미지에 그대로 쓰지 말 것");
    expect(planPrompt).toContain("민감한 개인정보");
    expect(conceptPrompt).toContain("원문 답변");
  });
});
