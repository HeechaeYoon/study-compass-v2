import type { PromptInputs } from "../domain/prompt";
import type { Result } from "../domain/result";
import { AXES, type Axis, type AxisLabel, type AxisScores } from "../data/axes";
import { QUESTIONS, type AnswerMap } from "../data/questions";
import { TYPE_NAMES, type LearningTypeId } from "../data/learningTypes";
import { validateAnswers } from "../domain/validation";

export const STORAGE_KEY = "srl-coach-result-v1";

export type SavedResult = {
  schemaVersion: 2;
  savedAt: string;
  result: Result;
  memo: string;
  promptInputs: PromptInputs;
};

export type StorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: "unavailable" | "invalid" | "quota" | "unknown" };

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAxis(value: unknown): value is Axis {
  return typeof value === "string" && AXES.includes(value as Axis);
}

function isAxisLabel(value: unknown): value is AxisLabel {
  return value === "강점" || value === "균형" || value === "성장 포인트";
}

function isLearningTypeId(value: unknown): value is LearningTypeId {
  return typeof value === "string" && value in TYPE_NAMES;
}

function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function isAxisScores(value: unknown, min: number, max: number): value is AxisScores {
  if (!isRecord(value)) return false;
  return AXES.every((axis) => isNumberInRange(value[axis], min, max));
}

function isAxisLabelRecord(value: unknown): value is Record<Axis, AxisLabel> {
  if (!isRecord(value)) return false;
  return AXES.every((axis) => isAxisLabel(value[axis]));
}

function isAxisArray(value: unknown): value is Axis[] {
  return Array.isArray(value) && value.every(isAxis);
}

function isPromptInputs(value: unknown): value is PromptInputs {
  if (!isRecord(value)) return false;
  return (
    typeof value.subject === "string" &&
    typeof value.unit === "string" &&
    typeof value.goal === "string" &&
    typeof value.situation === "string" &&
    typeof value.difficulty === "string" &&
    typeof value.desiredHelp === "string" &&
    typeof value.memo === "string"
  );
}

function toPromptInputs(value: unknown, fallbackMemo = ""): PromptInputs | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.subject !== "string" ||
    typeof value.unit !== "string" ||
    typeof value.goal !== "string" ||
    typeof value.situation !== "string" ||
    typeof value.difficulty !== "string" ||
    typeof value.desiredHelp !== "string"
  ) {
    return null;
  }

  return {
    subject: value.subject,
    unit: value.unit,
    goal: value.goal,
    situation: value.situation,
    difficulty: value.difficulty,
    desiredHelp: value.desiredHelp,
    memo: typeof value.memo === "string" ? value.memo : fallbackMemo,
  };
}

function isLearningTypeMatch(value: unknown): value is Result["match"] {
  if (!isRecord(value)) return false;
  if (!isLearningTypeId(value.primaryType)) return false;
  if (value.secondaryType !== undefined && !isLearningTypeId(value.secondaryType)) {
    return false;
  }
  if (!Array.isArray(value.rankings)) return false;
  return value.rankings.every((ranking) => {
    if (!isRecord(ranking)) return false;
    return (
      isLearningTypeId(ranking.id) &&
      isNumberInRange(ranking.distance, 0, Number.POSITIVE_INFINITY) &&
      isNumberInRange(ranking.similarity, Number.NEGATIVE_INFINITY, 1)
    );
  });
}

function isResult(value: unknown): value is Result {
  if (!isRecord(value)) return false;
  if (value.questionnaireVersion !== "16-basic") return false;
  if (typeof value.createdAt !== "string") return false;
  if (value.nickname !== undefined && typeof value.nickname !== "string") return false;
  if (!isRecord(value.answers)) return false;
  if (!validateAnswers(QUESTIONS, value.answers as AnswerMap).ok) return false;
  if (!isAxisScores(value.axisScores, 0, 100)) return false;
  if (!isAxisLabelRecord(value.axisLabels)) return false;
  if (!isAxisScores(value.displayScores, 1, 5)) return false;
  if (!isLearningTypeMatch(value.match)) return false;
  if (!isAxisArray(value.strengthAxes)) return false;
  if (!isAxisArray(value.growthAxes)) return false;
  if (!isAxis(value.primaryGrowthAxis)) return false;
  return true;
}

export function isSavedResult(value: unknown): value is SavedResult {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== 2) return false;
  if (typeof value.savedAt !== "string") return false;
  if (!isResult(value.result)) return false;
  if (typeof value.memo !== "string") return false;
  if (!isPromptInputs(value.promptInputs)) return false;
  return true;
}

function migrateSavedResult(value: unknown): SavedResult | null {
  if (!isRecord(value)) return null;

  if (isSavedResult(value)) {
    return value;
  }

  if (value.schemaVersion !== 1) return null;
  if (typeof value.savedAt !== "string") return null;
  if (!isResult(value.result)) return null;
  if (typeof value.memo !== "string") return null;

  const promptInputs = toPromptInputs(value.promptInputs, value.memo);
  if (!promptInputs) return null;
  const memo = promptInputs.memo.trim().length > 0 ? promptInputs.memo : value.memo;

  return {
    schemaVersion: 2,
    savedAt: value.savedAt,
    result: value.result,
    memo,
    promptInputs: {
      ...promptInputs,
      memo,
    },
  };
}

export function saveResult(value: SavedResult): StorageResult<void> {
  const storage = getStorage();
  if (!storage) return { ok: false, error: "unavailable" };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(value));
    return { ok: true, value: undefined };
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      return { ok: false, error: "quota" };
    }
    return { ok: false, error: "unknown" };
  }
}

export function loadResult(): StorageResult<SavedResult | null> {
  const storage = getStorage();
  if (!storage) return { ok: false, error: "unavailable" };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, value: null };
    const parsed: unknown = JSON.parse(raw);
    const savedResult = migrateSavedResult(parsed);
    if (!savedResult) {
      return { ok: false, error: "invalid" };
    }
    return { ok: true, value: savedResult };
  } catch {
    return { ok: false, error: "invalid" };
  }
}

export function deleteResult(): StorageResult<void> {
  const storage = getStorage();
  if (!storage) return { ok: false, error: "unavailable" };

  try {
    storage.removeItem(STORAGE_KEY);
    return { ok: true, value: undefined };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
