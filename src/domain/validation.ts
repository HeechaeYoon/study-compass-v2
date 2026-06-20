import { AXES } from "../data/axes";
import {
  LIKERT_OPTIONS,
  type AnswerMap,
  type Question,
} from "../data/questions";

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string; questionId?: string };

export function validateAnswers(
  questions: Question[],
  answers: AnswerMap,
): ValidationResult {
  const ids = new Set<string>();

  for (const question of questions) {
    if (ids.has(question.id)) {
      return { ok: false, error: "Duplicate question id", questionId: question.id };
    }
    ids.add(question.id);

    const answer = answers[question.id];
    if (answer === undefined) {
      return { ok: false, error: "Missing answer", questionId: question.id };
    }

    if (question.type === "likert") {
      const valid = LIKERT_OPTIONS.some((option) => option.value === answer);
      if (!valid) {
        return { ok: false, error: "Invalid Likert answer", questionId: question.id };
      }
      continue;
    }

    if (typeof answer !== "string") {
      return { ok: false, error: "Invalid scenario answer", questionId: question.id };
    }

    const option = question.options.find((item) => item.id === answer);
    if (!option) {
      return { ok: false, error: "Unknown scenario option", questionId: question.id };
    }

    for (const axis of AXES) {
      if (!Number.isFinite(option.scores[axis])) {
        return { ok: false, error: "Invalid option score", questionId: question.id };
      }
    }
  }

  return { ok: true };
}
