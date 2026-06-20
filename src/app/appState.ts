import { EMPTY_PROMPT_INPUTS, type PromptInputs } from "../domain/prompt";
import type { Result } from "../domain/result";
import type { AnswerMap, AnswerValue } from "../data/questions";
import type { SavedResult } from "../infrastructure/storage";

export type Screen = "start" | "question" | "result" | "detail" | "prompt";

export type AppState = {
  screen: Screen;
  nickname: string;
  currentQuestionIndex: number;
  answers: AnswerMap;
  result: Result | null;
  memo: string;
  includeMemoInPrompt: boolean;
  promptInputs: PromptInputs;
  savedResult: SavedResult | null;
};

export type AppAction =
  | { type: "SET_NICKNAME"; value: string }
  | { type: "START" }
  | { type: "ANSWER"; questionId: string; value: AnswerValue }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "GO_TO_QUESTION"; index: number }
  | { type: "NEXT_QUESTION" }
  | { type: "COMPLETE"; result: Result }
  | { type: "OPEN_DETAIL" }
  | { type: "OPEN_PROMPT" }
  | { type: "OPEN_RESULT" }
  | { type: "SET_MEMO"; value: string }
  | { type: "SET_INCLUDE_MEMO"; value: boolean }
  | { type: "SET_PROMPT_INPUT"; field: keyof PromptInputs; value: string | boolean }
  | { type: "LOAD_SAVED_RESULT"; value: SavedResult }
  | { type: "SET_SAVED_RESULT"; value: SavedResult | null }
  | { type: "DELETE_LOCAL_RESULT" }
  | { type: "RESET" };

export const initialAppState: AppState = {
  screen: "start",
  nickname: "",
  currentQuestionIndex: 0,
  answers: {},
  result: null,
  memo: "",
  includeMemoInPrompt: false,
  promptInputs: EMPTY_PROMPT_INPUTS,
  savedResult: null,
};
