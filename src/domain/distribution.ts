import {
  AXES,
  AXIS_SHORT_NAMES,
  type Axis,
  type AxisLabel,
  type AxisScores,
} from "../data/axes";
import {
  TYPE_NAMES,
  TYPE_PROFILES,
  type LearningTypeId,
} from "../data/learningTypes";
import { QUESTIONS, type Question } from "../data/questions";
import { matchLearningType } from "./matching";
import {
  computeAxisBounds,
  labelAxisScores,
  normalizeScore,
  type AxisBounds,
} from "./scoring";

export type RawScoreStateMap = Map<string, number>;

export type LearningTypeDistributionRow = {
  id: LearningTypeId;
  name: string;
  count: number;
  percent: number;
  scoreStates: number;
  scoreStatePercent: number;
  secondaryCount: number;
  secondaryPercent: number;
};

export type TypeLabelDistributionRow = {
  id: LearningTypeId;
  name: string;
  labelSummary: string;
  count: number;
  percent: number;
};

export type LearningTypeDistribution = {
  questionCount: number;
  likertCount: number;
  scenarioCount: number;
  scenarioOptionCounts: Array<{ id: string; options: number }>;
  totalCombinations: number;
  distinctRawScoreStates: number;
  bounds: AxisBounds;
  typeRows: LearningTypeDistributionRow[];
  secondaryTotal: number;
  secondaryPercent: number;
  typeLabelTopRows: TypeLabelDistributionRow[];
};

export function serializeScores(scores: AxisScores): string {
  return AXES.map((axis) => scores[axis]).join(",");
}

export function parseScores(key: string): AxisScores {
  const [P = 0, E = 0, U = 0, M = 0, H = 0] = key
    .split(",")
    .map((value) => Number(value));
  return { P, E, U, M, H };
}

export function scoreOptionsForQuestion(question: Question): AxisScores[] {
  if (question.type === "likert") {
    return [1, 2, 3, 4].map((value) => ({
      P: question.axis === "P" ? value : 0,
      E: question.axis === "E" ? value : 0,
      U: question.axis === "U" ? value : 0,
      M: question.axis === "M" ? value : 0,
      H: question.axis === "H" ? value : 0,
    }));
  }

  return question.options.map((option) => option.scores);
}

export function countRawResponseStates(
  questions: Question[] = QUESTIONS,
): RawScoreStateMap {
  let states: RawScoreStateMap = new Map([
    [serializeScores({ P: 0, E: 0, U: 0, M: 0, H: 0 }), 1],
  ]);

  for (const question of questions) {
    const options = scoreOptionsForQuestion(question);
    const nextStates: RawScoreStateMap = new Map();

    for (const [key, count] of states) {
      const current = parseScores(key);

      for (const option of options) {
        const next = {
          P: current.P + option.P,
          E: current.E + option.E,
          U: current.U + option.U,
          M: current.M + option.M,
          H: current.H + option.H,
        };
        const nextKey = serializeScores(next);
        nextStates.set(nextKey, (nextStates.get(nextKey) ?? 0) + count);
      }
    }

    states = nextStates;
  }

  return states;
}

export function normalizeRawScores(
  raw: AxisScores,
  bounds: AxisBounds,
): AxisScores {
  return {
    P: normalizeScore(raw.P, bounds.min.P, bounds.max.P),
    E: normalizeScore(raw.E, bounds.min.E, bounds.max.E),
    U: normalizeScore(raw.U, bounds.min.U, bounds.max.U),
    M: normalizeScore(raw.M, bounds.min.M, bounds.max.M),
    H: normalizeScore(raw.H, bounds.min.H, bounds.max.H),
  };
}

function formatAxisGroup(
  labels: Record<Axis, AxisLabel>,
  targetLabel: AxisLabel,
): string {
  const axes = AXES.filter((axis) => labels[axis] === targetLabel);
  if (axes.length === 0) return "-";
  return axes.map((axis) => AXIS_SHORT_NAMES[axis]).join("");
}

