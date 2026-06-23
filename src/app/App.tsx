import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { QUESTIONS, type AnswerValue } from "../data/questions";
import { buildDetailedReport, createResult, createResultSummary } from "../domain/result";
import { validateAccessCode } from "../domain/accessCode";
import { copyText } from "../infrastructure/clipboard";
import { exportSummaryCard } from "../infrastructure/imageExport";
import {
  loadAccessPass,
  saveAccessPass,
} from "../infrastructure/accessStorage";
import {
  deleteResult,
  loadResult,
  saveResult,
  type SavedResult,
} from "../infrastructure/storage";
import { AppHeader } from "../components/AppHeader";
import { ConfirmModal } from "../components/ConfirmModal";
import { Toast } from "../components/Toast";
import { WideOnlyNotice } from "../components/WideOnlyNotice";
import { DaisyOwnershipMark } from "../components/DaisyOwnershipMark";
import { appReducer } from "./appReducer";
import { createFixtureState, isFixtureEnabled } from "./fixtures";
import { initialAppState } from "./appState";
import { StartScreen } from "../screens/StartScreen";
import { QuestionScreen } from "../screens/QuestionScreen";
import { ResultExportCard, ResultScreen } from "../screens/ResultScreen";
import { DetailReportScreen } from "../screens/DetailReportScreen";
import { PromptScreen } from "../screens/PromptScreen";
import { AccessGateScreen } from "../screens/AccessGateScreen";
import { AdminAccessModal } from "../screens/AdminAccessModal";

const assetBase = import.meta.env.BASE_URL;

