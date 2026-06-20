import {
  AXES,
  AXIS_NAMES,
  AXIS_SHORT_NAMES,
  type Axis,
  type AxisLabel,
  type AxisScores,
} from "../data/axes";
import {
  AXIS_MISSIONS,
  GROWTH_PRIORITY,
  LEARNING_TYPE_CONTENT,
  TYPE_NAMES,
  getAxisCopyForLabel,
} from "../data/learningTypes";
import { QUESTIONS, type AnswerMap, type Question } from "../data/questions";
import {
  displayAxisScores,
  labelAxisScores,
  scoreAnswers,
} from "./scoring";
import { matchLearningType, type LearningTypeMatch } from "./matching";
import { validateAnswers } from "./validation";

export type Result = {
  questionnaireVersion: "16-basic";
  createdAt: string;
  nickname?: string;
  answers: AnswerMap;
  axisScores: AxisScores;
  axisLabels: Record<Axis, AxisLabel>;
  displayScores: AxisScores;
  match: LearningTypeMatch;
  strengthAxes: Axis[];
  growthAxes: Axis[];
  primaryGrowthAxis: Axis;
};

export type ResultSummary = {
  typeName: string;
  secondaryTypeName?: string;
  representativeSentence: string;
  typeSummary: string;
  safetyNote: string;
  aiPrivacyNote: string;
  primaryGrowthCopy: string;
  mission: string;
  strengthTitle: string;
  strengthSummary: string;
  balanceTitle: string;
  balanceSummary: string;
  recommendationSummary: string;
  evidenceLines: string[];
};

const SAFETY_NOTE =
  "이 결과는 고정된 성격이나 능력이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.";

export const AI_PRIVACY_NOTE =
  "앱은 프롬프트를 자동으로 전송하지 않습니다. 다만 복사한 내용을 AI 챗봇에 붙여넣으면 해당 서비스로 전송될 수 있으니 이름, 연락처, 민감한 개인정보는 빼고 사용하세요.";

function sortAxesByScoreDesc(scores: AxisScores, axes: Axis[]): Axis[] {
  return [...axes].sort((left, right) => {
    const delta = scores[right] - scores[left];
    if (delta !== 0) return delta;
    return AXES.indexOf(left) - AXES.indexOf(right);
  });
}

export function selectStrengthAxes(scores: AxisScores): Axis[] {
  const strongAxes = AXES.filter((axis) => scores[axis] >= 70);
  return sortAxesByScoreDesc(scores, strongAxes.length > 0 ? strongAxes : [...AXES])
    .slice(0, 2);
}

function formatShortAxisNames(axes: Axis[]): string {
  return axes.map((axis) => AXIS_SHORT_NAMES[axis]).join(" · ");
}

function getActualStrengthAxes(result: Result): Axis[] {
  return sortAxesByScoreDesc(
    result.axisScores,
    AXES.filter((axis) => result.axisLabels[axis] === "강점"),
  );
}

function getBalanceAxes(result: Result): Axis[] {
  return AXES.filter((axis) => result.axisLabels[axis] === "균형");
}

const SCENARIO_EVIDENCE_COPY: Record<string, Record<string, string>> = {
  Q06: {
    A: "시작 후 흐름을 짧게 유지할 수 있도록 공부 단위를 더 작게 잡는 지원이 필요해 보여요.",
    B: "짧게 시작하는 힘은 있으니 중간 확인 신호를 곁들이면 흐름이 더 안정될 수 있어요.",
    C: "목표와 환경을 다시 맞추며 집중 흐름을 조정하는 모습이 보여요.",
    D: "정한 시간 동안 이어가고 끝에 확인하는 실행 흐름이 보여요.",
    E: "분량을 마치면서 막힌 부분까지 표시하는 실행 흐름이 보여요.",
  },
  Q13: {
    A: "공부 전 작은 분량과 준비 행동을 먼저 잡는 계획 흐름이 보여요.",
    B: "쉬운 문제로 시작하며 실행 흐름을 만드는 모습이 보여요.",
    C: "이전 설명과 예시를 떠올리며 이해의 연결고리를 만드는 모습이 보여요.",
    D: "아는 것과 헷갈리는 것을 나누어 확인 순서를 세우는 모습이 보여요.",
    E: "혼자 살펴본 뒤 필요한 자료나 질문 경로를 정하는 모습이 보여요.",
  },
  Q15: {
    A: "어려운 문제를 만나면 조건과 풀이 순서를 나누어 접근하는 모습이 보여요.",
    B: "완성도보다 시작을 우선해 아는 부분부터 써보는 모습이 보여요.",
    C: "비슷한 예시와 풀이 이유를 다시 설명하며 이해를 다지는 모습이 보여요.",
    D: "막힌 지점을 표시하고 실수와 개념을 구분하려는 점검 흐름이 보여요.",
    E: "시도한 부분과 막힌 부분을 정리해 도움을 요청하는 흐름이 보여요.",
  },
  Q16: {
    A: "공부 후 남은 분량을 보고 다음 순서를 다시 잡는 모습이 보여요.",
    B: "정한 분량 완료 여부를 보고 이어갈지 판단하는 모습이 보여요.",
    C: "배운 내용을 짧은 설명이나 예시로 정리하는 모습이 보여요.",
    D: "헷갈린 것과 오답 원인을 표시하고 다음 확인 문제를 정하는 모습이 보여요.",
    E: "남은 질문을 정리해 자료나 사람에게 확인하는 모습이 보여요.",
  },
};

