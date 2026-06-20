import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ClipboardList,
  Copy,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { AXES, AXIS_NAMES, AXIS_SHORT_NAMES } from "../data/axes";
import { LEARNING_TYPE_CONTENT } from "../data/learningTypes";
import {
  createResultSummary,
  getAxisInterpretation,
  type Result,
} from "../domain/result";

type DetailReportScreenProps = {
  result: Result;
  onOpenResult: () => void;
  onOpenPrompt: () => void;
  onCopyReport: () => void;
};

export function DetailReportScreen({
  result,
  onOpenResult,
  onOpenPrompt,
  onCopyReport,
}: DetailReportScreenProps) {
  const summary = createResultSummary(result);
  const content = LEARNING_TYPE_CONTENT[result.match.primaryType];
  const balanceAxes = AXES.filter((axis) => result.axisLabels[axis] === "균형");
  const strengthNames = result.strengthAxes
    .map((axis) => AXIS_SHORT_NAMES[axis])
    .join(" · ");
  const balanceNames = (balanceAxes.length > 0 ? balanceAxes : [result.primaryGrowthAxis])
    .map((axis) => AXIS_SHORT_NAMES[axis])
    .join(" · ");

  return (
    <main className="screenSurface detailSurface" data-testid="screen-surface">
      <header className="detailHeader">
        <button className="buttonSecondary compactButton" type="button" onClick={onOpenResult}>
          <ArrowLeft aria-hidden="true" size={17} />
          결과 요약
        </button>
        <div>
          <p className="resultEyebrow">학습 지도 리포트</p>
          <h2 className="detailTitle" data-screen-heading tabIndex={-1}>
            지금의 공부 길을 한눈에 보기
          </h2>
          <p className="detailLead">{summary.representativeSentence}</p>
        </div>
        <div className="detailHeaderActions">
          <button className="buttonSecondary compactButton" type="button" onClick={onCopyReport}>
            <Copy aria-hidden="true" size={17} />
            리포트 복사
          </button>
          <button className="buttonPrimary compactButton" type="button" onClick={onOpenPrompt}>
            AI 프롬프트
            <ArrowRight aria-hidden="true" size={17} />
          </button>
        </div>
      </header>

      <section className="detailNotice">
        <ShieldCheck aria-hidden="true" size={20} />
        <p>{summary.safetyNote}</p>
      </section>

      <section className="detailSnapshot" aria-label="현재 답변 요약">
        <article>
          <Sparkles aria-hidden="true" size={21} />
          <div>
            <strong>강점</strong>
            <span>{strengthNames}</span>
          </div>
        </article>
        <article>
          <BarChart3 aria-hidden="true" size={21} />
          <div>
            <strong>균형</strong>
            <span>{balanceNames}</span>
          </div>
        </article>
        <article>
          <Target aria-hidden="true" size={21} />
          <div>
            <strong>성장 포인트</strong>
            <span>{AXIS_SHORT_NAMES[result.primaryGrowthAxis]}</span>
          </div>
        </article>
      </section>

      <article className="detailCard missionDetailCard">
        <h3>
          <Sparkles aria-hidden="true" size={20} />
          오늘의 성장 미션
        </h3>
        <div>
          <p>
            {AXIS_NAMES[result.primaryGrowthAxis]}: {summary.primaryGrowthCopy}
          </p>
          <strong>{summary.mission}</strong>
        </div>
      </article>

      <section className="detailGrid" aria-label="상세 리포트">
        <article className="detailCard axisDetailCard">
          <h3>
            <ClipboardList aria-hidden="true" size={20} />
            내 학습 지도
          </h3>
          <div className="axisDetailList">
            {AXES.map((axis) => (
              <article key={axis} data-axis={axis}>
                <h4>
                  <span>{AXIS_SHORT_NAMES[axis]}</span>
                  <em>{result.axisLabels[axis]}</em>
                </h4>
                <p>{getAxisInterpretation(result, axis)}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="detailCard">
          <h3>
            <Lightbulb aria-hidden="true" size={20} />
            잘 맞는 방법
          </h3>
          <ul>
            {content.recommendedMethods.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detailCard">
          <h3>
            <Target aria-hidden="true" size={20} />
            주의할 점
          </h3>
          <ul>
            {content.cautions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h4>피하면 좋은 방식</h4>
          <ul>
            {content.avoidMethods.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
