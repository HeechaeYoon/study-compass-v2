import {
  AXES,
  createAxisScores,
  type Axis,
  type AxisLabel,
  type AxisScores,
} from "../data/axes";
import {
  LIKERT_OPTIONS,
  type AnswerMap,
  type AnswerValue,
  type Question,
} from "../data/questions";

export type AxisBounds = {
  min: AxisScores;
  max: AxisScores;
};

function addScore(target: AxisScores, source: AxisScores): void {
  for (const axis of AXES) {
    target[axis] += source[axis];
  }
}

export function computeAxisBounds(questions: Question[]): AxisBounds {
  const min = createAxisScores();
  const max = createAxisScores();

  for (const question of questions) {
    if (question.type === "likert") {
      min[question.axis] += 1;
      max[question.axis] += 4;
      continue;
    }

    for (const axis of AXES) {
      const values = question.options.map((option) => option.scores[axis]);
      min[axis] += Math.min(...values);
      max[axis] += Math.max(...values);
    }
  }

  return { min, max };
}

export function normalizeScore(raw: number, min: number, max: number): number {
  if (max <= min) return 0;
  const score = ((raw - min) / (max - min)) * 100;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function scoreLikertAnswer(value: AnswerValue, questionId: string): number {
  if (typeof value !== "number") {
    throw new Error(`Missing or invalid answer: ${questionId}`);
  }

  const isValid = LIKERT_OPTIONS.some((option) => option.value === value);
  if (!isValid) {
    throw new Error(`Invalid Likert answer: ${questionId}`);
  }

  return value;
}

export function scoreAnswers(
  questions: Question[],
  answers: AnswerMap,
): AxisScores {
  const raw = createAxisScores();

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) {
      throw new Error(`Missing or invalid answer: ${question.id}`);
    }

    if (question.type === "likert") {
      raw[question.axis] += scoreLikertAnswer(answer, question.id);
      continue;
    }

    if (typeof answer !== "string") {
      throw new Error(`Missing or invalid answer: ${question.id}`);
    }

    const option = question.options.find((item) => item.id === answer);
    if (!option) {
      throw new Error(`Unknown option ${answer} for ${question.id}`);
    }

    addScore(raw, option.scores);
  }

  const bounds = computeAxisBounds(questions);

  return {
    P: normalizeScore(raw.P, bounds.min.P, bounds.max.P),
    E: normalizeScore(raw.E, bounds.min.E, bounds.max.E),
    U: normalizeScore(raw.U, bounds.min.U, bounds.max.U),
    M: normalizeScore(raw.M, bounds.min.M, bounds.max.M),
    H: normalizeScore(raw.H, bounds.min.H, bounds.max.H),
  };
}

export function toAxisLabel(score: number): AxisLabel {
  if (score >= 70) return "강점";
  if (score >= 40) return "균형";
  return "성장 포인트";
}

export function toDisplayScore(score: number): number {
  return Math.round((1 + score / 25) * 10) / 10;
}

export function labelAxisScores(scores: AxisScores): Record<Axis, AxisLabel> {
  return {
    P: toAxisLabel(scores.P),
    E: toAxisLabel(scores.E),
    U: toAxisLabel(scores.U),
    M: toAxisLabel(scores.M),
    H: toAxisLabel(scores.H),
  };
}

export function displayAxisScores(scores: AxisScores): AxisScores {
  return {
    P: toDisplayScore(scores.P),
    E: toDisplayScore(scores.E),
    U: toDisplayScore(scores.U),
    M: toDisplayScore(scores.M),
    H: toDisplayScore(scores.H),
  };
}