export function selectGrowthAxes(
  scores: AxisScores,
  match: LearningTypeMatch,
): Axis[] {
  const minScore = Math.min(...AXES.map((axis) => scores[axis]));
  const candidates = AXES.filter((axis) => scores[axis] <= minScore + 5);
  const priority = GROWTH_PRIORITY[match.primaryType];
  const primary = priority.find((axis) => candidates.includes(axis)) ?? candidates[0] ?? "E";

  const second = AXES.filter((axis) => axis !== primary)
    .sort((left, right) => {
      const delta = scores[left] - scores[right];
      if (delta !== 0) return delta;
      return priority.indexOf(left) - priority.indexOf(right);
    })[0];

  return second ? [primary, second] : [primary];
}

export function createResult({
  questions = QUESTIONS,
  answers,
  nickname,
  createdAt = new Date().toISOString(),
}: {
  questions?: Question[];
  answers: AnswerMap;
  nickname?: string;
  createdAt?: string;
}): Result {
  const validation = validateAnswers(questions, answers);
  if (!validation.ok) {
    throw new Error(
      `${validation.error}${validation.questionId ? `: ${validation.questionId}` : ""}`,
    );
  }

  const axisScores = scoreAnswers(questions, answers);
  const axisLabels = labelAxisScores(axisScores);
  const displayScores = displayAxisScores(axisScores);
  const match = matchLearningType(axisScores);
  const strengthAxes = selectStrengthAxes(axisScores);
  const growthAxes = selectGrowthAxes(axisScores, match);
  const trimmedNickname = nickname?.trim();

  const result: Result = {
    questionnaireVersion: "16-basic",
    createdAt,
    answers,
    axisScores,
    axisLabels,
    displayScores,
    match,
    strengthAxes,
    growthAxes,
    primaryGrowthAxis: growthAxes[0] ?? "E",
  };

  if (trimmedNickname) {
    result.nickname = trimmedNickname;
  }

  return result;
}

export function getAxisInterpretation(result: Result, axis: Axis): string {
  return getAxisCopyForLabel(axis, result.axisLabels[axis]);
}

export function getAnswerEvidence(
  result: Result,
  questions: Question[] = QUESTIONS,
): string[] {
  const actualStrengthAxes = getActualStrengthAxes(result);
  const comparisonAxes =
    actualStrengthAxes.length > 0 ? actualStrengthAxes : result.strengthAxes;
  const lines = [
    actualStrengthAxes.length > 0
      ? `현재 답변에서는 ${formatShortAxisNames(
          comparisonAxes,
        )} 축이 강점 범위로 나타났어요.`
      : `현재 답변에서는 ${formatShortAxisNames(
          comparisonAxes,
        )} 축이 다른 축보다 비교적 안정적으로 나타났어요.`,
    `가장 먼저 살필 성장 축은 ${AXIS_NAMES[result.primaryGrowthAxis]}입니다. ${getAxisInterpretation(
      result,
      result.primaryGrowthAxis,
    )}`,
  ];

  const scenarioLines = questions
    .filter((question): question is Extract<Question, { type: "scenario" }> =>
      question.type === "scenario",
    )
    .flatMap((question) => {
      const answer = result.answers[question.id];
      if (typeof answer !== "string") return [];
      const copy = SCENARIO_EVIDENCE_COPY[question.id]?.[answer];
      if (!copy) return [];
      return [`${question.axisLabel} 상황 답변에서는 ${copy}`];
    })
    .slice(0, 2);

  return [...lines, ...scenarioLines];
}