function labelSummaryForScores(scores: AxisScores): string {
  const labels = labelAxisScores(scores);
  return [
    `강점:${formatAxisGroup(labels, "강점")}`,
    `균형:${formatAxisGroup(labels, "균형")}`,
    `성장 포인트:${formatAxisGroup(labels, "성장 포인트")}`,
  ].join(" / ");
}

function createTypeCountMap(): Map<LearningTypeId, number> {
  return new Map(
    (Object.keys(TYPE_PROFILES) as LearningTypeId[]).map((id) => [id, 0]),
  );
}

export function calculateLearningTypeDistribution({
  questions = QUESTIONS,
  topLabelRowCount = 20,
}: {
  questions?: Question[];
  topLabelRowCount?: number;
} = {}): LearningTypeDistribution {
  const rawStates = countRawResponseStates(questions);
  const bounds = computeAxisBounds(questions);
  const typeCounts = createTypeCountMap();
  const scoreStateTypeCounts = createTypeCountMap();
  const secondaryCounts = createTypeCountMap();
  const typeLabelCounts = new Map<string, number>();
  let totalCombinations = 0;
  let secondaryTotal = 0;

  for (const [key, count] of rawStates) {
    const normalized = normalizeRawScores(parseScores(key), bounds);
    const match = matchLearningType(normalized);
    const primaryType = match.primaryType;

    typeCounts.set(primaryType, (typeCounts.get(primaryType) ?? 0) + count);
    scoreStateTypeCounts.set(
      primaryType,
      (scoreStateTypeCounts.get(primaryType) ?? 0) + 1,
    );

    if (match.secondaryType) {
      secondaryCounts.set(
        match.secondaryType,
        (secondaryCounts.get(match.secondaryType) ?? 0) + count,
      );
      secondaryTotal += count;
    }

    const typeLabelKey = `${primaryType}__${labelSummaryForScores(normalized)}`;
    typeLabelCounts.set(
      typeLabelKey,
      (typeLabelCounts.get(typeLabelKey) ?? 0) + count,
    );

    totalCombinations += count;
  }

  const typeRows = (Object.keys(TYPE_PROFILES) as LearningTypeId[])
    .map((id) => {
      const count = typeCounts.get(id) ?? 0;
      const scoreStates = scoreStateTypeCounts.get(id) ?? 0;
      const secondaryCount = secondaryCounts.get(id) ?? 0;
      return {
        id,
        name: TYPE_NAMES[id],
        count,
        percent: (count / totalCombinations) * 100,
        scoreStates,
        scoreStatePercent: (scoreStates / rawStates.size) * 100,
        secondaryCount,
        secondaryPercent: (secondaryCount / totalCombinations) * 100,
      };
    })
    .sort((left, right) => right.count - left.count);

  const typeLabelTopRows = [...typeLabelCounts.entries()]
    .map(([key, count]) => {
      const [id, labelSummary] = key.split("__") as [
        LearningTypeId,
        string,
      ];
      return {
        id,
        name: TYPE_NAMES[id],
        labelSummary,
        count,
        percent: (count / totalCombinations) * 100,
      };
    })
    .sort((left, right) => right.count - left.count)
    .slice(0, topLabelRowCount);

  return {
    questionCount: questions.length,
    likertCount: questions.filter((question) => question.type === "likert")
      .length,
    scenarioCount: questions.filter((question) => question.type === "scenario")
      .length,
    scenarioOptionCounts: questions
      .filter((question) => question.type === "scenario")
      .map((question) => ({
        id: question.id,
        options: question.options.length,
      })),
    totalCombinations,
    distinctRawScoreStates: rawStates.size,
    bounds,
    typeRows,
    secondaryTotal,
    secondaryPercent: (secondaryTotal / totalCombinations) * 100,
    typeLabelTopRows,
  };
}
