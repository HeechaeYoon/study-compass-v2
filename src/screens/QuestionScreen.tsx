import { useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Lightbulb } from "lucide-react";
import {
  AXIS_SHORT_NAMES,
  type Axis,
} from "../data/axes";
import {
  LIKERT_OPTIONS,
  type AnswerValue,
  type Question,
} from "../data/questions";
import { Doodle } from "../components/Doodle";

type QuestionScreenProps = {
  question: Question;
  answer: AnswerValue | undefined;
  index: number;
  total: number;
  isAutoAdvancing: boolean;
  onAnswer: (
    questionId: string,
    value: AnswerValue,
    options: { autoAdvance: boolean },
  ) => void;
  onPrevious: () => void;
  onNext: () => void;
};

type PointerIntent = {
  value: AnswerValue;
  at: number;
} | null;

function questionAxis(question: Question): Axis {
  if (question.type === "likert") return question.axis;
  if (question.axisLabel === "계획") return "P";
  if (question.axisLabel === "실행") return "E";
  if (question.axisLabel === "이해") return "U";
  if (question.axisLabel === "도움") return "H";
  return "M";
}

function getOptions(question: Question) {
  if (question.type === "likert") {
    return LIKERT_OPTIONS.map((option) => ({
      id: String(option.value),
      value: option.value,
      text: option.label,
      dotLevel: option.dotLevel,
    }));
  }

  return question.options.map((option) => ({
    id: option.id,
    value: option.id,
    text: option.text,
    dotLevel: option.dotLevel ?? 3,
  }));
}

export function QuestionScreen({
  question,
  answer,
  index,
  total,
  isAutoAdvancing,
  onAnswer,
  onPrevious,
  onNext,
}: QuestionScreenProps) {
  const progress = ((index + 1) / total) * 100;
  const remaining = Math.max(1, Math.ceil(((total - index - 1) * 18) / 60));
  const axis = questionAxis(question);
  const options = getOptions(question);
  const hasAnswer = answer !== undefined;
  const pointerIntentRef = useRef<PointerIntent>(null);

  return (
    <main className="screenSurface questionSurface" data-testid="screen-surface">
      <div className="questionProgress">
        <strong>
          {index + 1}
          <span>/ {total}</span>
        </strong>
        <div
          className="progressTrack"
          role="progressbar"
          aria-label={`${total}문항 중 ${index + 1}문항 진행`}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + 1}
        >
          <div className="progressFill" style={{ width: `${progress}%` }} />
        </div>
        <span className="remainingTime">약 {remaining}분 남음</span>
      </div>
      <section className="questionBody">
        <span className="axisChip" data-axis={axis}>
          {AXIS_SHORT_NAMES[axis]}
        </span>
        <div className="questionHeadingWrap">
          <h2 className="questionTitle" data-screen-heading tabIndex={-1}>
            {question.text}
          </h2>
          <Doodle kind="study-spark" className="questionSpark" />
        </div>
        <fieldset className={`answerGrid answerGrid-${options.length}`}>
          <legend className="srOnly">{question.text}</legend>
          {options.map((option) => {
            const selected = answer === option.value;
            return (
              <label
                key={option.id}
                className="answerCard"
                data-selected={selected}
                onPointerDown={() => {
                  pointerIntentRef.current = {
                    value: option.value,
                    at: Date.now(),
                  };
                }}
              >
                <input
                  className="srOnly"
                  type="radio"
                  name={question.id}
                  value={String(option.value)}
                  checked={selected}
                  onChange={() => {
                    const pointerIntent = pointerIntentRef.current;
                    const autoAdvance =
                      pointerIntent?.value === option.value &&
                      Date.now() - pointerIntent.at < 1000;
                    pointerIntentRef.current = null;
                    onAnswer(question.id, option.value, { autoAdvance });
                  }}
                />
                {selected ? (
                  <span className="answerCheck" aria-hidden="true">
                    <Check size={15} />
                  </span>
                ) : null}
                <span className="dotRow" aria-hidden="true">
                  {[1, 2, 3, 4].map((dot) => (
                    <i key={dot} data-active={dot <= option.dotLevel} data-axis={axis} />
                  ))}
                </span>
                <span className="answerText">{option.text}</span>
              </label>
            );
          })}
        </fieldset>
      </section>
      <footer className="questionFooter">
        <button
          className="buttonSecondary navButton"
          type="button"
          onClick={onPrevious}
          disabled={index === 0}
        >
          <ArrowLeft aria-hidden="true" size={18} />
          이전
        </button>
        <p className="honestHint">
          <Lightbulb aria-hidden="true" size={16} />
          {isAutoAdvancing
            ? "선택했어요. 잠시 후 다음 문항으로 이동해요."
            : "솔직하게 선택할수록 결과가 더 정확해요."}
        </p>
        <button
          className="buttonPrimary navButton"
          type="button"
          onClick={onNext}
          disabled={!hasAnswer}
        >
          {isAutoAdvancing ? "바로 다음" : "다음"}
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </footer>
    </main>
  );
}