export function createResultSummary(result: Result): ResultSummary {
  const content = LEARNING_TYPE_CONTENT[result.match.primaryType];
  const secondaryTypeName = result.match.secondaryType
    ? TYPE_NAMES[result.match.secondaryType]
    : undefined;
  const typeName = TYPE_NAMES[result.match.primaryType];
  const representativeSentence = secondaryTypeName
    ? `현재 답변 기준으로는 “${typeName}”에 가장 가깝고, “${secondaryTypeName}”의 특징도 일부 보여요.`
    : `현재 답변 기준으로는 “${typeName}”에 가장 가까워요.`;
  const primaryGrowthCopy = getAxisInterpretation(result, result.primaryGrowthAxis);
  const mission =
    AXIS_MISSIONS[result.primaryGrowthAxis][0] ?? content.defaultMission;
  const actualStrengthAxes = getActualStrengthAxes(result);
  const strengthAxes =
    actualStrengthAxes.length > 0 ? actualStrengthAxes : result.strengthAxes;
  const strengthNames = formatShortAxisNames(strengthAxes);
  const balanceAxes = getBalanceAxes(result);
  const balanceNames = formatShortAxisNames(balanceAxes);

  const summary: ResultSummary = {
    typeName,
    representativeSentence,
    typeSummary:
      actualStrengthAxes.length > 0
        ? content.summary
        : `현재 답변은 “${typeName}” 전략 묶음과 가장 가깝지만, 아직 특정 축을 단정하기보다 ${strengthNames} 축을 먼저 활용해볼 수 있어요.`,
    safetyNote: SAFETY_NOTE,
    aiPrivacyNote: AI_PRIVACY_NOTE,
    primaryGrowthCopy,
    mission,
    strengthTitle: actualStrengthAxes.length > 0 ? "강점" : "먼저 활용할 전략",
    strengthSummary:
      actualStrengthAxes.length > 0
        ? `${strengthNames} 축에서 지금 활용하기 좋은 전략이 보여요.`
        : `${strengthNames} 축이 현재 답변에서 비교적 안정적으로 보여요.`,
    balanceTitle: balanceAxes.length > 0 ? "균형" : "다음 점검",
    balanceSummary:
      balanceAxes.length > 0
        ? `${balanceNames} 축은 지금 균형 범위에 있어요. 이 흐름을 유지하며 성장 축을 하나만 더 살펴보세요.`
        : `${AXIS_NAMES[result.primaryGrowthAxis]}를 먼저 살피면 전체 흐름이 안정될 수 있어요.`,
    recommendationSummary: content.recommendedMethods.slice(0, 3).join(" → "),
    evidenceLines: getAnswerEvidence(result),
  };

  if (secondaryTypeName) {
    summary.secondaryTypeName = secondaryTypeName;
  }

  return summary;
}

export function buildDetailedReport(result: Result): string {
  const content = LEARNING_TYPE_CONTENT[result.match.primaryType];
  const summary = createResultSummary(result);
  const axisLines = AXES.map(
    (axis) =>
      `- ${AXIS_NAMES[axis]}: ${result.axisLabels[axis]} (${getAxisInterpretation(
        result,
        axis,
      )})`,
  );

  return [
    summary.representativeSentence,
    summary.safetyNote,
    "",
    "왜 이렇게 봤나요?",
    ...summary.evidenceLines.map((item) => `- ${item}`),
    "",
    "학습 축별 현재 모습",
    ...axisLines,
    "",
    "현재 활용할 수 있는 전략",
    ...content.strengths.map((item) => `- ${item}`),
    "",
    "조심하면 좋은 점",
    ...content.cautions.map((item) => `- ${item}`),
    "",
    "성향별 참고 전략 묶음",
    ...content.recommendedMethods.map((item) => `- ${item}`),
    "",
    "피하면 좋은 학습 방식",
    ...content.avoidMethods.map((item) => `- ${item}`),
    "",
    `이번 성장 포인트: ${AXIS_NAMES[result.primaryGrowthAxis]}`,
    summary.primaryGrowthCopy,
    `다음 수업 성장 미션: ${summary.mission}`,
  ].join("\n");
}
