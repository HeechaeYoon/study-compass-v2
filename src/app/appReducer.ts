import { EMPTY_PROMPT_INPUTS } from "../domain/prompt";
import type { AppAction, AppState } from "./appState";

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_NICKNAME":
      return { ...state, nickname: action.value };
    case "START":
      return {
        ...state,
        screen: "question",
        currentQuestionIndex: 0,
        answers: {},
        result: null,
        memo: "",
        includeMemoInPrompt: false,
        promptInputs: { ...EMPTY_PROMPT_INPUTS },
      };
    case "ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
      };
    case "PREVIOUS_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      };
    case "GO_TO_QUESTION":
      return {
        ...state,
        screen: "question",
        currentQuestionIndex: Math.max(0, action.index),
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case "COMPLETE":
      return {
        ...state,
        screen: "result",
        result: action.result,
      };
    case "OPEN_DETAIL":
      return { ...state, screen: "detail" };
    case "OPEN_PROMPT":
      return { ...state, screen: "prompt" };
    case "OPEN_RESULT":
      return { ...state, screen: "result" };
    case "SET_MEMO":
      return {
        ...state,
        memo: action.value,
        promptInputs: { ...state.promptInputs, memo: action.value },
      };
    case "SET_INCLUDE_MEMO":
      return {
        ...state,
        includeMemoInPrompt: action.value,
        promptInputs: { ...state.promptInputs, includeMemo: action.value },
      };
    case "SET_PROMPT_INPUT":
      return {
        ...state,
        memo:
          action.field === "memo" && typeof action.value === "string"
            ? action.value
            : state.memo,
        includeMemoInPrompt:
          action.field === "includeMemo" && typeof action.value === "boolean"
            ? action.value
            : state.includeMemoInPrompt,
        promptInputs: {
          ...state.promptInputs,
          [action.field]: action.value,
        },
      };
    case "LOAD_SAVED_RESULT":
      return {
        ...state,
        screen: "result",
        nickname: action.value.result.nickname ?? "",
        result: action.value.result,
        memo: action.value.memo,
        includeMemoInPrompt: action.value.includeMemoInPrompt,
        promptInputs: action.value.promptInputs,
        savedResult: action.value,
      };
    case "SET_SAVED_RESULT":
      return { ...state, savedResult: action.value };
    case "DELETE_LOCAL_RESULT":
      return {
        ...state,
        screen: "start",
        currentQuestionIndex: 0,
        answers: {},
        result: null,
        memo: "",
        includeMemoInPrompt: false,
        promptInputs: { ...EMPTY_PROMPT_INPUTS },
        savedResult: null,
      };
    case "RESET":
      return {
        ...state,
        screen: "start",
        currentQuestionIndex: 0,
        answers: {},
        result: null,
        memo: "",
        includeMemoInPrompt: false,
        promptInputs: { ...EMPTY_PROMPT_INPUTS },
      };
    default:
      return state;
  }
}
