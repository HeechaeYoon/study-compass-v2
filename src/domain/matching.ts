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

function pickPrimaryType(scores: AxisScores): LearningTypeId {
  const avg = mean(scores);
  const values = AXES.map((axis) => scores[axis]);
  const highest = Math.max(...values);
  if (avg < 50 && highest < 60) return "foundation_builder";
  if (standardDeviation(scores) < 8 && avg >= 60) {
    return "balanced_coordinator";
  }
  return rankProfiles(scores)[0]?.id ?? "foundation_builder";
}

export function matchLearningType(scores: AxisScores): LearningTypeMatch {
  const rankings = rankProfiles(scores);
  const primaryType = pickPrimaryType(scores);
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
    if (similarityGap < 0.03 || distanceGap < 5) {
      match.secondaryType = secondaryCandidate.id;
    }
  }

  return match;
}
