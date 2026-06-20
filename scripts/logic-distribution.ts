import { calculateLearningTypeDistribution } from "../src/domain/distribution";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

const distribution = calculateLearningTypeDistribution();

console.log("학습성향 응답공간 분포");
console.log("");
console.log(`문항: ${distribution.questionCount}개`);
console.log(`동의형: ${distribution.likertCount}개`);
console.log(`상황형: ${distribution.scenarioCount}개`);
console.log(
  `전체 응답 조합: ${formatNumber(distribution.totalCombinations)}개`,
);
console.log(
  `중복 압축 원점수 상태: ${formatNumber(
    distribution.distinctRawScoreStates,
  )}개`,
);
console.log("");
console.log("| 유형 | 조합 수 | 비율 | 원점수 상태 수 | 상태 비율 |");
console.log("|---|---:|---:|---:|---:|");

for (const row of distribution.typeRows) {
  console.log(
    `| ${row.name} | ${formatNumber(row.count)} | ${formatPercent(
      row.percent,
    )} | ${formatNumber(row.scoreStates)} | ${formatPercent(
      row.scoreStatePercent,
    )} |`,
  );
}

console.log("");
console.log("상위 유형 + 축 라벨 조합");
console.log("");
console.log("| 유형 | 축 라벨 조합 | 조합 수 | 비율 |");
console.log("|---|---|---:|---:|");

for (const row of distribution.typeLabelTopRows.slice(0, 10)) {
  console.log(
    `| ${row.name} | ${row.labelSummary} | ${formatNumber(
      row.count,
    )} | ${formatPercent(row.percent)} |`,
  );
}
