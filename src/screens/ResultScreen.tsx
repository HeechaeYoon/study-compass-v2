import { forwardRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Copy,
  Download,
  RotateCcw,
  Save,
  Target,
  Trophy,
} from "lucide-react";
import { AXES, AXIS_SHORT_NAMES } from "../data/axes";
import { LEARNING_TYPE_CONTENT } from "../data/learningTypes";
import {
  buildDetailedReport,
  createResultSummary,
  getAxisInterpretation,
  type Result,
} from "../domain/result";
import { Doodle } from "../components/Doodle";
import { RadarChart } from "../components/RadarChart";

type ResultScreenProps = {
  result: Result;
  onOpenPrompt: () => void;
  onCopyReport: () => void;
  onSave: () => void;
  onExportImage: () => void;
  onRestart: () => void;
};

export const ResultScreen = forwardRef<HTMLDivElement, ResultScreenProps>(
  function ResultScreen(
    {
      result,
      onOpenPrompt,
      onCopyReport,
      onSave,
      onExportImage,
      onRestart,
    },
    ref,
  ) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const summary = createResultSummary(result);
    const content = LEARNING_TYPE_CONTENT[result.match.primaryType];
    const headline = result.nickname
      ? `${result.nickname}님의 학습 성향은`
      : "당신의 학습 성향은";

    return (
      <main className="screenSurface resultSurface" data-testid="screen-surface">
        <section className="resultTop" ref={ref} data-export-card>
          <div className="resultNarrative">
            <p className="resultEyebrow">진단이 완료되었어요!</p>
            <p className="resultLead">{headline}</p>
            <div className="typeNameWrap">
              <h2 className="resultType">{summary.typeName}</h2>
              <Doodle kind="star" className="resultStar" />
              <Doodle kind="underline-mint" className="typeUnderline" />
            </div>
            <p className="resultDescription">{content.summary}</p>
            <p className="resultSafety">{summary.representativeSentence}</p>
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
        <section className="summaryCards" aria-label="결과 요약">
          <article className="summaryCard">
            <Trophy aria-hidden="true" />
            <div>
              <h3>강점</h3>
              <p>{summary.strengthSummary}</p>
            </div>
          </article>
          <article className="summaryCard">
            <BarChart3 aria-hidden="true" />
            <div>
              <h3>균형</h3>
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
        <section className="resultActions" aria-label="결과 작업">
          <button className="buttonPrimary" type="button" onClick={onOpenPrompt}>
            AI 프롬프트 만들기
            <ArrowRight aria-hidden="true" size={18} />
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
        <section className="resultDetailsRow">
          <article className="accordion">
            <button
              type="button"
              className="accordionHeader"
              aria-expanded={detailsOpen}
              onClick={() => setDetailsOpen((value) => !value)}
            >
              상세 리포트 보기
              <ChevronDown aria-hidden="true" size={18} />
            </button>
            {detailsOpen ? (
              <div className="accordionBody">
                <p className="fixedNote">{summary.safetyNote}</p>
                <div className="axisReportGrid">
                  {AXES.map((axis) => (
                    <article key={axis}>
                      <h4>
                        {AXIS_SHORT_NAMES[axis]}
                        <span>{result.axisLabels[axis]}</span>
                      </h4>
                      <p>{getAxisInterpretation(result, axis)}</p>
                    </article>
                  ))}
                </div>
                <pre className="reportPreview">{buildDetailedReport(result)}</pre>
              </div>
            ) : null}
          </article>
        </section>
      </main>
    );
  },
);
