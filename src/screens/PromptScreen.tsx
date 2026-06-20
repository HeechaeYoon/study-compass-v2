import { useMemo, useState, type KeyboardEvent } from "react";
import {
  ClipboardCopy,
  Copy,
  Download,
  Info,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import { AXIS_NAMES } from "../data/axes";
import { LEARNING_TYPE_CONTENT } from "../data/learningTypes";
import { buildAiPrompt, type PromptInputs } from "../domain/prompt";
import { createResultSummary, type Result } from "../domain/result";
import { Doodle } from "../components/Doodle";

type PromptScreenProps = {
  result: Result;
  inputs: PromptInputs;
  pencilSrc: string;
  onInputChange: (field: keyof PromptInputs, value: string | boolean) => void;
  onOpenResult: () => void;
  onCopyPrompt: () => void;
  onCopyReport: () => void;
  onSave: () => void;
  onExportImage: () => void;
  onRequestDelete: () => void;
};

const fieldConfig: Array<{
  field: keyof PromptInputs;
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

type PromptTab = "prompt" | "guide";

const tabs: Array<{ id: PromptTab; label: string }> = [
  { id: "prompt", label: "AI 프롬프트" },
  { id: "guide", label: "학습 전략 가이드" },
];

export function PromptScreen({
  result,
  inputs,
  pencilSrc,
  onInputChange,
  onOpenResult,
  onCopyPrompt,
  onCopyReport,
  onSave,
  onExportImage,
  onRequestDelete,
}: PromptScreenProps) {
  const [tab, setTab] = useState<PromptTab>("prompt");
  const prompt = useMemo(() => buildAiPrompt(result, inputs), [inputs, result]);
  const summary = createResultSummary(result);
  const content = LEARNING_TYPE_CONTENT[result.match.primaryType];

  function focusTab(nextTab: PromptTab): void {
    setTab(nextTab);
    window.requestAnimationFrame(() => {
      document.getElementById(`${nextTab}-tab`)?.focus();
    });
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const currentIndex = tabs.findIndex((item) => item.id === tab);
    if (currentIndex < 0) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      if (nextTab) focusTab(nextTab.id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextTab = tabs[(currentIndex + tabs.length - 1) % tabs.length];
      if (nextTab) focusTab(nextTab.id);
    } else if (event.key === "Home") {
      event.preventDefault();
      const nextTab = tabs[0];
      if (nextTab) focusTab(nextTab.id);
    } else if (event.key === "End") {
      event.preventDefault();
      const nextTab = tabs[tabs.length - 1];
      if (nextTab) focusTab(nextTab.id);
    }
  }

  return (
    <main className="screenSurface promptSurface" data-testid="screen-surface">
      <section className="promptFormPanel">
        <div className="tabs" role="tablist" aria-label="프롬프트 화면">
          {tabs.map((item) => (
            <button
              key={item.id}
              id={`${item.id}-tab`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls={`${item.id}-panel`}
              tabIndex={tab === item.id ? 0 : -1}
              className={tab === item.id ? "active" : ""}
              onClick={() => setTab(item.id)}
              onKeyDown={handleTabKeyDown}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="promptIntro">
          결과를 바탕으로 나만의 학습 전략 프롬프트를 만들어 보세요.
        </p>
        {tab === "prompt" ? (
          <div
            id="prompt-panel"
            className="promptFields"
            role="tabpanel"
            aria-labelledby="prompt-tab"
          >
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
            </label>
            <label className="checkboxLine promptCheckbox">
              <input
                type="checkbox"
                checked={inputs.includeMemo}
                onChange={(event) =>
                  onInputChange("includeMemo", event.target.checked)
                }
              />
              내가 쓴 메모를 AI 챗봇용 프롬프트에 포함하기
            </label>
            <button className="buttonOutlinePrimary generateButton" type="button" onClick={onCopyPrompt}>
              프롬프트 생성하기
              <Pencil aria-hidden="true" size={17} />
            </button>
          </div>
        ) : (
          <div
            id="guide-panel"
            className="strategyGuide"
            role="tabpanel"
            aria-labelledby="guide-tab"
          >
            <h2>{summary.typeName}</h2>
            <p>{summary.representativeSentence}</p>
            <ul>
              {content.recommendedMethods.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button className="buttonSecondary" type="button" onClick={onOpenResult}>
              결과 요약으로 돌아가기
            </button>
          </div>
        )}
        <div className="promptUtility">
          <button className="buttonSecondary" type="button" onClick={onSave}>
            <Save aria-hidden="true" size={16} />
            저장
          </button>
          <button className="buttonSecondary" type="button" onClick={onExportImage}>
            <Download aria-hidden="true" size={16} />
            이미지
          </button>
          <button className="buttonDanger" type="button" onClick={onRequestDelete}>
            <Trash2 aria-hidden="true" size={16} />
            삭제
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
              <Doodle kind="underline-blue" className="notebookUnderline" />
            </div>
            <button className="copyButton" type="button" onClick={onCopyPrompt}>
              <ClipboardCopy aria-hidden="true" size={16} />
              복사하기
            </button>
          </header>
          <pre className="promptPreview" tabIndex={0} aria-label="AI 프롬프트 전문">
            {prompt}
          </pre>
          <footer className="notebookHint">
            <Info aria-hidden="true" size={16} />
            프롬프트를 복사해서 Gemini 등 AI 챗봇에 붙여넣어 사용하세요.
          </footer>
        </article>
        <img className="pencilAsset" src={pencilSrc} alt="" aria-hidden="true" />
        <button className="buttonSecondary promptReportCopy" type="button" onClick={onCopyReport}>
          <Copy aria-hidden="true" size={16} />
          상세 리포트 복사
        </button>
        <p className="axisMiniNote">
          성장 초점: {AXIS_NAMES[result.primaryGrowthAxis]}
        </p>
      </section>
    </main>
  );
}
