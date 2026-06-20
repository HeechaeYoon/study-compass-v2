import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ClipboardCopy,
  Download,
  Info,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { AXIS_NAMES } from "../data/axes";
import {
  buildPrompt,
  PROMPT_MODE_CONFIGS,
  type PromptInputs,
  type PromptMode,
} from "../domain/prompt";
import { createResultSummary, type Result } from "../domain/result";
import { Doodle } from "../components/Doodle";

type PromptScreenProps = {
  result: Result;
  inputs: PromptInputs;
  pencilSrc: string;
  onInputChange: (field: keyof PromptInputs, value: string) => void;
  onOpenResult: () => void;
  onCopyPrompt: (text: string) => Promise<boolean>;
  onSave: () => void;
  onExportImage: () => void;
  onRequestDelete: () => void;
};

const fieldConfig: Array<{
  field: Exclude<keyof PromptInputs, "memo">;
  label: string;
  placeholder: string;
}> = [
  { field: "subject", label: "과목", placeholder: "예) 수학" },
  { field: "unit", label: "단원", placeholder: "예) 일차함수" },
  { field: "goal", label: "이번 학습 목표", placeholder: "예) 식과 그래프 관계 설명하기" },
  { field: "situation", label: "현재 상황", placeholder: "예) 학교 수업 후 복습 중" },
  { field: "difficulty", label: "어려운 점", placeholder: "예) 그래프에서 기울기 찾기" },
  { field: "desiredHelp", label: "원하는 도움", placeholder: "예) 30분 계획과 질문 예시" },
];

export function PromptScreen({
  result,
  inputs,
  pencilSrc,
  onInputChange,
  onOpenResult,
  onCopyPrompt,
  onSave,
  onExportImage,
  onRequestDelete,
}: PromptScreenProps) {
  const [selectedMode, setSelectedMode] = useState<PromptMode>("studyPlan");
  const [copySucceeded, setCopySucceeded] = useState(false);
  const copyResetTimeoutRef = useRef<number | null>(null);
  const summary = useMemo(() => createResultSummary(result), [result]);
  const prompt = useMemo(
    () => buildPrompt(result, inputs, selectedMode),
    [inputs, result, selectedMode],
  );
  const selectedModeLabel =
    PROMPT_MODE_CONFIGS.find((config) => config.mode === selectedMode)?.label ??
    "공부 계획";

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  async function handlePromptCopy(): Promise<void> {
    if (copyResetTimeoutRef.current !== null) {
      window.clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }
    setCopySucceeded(false);
    const copied = await onCopyPrompt(prompt);
    if (!copied) return;
    setCopySucceeded(true);
    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopySucceeded(false);
      copyResetTimeoutRef.current = null;
    }, 2000);
  }

  return (
    <main className="screenSurface promptSurface" data-testid="screen-surface">
      <section className="promptFormPanel">
        <h2 className="srOnly" data-screen-heading tabIndex={-1}>
          AI 프롬프트 생성
        </h2>
        <div className="promptTopNav">
          <button className="buttonSecondary compactButton" type="button" onClick={onOpenResult}>
            <ArrowLeft aria-hidden="true" size={16} />
            결과 요약으로
          </button>
          <span className="liveUpdateBadge">
            <RefreshCw aria-hidden="true" size={14} />
            실시간 갱신
          </span>
        </div>
        <p className="promptIntro">
          입력한 내용과 메모는 오른쪽 미리보기에만 반영되며 아직 AI로 보내지지
          않아요. 복사해 붙여넣을 때는 이름, 연락처, 민감한 개인정보를 빼주세요.
        </p>
        <section className="promptModeSelector" aria-labelledby="prompt-mode-label">
          <div>
            <p id="prompt-mode-label" className="promptModeLabel">
              만들 프롬프트
            </p>
            <p className="promptModeHint">목적을 바꾸면 미리보기도 바로 바뀌어요.</p>
          </div>
          <div className="promptModeOptions" role="group" aria-label="프롬프트 종류">
            {PROMPT_MODE_CONFIGS.map((config) => (
              <button
                key={config.mode}
                className="promptModeButton"
                type="button"
                data-active={selectedMode === config.mode}
                aria-pressed={selectedMode === config.mode}
                title={config.description}
                onClick={() => setSelectedMode(config.mode)}
              >
                {config.label}
              </button>
            ))}
          </div>
        </section>
        <div className="promptFields">
          {fieldConfig.map((config) => (
            <label key={config.field} className="field">
              <span className="label">{config.label}</span>
              <input
                className="input"
                value={String(inputs[config.field] ?? "")}
                onChange={(event) => onInputChange(config.field, event.target.value)}
                placeholder={config.placeholder}
              />
            </label>
          ))}
          <label className="field promptMemoField">
            <span className="label">내가 보기엔 다른 점</span>
            <textarea
              className="textarea"
              value={inputs.memo}
              onChange={(event) => onInputChange("memo", event.target.value)}
              placeholder="결과가 나와 조금 다르게 느껴진다면 여기에 적어보세요."
            />
            <span className="promptMemoHint">
              메모를 입력하면 프롬프트에 함께 반영돼요. 민감한 개인정보는 적지
              않는 것이 좋아요.
            </span>
          </label>
        </div>
        <div className="promptUtility">
          <button className="buttonSecondary" type="button" onClick={onSave}>
            <Save aria-hidden="true" size={16} />
            결과 저장
          </button>
          <button className="buttonSecondary" type="button" onClick={onExportImage}>
            <Download aria-hidden="true" size={16} />
            이미지 저장
          </button>
          <button className="buttonDanger" type="button" onClick={onRequestDelete}>
            <Trash2 aria-hidden="true" size={16} />
            저장 결과 삭제
          </button>
        </div>
      </section>
      <section className="notebookPanel" aria-label="프롬프트 미리보기">
        <div className="blueBacking" aria-hidden="true" />
        <article className="notebookSheet">
          <div className="binding" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <header className="notebookHeader">
            <div>
              <h2>프롬프트 미리보기</h2>
              <span className="notebookMode">{selectedModeLabel}</span>
              <Doodle kind="underline-blue" className="notebookUnderline" />
            </div>
            <button
              className="copyButton"
              type="button"
              data-copied={copySucceeded}
              onClick={handlePromptCopy}
            >
              {copySucceeded ? (
                <Check aria-hidden="true" size={16} />
              ) : (
                <ClipboardCopy aria-hidden="true" size={16} />
              )}
              {copySucceeded ? "복사됨" : "복사하기"}
            </button>
          </header>
          <pre className="promptPreview" tabIndex={0} aria-label="AI 프롬프트 전문">
            {prompt}
          </pre>
          <footer className="notebookHint">
            <Info aria-hidden="true" size={16} />
            {summary.aiPrivacyNote}
          </footer>
        </article>
        <img className="pencilAsset" src={pencilSrc} alt="" aria-hidden="true" />
        <p className="axisMiniNote">
          성장 초점: {AXIS_NAMES[result.primaryGrowthAxis]}
        </p>
      </section>
    </main>
  );
}
