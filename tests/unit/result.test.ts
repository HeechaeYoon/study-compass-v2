import { describe, expect, it } from "vitest";
import type { Axis, AxisLabel, AxisScores } from "../../src/data/axes";
import { createFixtureResult } from "../../src/app/fixtures";
import {
  buildDetailedReport,
  createResultSummary,
  selectGrowthAxes,
  selectStrengthAxes,
  type Result,
} from "../../src/domain/result";
import { matchLearningType } from "../../src/domain/matching";
import { displayAxisScores, labelAxisScores } from "../../src/domain/scoring";

function makeResult(scores: AxisScores): Result {
  const match = matchLearningType(scores);
  const growthAxes = selectGrowthAxes(scores, match);
  return {
    ...createFixtureResult(),
    axisScores: scores,
    axisLabels: labelAxisScores(scores) as Record<Axis, AxisLabel>,
    displayScores: displayAxisScores(scores),
    match,
    strengthAxes: selectStrengthAxes(scores),
    growthAxes,
    primaryGrowthAxis: growthAxes[0] ?? "E",
  };
}

describe("result copy", () => {
  it("does not label relative top axes as strengths when no axis is strong", () => {
    const result = makeResult({ P: 35, E: 34, U: 25, M: 20, H: 18 });
    const summary = createResultSummary(result);
    const report = buildDetailedReport(result);

    expect(summary.strengthTitle).toBe("먼저 활용할 전략");
    expect(summary.strengthSummary).toContain("비교적 안정적으로");
    expect(summary.typeSummary).toContain("특정 축을 단정하기보다");
    expect(summary.typeSummary).not.toContain("강점");
    expect(report).toContain("왜 이렇게 봤나요?");
    expect(report).toContain("비교적 안정적으로");
    expect(report).not.toContain("\n강점\n-");
  });

  it("keeps reachable strategy results neutral when no axis is strong", () => {
    const result = makeResult({ P: 58, E: 37, U: 44, M: 50, H: 33 });
    const summary = createResultSummary(result);

    expect(Object.values(result.axisLabels)).not.toContain("강점");
    expect(summary.typeName).toBe("전략 설계형");
    expect(summary.typeSummary).not.toContain("강점");
    expect(summary.typeSummary).not.toContain("강점이 잘 드러나요");
    expect(summary.typeSummary).toContain("특정 축을 단정하기보다");
  });

  it("grounds detailed reports in current axis labels and selected answers", () => {
    const strongResult = makeResult({ P: 82, E: 78, U: 72, M: 45, H: 42 });
    const growthResult = makeResult({ P: 35, E: 34, U: 25, M: 20, H: 18 });

    const strongReport = buildDetailedReport(strongResult);
    const growthReport = buildDetailedReport(growthResult);

    expect(strongReport).toContain("강점 범위");
    expect(growthReport).toContain("비교적 안정적으로");
    expect(strongReport).not.toBe(growthReport);
    expect(strongReport).toContain("상황 답변에서는");
    expect(strongReport).not.toContain("집중이 끊겨요");
    expect(strongReport).not.toContain("자주 놓쳐요");
  });
});
