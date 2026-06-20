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
  safetyNote: string;
  primaryGrowthCopy: string;
  mission: string;
  strengthSummary: string;
  balanceSummary: string;
  recommendationSummary: string;
};

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
  const strengthNames = result.strengthAxes
    .map((axis) => AXIS_SHORT_NAMES[axis])
    .join(" · ");

  const summary: ResultSummary = {
    typeName,
    representativeSentence,
    safetyNote:
      "이 결과는 고정된 성격이나 능력이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.",
    primaryGrowthCopy,
    mission,
    strengthSummary: `${strengthNames} 축에서 지금 활용하기 좋은 전략이 보여요.`,
    balanceSummary: `${AXIS_NAMES[result.primaryGrowthAxis]}를 조금 더 살피면 전체 흐름이 안정될 수 있어요.`,
    recommendationSummary: content.recommendedMethods.slice(0, 3).join(" → "),
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
    "학습 축별 현재 모습",
    ...axisLines,
    "",
    "강점",
    ...content.strengths.map((item) => `- ${item}`),
    "",
    "주의할 점",
    ...content.cautions.map((item) => `- ${item}`),
    "",
    "잘 맞을 가능성이 높은 학습법",
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
