import type { AppState } from "./appState";
import { initialAppState } from "./appState";
import { AXES, type Axis, type AxisLabel, type AxisScores } from "../data/axes";
import { QUESTIONS, type AnswerMap } from "../data/questions";
import { matchLearningType } from "../domain/matching";
import type { Result } from "../domain/result";
import { displayAxisScores, labelAxisScores } from "../domain/scoring";
import { EMPTY_PROMPT_INPUTS } from "../domain/prompt";

export const fixtureAnswers: AnswerMap = {
  Q01: 4,
  Q02: 4,
  Q03: 3,
  Q04: 4,
  Q05: 4,
  Q06: "D",
  Q07: 3,
  Q08: 3,
  Q09: 3,
  Q10: 4,
  Q11: 3,
  Q12: 3,
  Q13: "A",
  Q14: 3,
  Q15: "D",
  Q16: "B",
};

const fixtureScores: AxisScores = {
  P: 80,
  E: 90,
  U: 70,
  M: 78,
  H: 65,
};

export function createFixtureResult(): Result {
  const labels = labelAxisScores(fixtureScores) as Record<Axis, AxisLabel>;
  return {
    questionnaireVersion: "16-basic",
    createdAt: "2026-06-20T00:00:00.000Z",
    nickname: "민트고래",
    answers: fixtureAnswers,
    axisScores: fixtureScores,
    axisLabels: labels,
    displayScores: displayAxisScores(fixtureScores),
    match: matchLearningType(fixtureScores),
    strengthAxes: ["E", "P"],
    growthAxes: ["M", "H"],
    primaryGrowthAxis: "M",
  };
}

export function isFixtureEnabled(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_FIXTURES === "true";
}

export function createFixtureState(name: string | null): AppState {
  if (!isFixtureEnabled()) return initialAppState;
  const result = createFixtureResult();

  if (name === "question") {
    return {
      ...initialAppState,
      screen: "question",
      currentQuestionIndex: 5,
      answers: { Q06: "D" },
    };
  }

  if (name === "result") {
    return {
      ...initialAppState,
      screen: "result",
      nickname: result.nickname ?? "",
      answers: fixtureAnswers,
      result,
    };
  }

  if (name === "prompt") {
    return {
      ...initialAppState,
      screen: "prompt",
      nickname: result.nickname ?? "",
      answers: fixtureAnswers,
      result,
      promptInputs: {
        ...EMPTY_PROMPT_INPUTS,
        subject: "수학",
        unit: "일차함수",
        goal: "식과 그래프 관계를 설명하기",
        situation: "학교 수업 후 복습 중",
        difficulty: "그래프에서 기울기를 찾는 부분",
        desiredHelp: "30분 안에 따라 할 순서",
      },
    };
  }

  if (name === "detail") {
    return {
      ...initialAppState,
      screen: "detail",
      nickname: result.nickname ?? "",
      answers: fixtureAnswers,
      result,
    };
  }

  return {
    ...initialAppState,
    screen: "start",
  };
}

export function getQuestionFixtureLabel(): string {
  const question = QUESTIONS[5];
  return question ? `${question.id} ${question.text}` : "";
}

export function makeAllStrongLabels(): Record<Axis, AxisLabel> {
  return AXES.reduce(
    (accumulator, axis) => ({ ...accumulator, [axis]: "강점" as const }),
    {} as Record<Axis, AxisLabel>,
  );
}
