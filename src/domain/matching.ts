import { AXES, type AxisScores } from "../data/axes";
import {
  TYPE_PROFILES,
  type LearningTypeId,
} from "../data/learningTypes";

export type LearningTypeMatch = {
  primaryType: LearningTypeId;
  secondaryType?: LearningTypeId;
  rankings: Array<{
    id: LearningTypeId;
    distance: number;
    similarity: number;
  }>;
};

export function mean(scores: AxisScores): number {
  return AXES.reduce((sum, axis) => sum + scores[axis], 0) / AXES.length;
}

export function standardDeviation(scores: AxisScores): number {
  const avg = mean(scores);
  const variance =
    AXES.reduce((sum, axis) => sum + (scores[axis] - avg) ** 2, 0) /
    AXES.length;
  return Math.sqrt(variance);
}

export function profileDistance(a: AxisScores, b: AxisScores): number {
  const squared =
    AXES.reduce((sum, axis) => sum + (a[axis] - b[axis]) ** 2, 0) /
    AXES.length;
  return Math.sqrt(squared);
}

export function profileSimilarity(a: AxisScores, b: AxisScores): number {
  return 1 - profileDistance(a, b) / 100;
}

function rankProfiles(scores: AxisScores) {
  return Object.entries(TYPE_PROFILES)
    .map(([id, profile]) => ({
      id: id as LearningTypeId,
      distance: profileDistance(scores, profile),
      similarity: profileSimilarity(scores, profile),
    }))
    .sort((left, right) => left.distance - right.distance);
}

function maxScore(scores: AxisScores): number {
  return Math.max(...AXES.map((axis) => scores[axis]));
}

function allAxesAtLeast(scores: AxisScores, minScore: number): boolean {
  return AXES.every((axis) => scores[axis] >= minScore);
}

function canUsePrimaryType(
  typeId: LearningTypeId,
  scores: AxisScores,
): boolean {
  if (typeId === "balanced_coordinator") {
    return (
      mean(scores) >= 45 &&
      standardDeviation(scores) < 15 &&
      allAxesAtLeast(scores, 30)
    );
  }

  if (typeId === "foundation_builder") {
    return mean(scores) < 32 && maxScore(scores) < 55;
  }

  return true;
}

function pickPrimaryType(
  scores: AxisScores,
  rankings: ReturnType<typeof rankProfiles>,
): LearningTypeId {
  for (const ranking of rankings) {
    if (canUsePrimaryType(ranking.id, scores)) {
      return ranking.id;
    }
  }

  return rankings[0]?.id ?? "foundation_builder";
}

export function matchLearningType(scores: AxisScores): LearningTypeMatch {
  const rankings = rankProfiles(scores);
  const primaryType = pickPrimaryType(scores, rankings);
  const primaryRanking =
    rankings.find((ranking) => ranking.id === primaryType) ?? rankings[0];
  const secondaryCandidate = rankings.find(
    (ranking) => ranking.id !== primaryType,
  );

  const match: LearningTypeMatch = {
    primaryType,
    rankings,
  };

  if (primaryRanking && secondaryCandidate) {
    const similarityGap =
      primaryRanking.similarity - secondaryCandidate.similarity;
    const distanceGap = secondaryCandidate.distance - primaryRanking.distance;
    if (distanceGap >= 0 && (similarityGap < 0.03 || distanceGap < 5)) {
      match.secondaryType = secondaryCandidate.id;
    }
  }

  return match;
}