function assetPath(file: string): string {
  return `${assetBase}${file}`.replace(/\/{2,}/g, "/");
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTextEntryElement(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (element.isContentEditable) return true;
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

type ToastState = {
  id: number;
  message: string;
};

type AppHistoryState = {
  app: "study-compass";
  screen: "start" | "question" | "result" | "detail" | "prompt";
  questionIndex?: number;
};

type CssVars = React.CSSProperties & {
  "--paper-texture": string;
};

function isAppHistoryState(value: unknown): value is AppHistoryState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<AppHistoryState>;
  return (
    candidate.app === "study-compass" &&
    (candidate.screen === "start" ||
      candidate.screen === "question" ||
      candidate.screen === "result" ||
      candidate.screen === "detail" ||
      candidate.screen === "prompt")
  );
}

export function App() {
  const fixtureName = new URLSearchParams(window.location.search).get("fixture");
  const fixture = isFixtureEnabled() ? fixtureName : null;
  const [state, dispatch] = useReducer(
    appReducer,
    fixture ? createFixtureState(fixture) : initialAppState,
  );
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessError, setAccessError] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [autoAdvanceQuestionId, setAutoAdvanceQuestionId] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);
  const toastIdRef = useRef(0);
  const historyReadyRef = useRef(false);
  const handlingPopRef = useRef(false);
  const lastHistorySignatureRef = useRef("");

  const clearAutoAdvance = useCallback((resetPending = true): void => {
    if (autoAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (resetPending) {
      setAutoAdvanceQuestionId(null);
    }
  }, []);

  const styleVars: CssVars = {
    "--paper-texture": `url("${assetPath("assets/paper-texture.webp")}")`,
  };

  const resultSummary = useMemo(
    () => (state.result ? createResultSummary(state.result) : null),
    [state.result],
  );

  useEffect(() => {
    const loaded = loadResult();
    if (loaded.ok && loaded.value) {
      dispatch({ type: "SET_SAVED_RESULT", value: loaded.value });
    }
  }, []);

  useEffect(() => {
    if (fixture) return;
    const loaded = loadAccessPass();
    if (loaded.ok && loaded.value) {
      setAccessGranted(true);
    }
  }, [fixture]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => {
      setToast((current) => (current?.id === toast.id ? null : current));
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    return () => clearAutoAdvance(false);
  }, [clearAutoAdvance]);

  useEffect(() => {
    clearAutoAdvance();
  }, [clearAutoAdvance, state.currentQuestionIndex, state.screen]);

  useEffect(() => {
    if (isTextEntryElement(document.activeElement)) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [state.currentQuestionIndex, state.screen]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (isTextEntryElement(document.activeElement)) return;
      const surface = document.querySelector('[data-testid="screen-surface"]');
      const heading = surface?.querySelector<HTMLElement>("[data-screen-heading]");
      heading?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.currentQuestionIndex, state.screen]);

  useEffect(() => {
    if (fixture) return;
    const onPopState = (event: PopStateEvent) => {
      handlingPopRef.current = true;
      if (!isAppHistoryState(event.state)) {
        dispatch({ type: "RESET" });
        return;
      }

      if (event.state.screen === "question") {
        dispatch({ type: "GO_TO_QUESTION", index: event.state.questionIndex ?? 0 });
      } else if (event.state.screen === "result" && state.result) {
        dispatch({ type: "OPEN_RESULT" });
      } else if (event.state.screen === "detail" && state.result) {
        dispatch({ type: "OPEN_DETAIL" });
      } else if (event.state.screen === "prompt" && state.result) {
        dispatch({ type: "OPEN_PROMPT" });
      } else {
        dispatch({ type: "RESET" });
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [fixture, state.result]);

  useEffect(() => {
    if (fixture) return;

    const historyState: AppHistoryState = {
      app: "study-compass",
      screen: state.screen,
    };
    if (state.screen === "question") {
      historyState.questionIndex = state.currentQuestionIndex;
    }

    const signature = `${historyState.screen}:${historyState.questionIndex ?? ""}`;
    if (!historyReadyRef.current) {
      window.history.replaceState(historyState, "", window.location.href);
      historyReadyRef.current = true;
      lastHistorySignatureRef.current = signature;
      return;
    }

    if (handlingPopRef.current) {
      handlingPopRef.current = false;
      lastHistorySignatureRef.current = signature;
      return;
    }

    if (signature !== lastHistorySignatureRef.current) {
      window.history.pushState(historyState, "", window.location.href);
      lastHistorySignatureRef.current = signature;
    }
  }, [fixture, state.currentQuestionIndex, state.screen]);

  function announce(message: string): void {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, message });
  }

  function completeCurrentQuestion(answers = state.answers): void {
    const result = createResult({
      answers,
      nickname: state.nickname,
    });
    dispatch({ type: "COMPLETE", result });
  }

  function handleNext(): void {
    clearAutoAdvance();
    if (state.currentQuestionIndex === QUESTIONS.length - 1) {
      completeCurrentQuestion();
      return;
    }
    dispatch({ type: "NEXT_QUESTION" });
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  function handleQuestionAnswer(
    questionId: string,
    value: AnswerValue,
    options: { autoAdvance: boolean },
  ): void {
    const changed = state.answers[questionId] !== value;
    const nextAnswers = { ...state.answers, [questionId]: value };
    dispatch({ type: "ANSWER", questionId, value });
    if (!changed) return;
    if (!options.autoAdvance || prefersReducedMotion()) {
      clearAutoAdvance();
      return;
    }

    clearAutoAdvance();
    setAutoAdvanceQuestionId(questionId);
    autoAdvanceTimeoutRef.current = window.setTimeout(() => {
      autoAdvanceTimeoutRef.current = null;
      setAutoAdvanceQuestionId(null);
      if (state.currentQuestionIndex === QUESTIONS.length - 1) {
        completeCurrentQuestion(nextAnswers);
        return;
      }
      dispatch({ type: "NEXT_QUESTION" });
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }, 620);
  }

  async function handleCopy(text: string, successMessage: string): Promise<boolean> {
    const result = await copyText(text);
    if (result.ok) {
      announce(successMessage);
      return true;
    }
    setManualCopyText(result.manualText);
    announce("자동 복사가 어려워요. 아래 텍스트를 길게 눌러 복사해주세요.");
    return false;
  }

  async function handleCopyPrompt(promptText: string): Promise<boolean> {
    return handleCopy(promptText, "AI 프롬프트를 복사했어요.");
  }

  async function handleCopyAccessCode(code: string): Promise<boolean> {
    return handleCopy(code, "접속 코드를 복사했어요.");
  }

  function handleAccessSubmit(): void {
    const validation = validateAccessCode(
      accessCodeInput,
      new Date(),
      __ACCESS_VERIFIER_DIGEST__,
    );

    if (!validation.ok) {
      setAccessError(
        validation.reason === "expired"
          ? "만료된 접속 코드예요. 선생님께 새 코드를 요청해주세요."
          : "유효하지 않은 접속 코드예요. 선생님이 안내한 코드를 다시 확인해주세요.",
      );
      return;
    }

    const saved = saveAccessPass(validation.code, validation.expiresAt);
    setAccessGranted(true);
    setAccessCodeInput("");
    setAccessError(null);
    if (saved.ok) {
      announce("접속 코드가 확인되었어요.");
    } else {
      announce("접속 코드가 확인되었어요. 이 탭에서 계속 사용할 수 있어요.");
    }
  }

  async function handleCopyReport(): Promise<void> {
    if (!state.result) return;
    await handleCopy(buildDetailedReport(state.result), "상세 리포트를 복사했어요.");
  }

  function handleSave(): void {
    if (!state.result) return;

    const saved: SavedResult = {
      schemaVersion: 2,
      savedAt: new Date().toISOString(),
      result: state.result,
      memo: state.memo,
      promptInputs: state.promptInputs,
    };
    const outcome = saveResult(saved);
    if (outcome.ok) {
      dispatch({ type: "SET_SAVED_RESULT", value: saved });
      announce("이 기기의 브라우저에 결과를 저장했어요.");
    } else {
      announce(
        "이 브라우저에서는 저장하기 어려워요. 프롬프트 복사나 이미지 저장을 이용해주세요.",
      );
    }
  }

  function handleDelete(): void {
    const outcome = deleteResult();
    if (outcome.ok) {
      dispatch({ type: "DELETE_LOCAL_RESULT" });
      setDeleteModalOpen(false);
      announce("저장된 결과를 삭제했어요.");
      return;
    }
    announce("저장된 결과를 삭제하기 어려워요.");
  }

  async function handleExportImage(): Promise<void> {
    if (!state.result || !resultSummary) return;
    const outcome = await exportSummaryCard(exportRef.current, resultSummary.typeName);
    if (outcome.ok) {
      announce("결과 이미지를 저장했어요.");
      return;
    }
    announce("이미지 저장이 어려워요. 상세 리포트 또는 AI 프롬프트 복사를 이용해주세요.");
  }

  const currentQuestion = QUESTIONS[state.currentQuestionIndex] ?? QUESTIONS[0];
  const shouldShowAccessGate = fixture === "access" || (!fixture && !accessGranted);

  return (
    <>
      <WideOnlyNotice />
      <div className="wideApp appShell" style={styleVars}>
        <AppHeader />
        {shouldShowAccessGate ? (
          <AccessGateScreen
            code={accessCodeInput}
            error={accessError}
            onCodeChange={(value) => {
              setAccessCodeInput(value);
              setAccessError(null);
            }}
            onSubmit={handleAccessSubmit}
          />
        ) : null}
        {!shouldShowAccessGate && state.screen === "start" ? (
          <StartScreen
            nickname={state.nickname}
            heroImageSrc={assetPath("assets/start-hero-map-v2.webp")}
            savedResult={state.savedResult}
            onNicknameChange={(value) =>
              dispatch({ type: "SET_NICKNAME", value })
            }
            onStart={() => dispatch({ type: "START" })}
            onLoadSaved={(value) =>
              dispatch({ type: "LOAD_SAVED_RESULT", value })
            }
            onRequestDelete={() => setDeleteModalOpen(true)}
          />
        ) : null}
        {!shouldShowAccessGate && state.screen === "question" && currentQuestion ? (
          <QuestionScreen
            question={currentQuestion}
            answer={state.answers[currentQuestion.id]}
            index={state.currentQuestionIndex}
            total={QUESTIONS.length}
            isAutoAdvancing={autoAdvanceQuestionId === currentQuestion.id}
            onAnswer={handleQuestionAnswer}
            onReturnHome={() => {
              clearAutoAdvance();
              dispatch({ type: "RESET" });
            }}
            onPrevious={() => {
              clearAutoAdvance();
              dispatch({ type: "PREVIOUS_QUESTION" });
            }}
            onNext={handleNext}
          />
        ) : null}
        {!shouldShowAccessGate && state.screen === "result" && state.result ? (
          <ResultScreen
            result={state.result}
            onOpenDetail={() => dispatch({ type: "OPEN_DETAIL" })}
            onOpenPrompt={() => dispatch({ type: "OPEN_PROMPT" })}
            onCopyReport={handleCopyReport}
            onSave={handleSave}
            onExportImage={handleExportImage}
            onRestart={() => dispatch({ type: "RESET" })}
          />
        ) : null}
        {!shouldShowAccessGate && state.screen === "detail" && state.result ? (
          <DetailReportScreen
            result={state.result}
            onOpenResult={() => dispatch({ type: "OPEN_RESULT" })}
            onOpenPrompt={() => dispatch({ type: "OPEN_PROMPT" })}
            onCopyReport={handleCopyReport}
          />
        ) : null}
        {!shouldShowAccessGate && state.screen === "prompt" && state.result ? (
          <PromptScreen
            result={state.result}
            inputs={state.promptInputs}
            pencilSrc={assetPath("assets/pencil-transparent.webp")}
            onInputChange={(field, value) =>
              dispatch({ type: "SET_PROMPT_INPUT", field, value })
            }
            onOpenResult={() => dispatch({ type: "OPEN_RESULT" })}
            onCopyPrompt={handleCopyPrompt}
            onSave={handleSave}
            onExportImage={handleExportImage}
            onRequestDelete={() => setDeleteModalOpen(true)}
          />
        ) : null}
        {state.result ? <ResultExportCard ref={exportRef} result={state.result} /> : null}
        <DaisyOwnershipMark onAdminRequest={() => setAdminModalOpen(true)} />
      </div>
      <Toast toast={toast} />
      <AdminAccessModal
        open={adminModalOpen}
        verifierDigest={__ACCESS_VERIFIER_DIGEST__}
        onClose={() => setAdminModalOpen(false)}
        onCopyCode={handleCopyAccessCode}
      />
      <ConfirmModal
        open={deleteModalOpen}
        title="저장된 결과를 삭제할까요?"
        description="삭제한 결과와 메모는 다시 복구할 수 없습니다."
        confirmLabel="삭제하기"
        cancelLabel="취소"
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      <ConfirmModal
        open={manualCopyText !== null}
        title="수동으로 복사하기"
        description="자동 복사가 어려워요. 아래 텍스트를 선택해 직접 복사해주세요."
        confirmLabel="닫기"
        cancelLabel="전체 선택"
        onCancel={() => {
          const element = document.getElementById("manual-copy-text");
          if (element instanceof HTMLTextAreaElement) {
            element.focus();
            element.select();
          }
        }}
        onConfirm={() => setManualCopyText(null)}
      >
        <textarea
          id="manual-copy-text"
          className="manualCopy"
          value={manualCopyText ?? ""}
          readOnly
        />
      </ConfirmModal>
    </>
  );
}
