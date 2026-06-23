import { forwardRef } from "react";
import {
  ArrowRight,
  BarChart3,
  Copy,
  Download,
  RotateCcw,
  Save,
  Target,
  Trophy,
} from "lucide-react";
import { createResultSummary, type Result } from "../domain/result";
import { DAISY_COPYRIGHT_TEXT } from "../data/ownership";
import { Doodle } from "../components/Doodle";
import { RadarChart } from "../components/RadarChart";

type ResultScreenProps = {
  result: Result;
  onOpenDetail: () => void;
  onOpenPrompt: () => void;
  onCopyReport: () => void;
  onSave: () => void;
  onExportImage: () => void;
  onRestart: () => void;
};

function SummaryCards({ result }: { result: Result }) {
  const summary = createResultSummary(result);

  return (
    <section className="summaryCards" aria-label="결과 요약">
      <article className="summaryCard">
        <Trophy aria-hidden="true" />
        <div>
          <h3>{summary.strengthTitle}</h3>
          <p>{summary.strengthSummary}</p>
        </div>
      </article>
      <article className="summaryCard">
        <BarChart3 aria-hidden="true" />
        <div>
          <h3>{summary.balanceTitle}</h3>
          <p>{summary.balanceSummary}</p>
        </div>
      </article>
      <article className="summaryCard">
        <Target aria-hidden="true" />
        <div>
          <h3>추천 전략</h3>
          <p>{summary.recommendationSummary}</p>
        </div>
      </article>
    </section>
  );
}

export function ResultScreen({
  result,
  onOpenDetail,
  onOpenPrompt,
  onCopyReport,
  onSave,
  onExportImage,
  onRestart,
}: ResultScreenProps) {
  const summary = createResultSummary(result);
  const headline = result.nickname
    ? `${result.nickname}님의 현재 답변 지도`
    : "현재 답변으로 본 학습 전략 지도";

  return (
    <main className="screenSurface resultSurface" data-testid="screen-surface">
      <section className="resultTop">
        <div className="resultNarrative">
          <p className="resultEyebrow">진단이 완료되었어요!</p>
          <p className="resultLead">{headline}</p>
          <div className="typeNameWrap">
            <h2 className="resultType" data-screen-heading tabIndex={-1}>
              {summary.typeName}
            </h2>
            <Doodle kind="star" className="resultStar" />
            <Doodle kind="underline-mint" className="typeUnderline" />
          </div>
          <p className="resultDescription">{summary.typeSummary}</p>
          <p className="resultSafety">{summary.representativeSentence}</p>
          <p className="resultSafety">{summary.safetyNote}</p>
          <article className="growthCard">
            <h3>성장 포인트</h3>
            <p>{summary.primaryGrowthCopy}</p>
            <strong>{summary.mission}</strong>
            <Doodle kind="growth-arrow" className="growthDoodle" />
          </article>
        </div>
        <div className="radarPanel">
          <RadarChart
            scores={result.axisScores}
            displayScores={result.displayScores}
            labels={result.axisLabels}
          />
        </div>
      </section>
      <SummaryCards result={result} />
      <section className="resultActions" aria-label="결과 작업">
        <button className="buttonPrimary" type="button" onClick={onOpenPrompt}>
          AI 프롬프트 만들기
          <ArrowRight aria-hidden="true" size={18} />
        </button>
        <button className="buttonSecondary" type="button" onClick={onOpenDetail}>
          <Copy aria-hidden="true" size={17} />
          상세 리포트 보기
        </button>
        <button className="buttonSecondary" type="button" onClick={onCopyReport}>
          <Copy aria-hidden="true" size={17} />
          상세 리포트 복사
        </button>
        <button className="buttonSecondary" type="button" onClick={onSave}>
          <Save aria-hidden="true" size={17} />
          결과 저장
        </button>
        <button className="buttonSecondary" type="button" onClick={onExportImage}>
          <Download aria-hidden="true" size={17} />
          이미지 저장
        </button>
        <button className="buttonSecondary" type="button" onClick={onRestart}>
          <RotateCcw aria-hidden="true" size={17} />
          처음으로
        </button>
      </section>
    </main>
  );
}

export const ResultExportCard = forwardRef<HTMLDivElement, { result: Result }>(
  function ResultExportCard({ result }, ref) {
    const summary = createResultSummary(result);
    const headline = result.nickname
      ? `${result.nickname}님의 현재 답변 지도`
      : "현재 답변 기준 학습 전략 지도";

    return (
      <section
        ref={ref}
        className="resultExportCard"
        data-export-card
        aria-hidden="true"
      >
        <div className="exportNarrative">
          <p className="resultEyebrow">나의 공부 스타일 요약</p>
          <p className="resultLead">{headline}</p>
          <h2 className="resultType">{summary.typeName}</h2>
          <p>{summary.typeSummary}</p>
          <p className="resultSafety">{summary.representativeSentence}</p>
          <p className="resultSafety">{summary.safetyNote}</p>
          <article className="growthCard exportGrowthCard">
            <h3>성장 포인트</h3>
            <p>{summary.primaryGrowthCopy}</p>
            <strong>{summary.mission}</strong>
          </article>
        </div>
        <div className="exportRadar">
          <RadarChart
            scores={result.axisScores}
            displayScores={result.displayScores}
            labels={result.axisLabels}
            size={300}
          />
        </div>
        <SummaryCards result={result} />
        <p className="exportCopyright">{DAISY_COPYRIGHT_TEXT}</p>
      </section>
    );
  },
);
