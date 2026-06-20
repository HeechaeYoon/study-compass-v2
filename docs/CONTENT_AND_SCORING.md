# Content and Scoring Specification

> 구현자가 이 문서를 데이터 파일로 직접 옮길 수 있도록 작성했다.  
> 이 도구의 점수와 유형 기준은 수업용 초기 설계값이며 표준화 검사 규준이 아니다.

---

## 1. 학생 화면의 5개 축

```ts
export type Axis = "P" | "E" | "U" | "M" | "H";
```

| 코드 | 이름 | 정의 |
|---|---|---|
| P | 계획 세우기 | 목표를 정하고 공부 순서를 잡는 힘 |
| E | 실행 유지하기 | 시작한 공부를 집중해서 이어가는 힘 |
| U | 이해 방법 찾기 | 나에게 맞는 방식으로 개념을 이해하는 힘 |
| M | 점검하고 고치기 | 공부가 잘 되고 있는지 확인하고 방법을 수정하는 힘 |
| H | 질문과 도움 활용하기 | 막힐 때 자료, 친구, 선생님, AI를 적절히 활용하는 힘 |

```ts
export const AXIS_NAMES: Record<Axis, string> = {
  P: "계획 세우기",
  E: "실행 유지하기",
  U: "이해 방법 찾기",
  M: "점검하고 고치기",
  H: "질문과 도움 활용하기",
};
```

```ts
export const AXIS_SHORT_NAMES: Record<Axis, string> = {
  P: "계획",
  E: "실행",
  U: "이해",
  M: "점검",
  H: "도움",
};
```

---

## 2. 문항 타입

```ts
export type AxisScores = Record<Axis, number>;
export type LikertValue = 1 | 2 | 3 | 4;

export type LikertQuestion = {
  id: string;
  type: "likert";
  axis: Axis;
  text: string;
  axisLabel: string;
};

export type ScenarioOption = {
  id: string;
  text: string;
  scores: AxisScores;
  dotLevel?: 1 | 2 | 3 | 4 | 5;
};

export type ScenarioQuestion = {
  id: string;
  type: "scenario";
  text: string;
  axisLabel: string;
  options: ScenarioOption[];
};

export type Question = LikertQuestion | ScenarioQuestion;
```

---

## 3. 동의형 선택지

```ts
export const LIKERT_OPTIONS = [
  { value: 1, label: "전혀 아니다", dotLevel: 1 },
  { value: 2, label: "별로 아니다", dotLevel: 2 },
  { value: 3, label: "대체로 그렇다", dotLevel: 3 },
  { value: 4, label: "매우 그렇다", dotLevel: 4 },
] as const;
```

중립 선택지는 두지 않는다.

---

## 4. 16문항 기본형

### Q01–Q05

```ts
{
  id: "Q01",
  type: "likert",
  axis: "P",
  axisLabel: "계획",
  text: "공부를 시작하기 전에 오늘 끝낼 목표를 짧게 정하는 편이다.",
}
```

```ts
{
  id: "Q02",
  type: "likert",
  axis: "P",
  axisLabel: "계획",
  text: "해야 할 공부가 여러 개 있으면 무엇부터 할지 순서를 정하고 시작한다.",
}
```

```ts
{
  id: "Q03",
  type: "likert",
  axis: "P",
  axisLabel: "계획",
  text: "공부할 양이 많아 보이면 작은 단위로 나누어 시작한다.",
}
```

```ts
{
  id: "Q04",
  type: "likert",
  axis: "E",
  axisLabel: "실행",
  text: "공부를 시작하면 정한 시간 동안 다른 일을 줄이려고 노력한다.",
}
```

```ts
{
  id: "Q05",
  type: "likert",
  axis: "E",
  axisLabel: "실행",
  text: "하기 싫은 과목도 최소한 정한 분량은 끝내려고 한다.",
}
```

### Q06 — 참조 화면과 동일한 5카드 구성

```ts
{
  id: "Q06",
  type: "scenario",
  axisLabel: "실행",
  text: "공부할 때, 나는 주로 어떤 방식으로 집중하며 실천하나요?",
  options: [
    {
      id: "A",
      text: "집중하기 어려워요.",
      dotLevel: 1,
      scores: { P: 0, E: 0, U: 0, M: 0, H: 0 },
    },
    {
      id: "B",
      text: "대체로 집중하는 편이에요.",
      dotLevel: 2,
      scores: { P: 0, E: 1, U: 0, M: 0, H: 0 },
    },
    {
      id: "C",
      text: "상황에 따라 집중이 달라져요.",
      dotLevel: 3,
      scores: { P: 1, E: 2, U: 0, M: 1, H: 0 },
    },
    {
      id: "D",
      text: "대부분 집중해서 해요.",
      dotLevel: 4,
      scores: { P: 1, E: 3, U: 0, M: 0, H: 0 },
    },
    {
      id: "E",
      text: "매우 집중해서 몰입하는 편이에요.",
      dotLevel: 5,
      scores: { P: 0, E: 4, U: 0, M: 0, H: 0 },
    },
  ],
}
```

Q06은 4점 동의척도가 아니라 상황형 자기기술 문항이다. 따라서 5개 선택지를 허용한다.

### Q07–Q12

```ts
{
  id: "Q07",
  type: "likert",
  axis: "U",
  axisLabel: "이해",
  text: "새 개념을 배울 때 예시, 그림, 표, 내 말 설명 중 하나로 바꿔 이해하려고 한다.",
}
```

```ts
{
  id: "Q08",
  type: "likert",
  axis: "U",
  axisLabel: "이해",
  text: "문제를 풀 때 답만 확인하기보다 왜 그런 답이 나오는지 생각해본다.",
}
```

```ts
{
  id: "Q09",
  type: "likert",
  axis: "U",
  axisLabel: "이해",
  text: "외워야 할 내용과 이해해야 할 내용을 구분해서 공부하려고 한다.",
}
```

```ts
{
  id: "Q10",
  type: "likert",
  axis: "M",
  axisLabel: "점검",
  text: "공부 중간이나 끝에 내가 제대로 이해했는지 확인한다.",
}
```

```ts
{
  id: "Q11",
  type: "likert",
  axis: "M",
  axisLabel: "점검",
  text: "틀린 문제나 헷갈린 부분은 이유를 찾아 다음 공부 방법을 바꿔본다.",
}
```

```ts
{
  id: "Q12",
  type: "likert",
  axis: "H",
  axisLabel: "도움",
  text: "막힐 때 교과서, 필기, 친구, 선생님, AI 같은 도움을 적절히 활용한다.",
}
```

### Q13 — 시작 전략

```ts
{
  id: "Q13",
  type: "scenario",
  axisLabel: "계획",
  text: "공부를 시작하기 전에 나는 보통 무엇을 먼저 하나요?",
  options: [
    {
      id: "A",
      text: "오늘 끝낼 목표와 순서를 먼저 정한다.",
      scores: { P: 3, E: 0, U: 0, M: 1, H: 0 },
    },
    {
      id: "B",
      text: "쉬운 문제 하나부터 풀면서 공부를 시작한다.",
      scores: { P: 1, E: 3, U: 0, M: 0, H: 0 },
    },
    {
      id: "C",
      text: "개념 설명이나 예시를 먼저 찾아본다.",
      scores: { P: 0, E: 0, U: 3, M: 0, H: 1 },
    },
    {
      id: "D",
      text: "아는 것과 모르는 것을 먼저 표시한다.",
      scores: { P: 1, E: 0, U: 0, M: 3, H: 0 },
    },
    {
      id: "E",
      text: "공부 방향을 친구, 선생님, AI, 자료에서 먼저 확인한다.",
      scores: { P: 0, E: 0, U: 0, M: 1, H: 3 },
    },
  ],
}
```

### Q14 — 도움 질문의 질

```ts
{
  id: "Q14",
  type: "likert",
  axis: "H",
  axisLabel: "도움",
  text: "질문하기 전에 내가 아는 부분과 막힌 부분을 나누어 말하려고 한다.",
}
```

### Q15 — 어려운 문제

```ts
{
  id: "Q15",
  type: "scenario",
  axisLabel: "점검",
  text: "어려운 문제를 만났을 때 나는 주로 어떻게 하나요?",
  options: [
    {
      id: "A",
      text: "문제를 작게 나누고 풀이 순서를 세운다.",
      scores: { P: 3, E: 0, U: 0, M: 1, H: 0 },
    },
    {
      id: "B",
      text: "내가 풀 수 있는 부분부터 시도한다.",
      scores: { P: 0, E: 3, U: 0, M: 1, H: 0 },
    },
    {
      id: "C",
      text: "비슷한 예시나 개념 설명을 찾아 다시 이해한다.",
      scores: { P: 0, E: 0, U: 3, M: 0, H: 1 },
    },
    {
      id: "D",
      text: "어디에서 막혔는지 표시하고 이유를 찾는다.",
      scores: { P: 0, E: 0, U: 1, M: 3, H: 0 },
    },
    {
      id: "E",
      text: "질문을 정리해 친구, 선생님, AI에게 도움을 구한다.",
      scores: { P: 0, E: 0, U: 0, M: 1, H: 3 },
    },
  ],
}
```

### Q16 — 공부 후 행동

```ts
{
  id: "Q16",
  type: "scenario",
  axisLabel: "점검",
  text: "공부를 마친 뒤 나는 보통 어떻게 하나요?",
  options: [
    {
      id: "A",
      text: "다음에 무엇을 할지 공부 순서를 고친다.",
      scores: { P: 3, E: 0, U: 0, M: 1, H: 0 },
    },
    {
      id: "B",
      text: "정한 분량을 끝냈는지 보고 남은 부분을 이어간다.",
      scores: { P: 1, E: 3, U: 0, M: 0, H: 0 },
    },
    {
      id: "C",
      text: "오늘 배운 내용을 3문장이나 예시로 설명해본다.",
      scores: { P: 0, E: 0, U: 3, M: 1, H: 0 },
    },
    {
      id: "D",
      text: "헷갈린 것과 오답 원인을 짧게 기록한다.",
      scores: { P: 0, E: 0, U: 1, M: 3, H: 0 },
    },
    {
      id: "E",
      text: "남은 질문을 정리해 자료, 친구, 선생님, AI에 물어본다.",
      scores: { P: 0, E: 0, U: 0, M: 1, H: 3 },
    },
  ],
}
```

---

## 5. 축별 최소·최대 자동 계산

하드코딩하지 않는다.

### 동의형 문항

해당 축에:

- 최소 1
- 최대 4

다른 축에:

- 최소 0
- 최대 0

### 상황형 문항

각 축에 대해 모든 선택지 점수의 최소·최대를 구한다.

```ts
export function computeAxisBounds(questions: Question[]): {
  min: AxisScores;
  max: AxisScores;
} {
  const min: AxisScores = { P: 0, E: 0, U: 0, M: 0, H: 0 };
  const max: AxisScores = { P: 0, E: 0, U: 0, M: 0, H: 0 };

  for (const question of questions) {
    if (question.type === "likert") {
      min[question.axis] += 1;
      max[question.axis] += 4;
      continue;
    }

    for (const axis of ["P", "E", "U", "M", "H"] as const) {
      const values = question.options.map((option) => option.scores[axis]);
      min[axis] += Math.min(...values);
      max[axis] += Math.max(...values);
    }
  }

  return { min, max };
}
```

---

## 6. 원점수와 정규화

```ts
export function normalizeScore(
  raw: number,
  min: number,
  max: number,
): number {
  if (max <= min) return 0;

  const score = ((raw - min) / (max - min)) * 100;
  return Math.min(100, Math.max(0, Math.round(score)));
}
```

```ts
export function scoreAnswers(
  questions: Question[],
  answers: Record<string, number | string>,
): AxisScores {
  const raw: AxisScores = { P: 0, E: 0, U: 0, M: 0, H: 0 };

  for (const question of questions) {
    const answer = answers[question.id];

    if (question.type === "likert") {
      if (typeof answer !== "number") {
        throw new Error(`Missing or invalid answer: ${question.id}`);
      }
      raw[question.axis] += answer;
      continue;
    }

    if (typeof answer !== "string") {
      throw new Error(`Missing or invalid answer: ${question.id}`);
    }

    const option = question.options.find((item) => item.id === answer);
    if (!option) {
      throw new Error(`Unknown option ${answer} for ${question.id}`);
    }

    for (const axis of ["P", "E", "U", "M", "H"] as const) {
      raw[axis] += option.scores[axis];
    }
  }

  const bounds = computeAxisBounds(questions);

  return {
    P: normalizeScore(raw.P, bounds.min.P, bounds.max.P),
    E: normalizeScore(raw.E, bounds.min.E, bounds.max.E),
    U: normalizeScore(raw.U, bounds.min.U, bounds.max.U),
    M: normalizeScore(raw.M, bounds.min.M, bounds.max.M),
    H: normalizeScore(raw.H, bounds.min.H, bounds.max.H),
  };
}
```

---

## 7. 축 라벨

```ts
export type AxisLabel = "강점" | "균형" | "성장 포인트";

export function toAxisLabel(score: number): AxisLabel {
  if (score >= 70) return "강점";
  if (score >= 40) return "균형";
  return "성장 포인트";
}
```

학생 화면에서는 라벨이 중심이다.

참조 시안의 1~5 보조 숫자가 필요하면:

```ts
export function toDisplayScore(score: number): number {
  return Math.round((1 + score / 25) * 10) / 10;
}
```

0→1.0, 100→5.0이다.

---

## 8. 대표 성향 타입

```ts
export type LearningTypeId =
  | "strategy_designer"
  | "execution_driver"
  | "concept_explorer"
  | "reflection_grower"
  | "resource_user"
  | "balanced_coordinator"
  | "routine_stabilizer"
  | "foundation_builder";
```

### 기준 프로필

```ts
export const TYPE_PROFILES: Record<LearningTypeId, AxisScores> = {
  strategy_designer: { P: 82, E: 82, U: 72, M: 75, H: 62 },
  execution_driver: { P: 60, E: 85, U: 55, M: 50, H: 45 },
  concept_explorer: { P: 50, E: 50, U: 85, M: 55, H: 60 },
  reflection_grower: { P: 55, E: 55, U: 65, M: 85, H: 50 },
  resource_user: { P: 50, E: 50, U: 60, M: 60, H: 85 },
  balanced_coordinator: { P: 70, E: 70, U: 70, M: 70, H: 70 },
  routine_stabilizer: { P: 60, E: 80, U: 50, M: 65, H: 50 },
  foundation_builder: { P: 45, E: 45, U: 45, M: 45, H: 45 },
};
```

### 이름

```ts
export const TYPE_NAMES: Record<LearningTypeId, string> = {
  strategy_designer: "전략 설계형",
  execution_driver: "실행 추진형",
  concept_explorer: "개념 탐색형",
  reflection_grower: "점검 성장형",
  resource_user: "자원 활용형",
  balanced_coordinator: "균형 조율형",
  routine_stabilizer: "루틴 안정형",
  foundation_builder: "기반 정리형",
};
```

---

## 9. 유형 매칭

### 통계 함수

```ts
const AXES: Axis[] = ["P", "E", "U", "M", "H"];

export function mean(scores: AxisScores): number {
  return AXES.reduce((sum, axis) => sum + scores[axis], 0) / AXES.length;
}

export function standardDeviation(scores: AxisScores): number {
  const avg = mean(scores);
  const variance =
    AXES.reduce((sum, axis) => sum + (scores[axis] - avg) ** 2, 0) /
    AXES.length;
  return Math.sqrt(variance);
}

export function profileDistance(a: AxisScores, b: AxisScores): number {
  const squared =
    AXES.reduce((sum, axis) => sum + (a[axis] - b[axis]) ** 2, 0) /
    AXES.length;
  return Math.sqrt(squared);
}

export function profileSimilarity(a: AxisScores, b: AxisScores): number {
  return 1 - profileDistance(a, b) / 100;
}
```

### 특수 규칙

1. 전체 평균 `< 50`이고 최고 축 `< 60`이면 `foundation_builder`
2. 표준편차 `< 8`이고 전체 평균 `>= 60`이면 `balanced_coordinator`
3. 그 외에는 모든 기준 프로필과 거리를 비교

### 보조 성향

- 1위와 2위 similarity 차이 `< 0.03`
- 또는 distance 차이 `< 5`

둘 중 하나면 `secondaryType`을 설정한다.

대표 성향은 항상 하나만 제목으로 표시한다.

---

## 10. 강점 축과 성장 축

### 강점 축

1. 점수 70 이상인 축을 내림차순
2. 최대 2개
3. 70 이상이 없다면 상위 2개
4. 동점이면 축 순서 `P, E, U, M, H`

### 성장 축

유형별 우선순위를 사용한다.

```ts
export const GROWTH_PRIORITY: Record<LearningTypeId, Axis[]> = {
  strategy_designer: ["M", "E", "H", "U", "P"],
  execution_driver: ["M", "U", "P", "H", "E"],
  concept_explorer: ["E", "P", "M", "H", "U"],
  reflection_grower: ["E", "P", "H", "U", "M"],
  resource_user: ["E", "P", "M", "U", "H"],
  balanced_coordinator: ["M", "E", "P", "H", "U"],
  routine_stabilizer: ["U", "H", "P", "M", "E"],
  foundation_builder: ["E", "P", "M", "H", "U"],
};
```

선택 알고리즘:

1. 최저 점수 `minScore`
2. `minScore + 5` 이하인 축을 후보로 둔다.
3. 유형 우선순위에서 가장 먼저 등장하는 후보를 primary growth axis로 사용한다.
4. 상세 리포트에서는 두 번째 낮은 축까지 최대 2개 표시할 수 있다.
5. 모든 축이 강점이어도 가장 낮은 축을 `다음 성장 초점`으로 제안한다.

---

## 11. 축별 해석 문구

```ts
export const AXIS_COPY = {
  P: {
    strength:
      "목표와 순서를 정하고 공부를 시작하는 힘이 비교적 자연스럽게 나타납니다.",
    balanced:
      "필요할 때 계획을 세울 수 있습니다. 목표와 분량을 더 작게 나누면 실행이 안정될 수 있습니다.",
    growth:
      "공부 전에 목표 한 개와 순서 세 개만 정해보면 시작이 더 쉬워질 수 있습니다.",
  },
  E: {
    strength:
      "시작한 공부를 정한 시간이나 분량까지 이어가는 힘이 비교적 잘 나타납니다.",
    balanced:
      "집중을 유지할 수 있지만 방해 요소를 줄이는 고정 루틴을 만들면 더 안정될 수 있습니다.",
    growth:
      "처음부터 오래 하려 하기보다 10분 또는 한 문제부터 시작하는 루틴을 만들어보세요.",
  },
  U: {
    strength:
      "개념을 예시, 연결, 자기설명으로 바꾸어 이해하려는 힘이 잘 나타납니다.",
    balanced:
      "여러 이해 방법을 사용할 수 있습니다. 내 말 설명이나 예시 만들기를 더 자주 활용해보세요.",
    growth:
      "읽고 넘어가기 전에 배운 내용을 내 말로 두세 문장 설명해보면 이해를 확인하기 좋습니다.",
  },
  M: {
    strength:
      "이해 여부와 오류 원인을 확인하고 다음 방법을 고치는 힘이 잘 나타납니다.",
    balanced:
      "공부 결과를 확인할 수 있습니다. 마지막 5분 점검을 고정하면 더 안정될 수 있습니다.",
    growth:
      "공부가 끝난 뒤 확인문제 세 개나 오답 이유 한 줄을 남겨보세요.",
  },
  H: {
    strength:
      "막힐 때 자료, 사람, AI를 적절히 찾아 활용하는 힘이 잘 나타납니다.",
    balanced:
      "필요할 때 도움을 구할 수 있습니다. 아는 부분과 막힌 부분을 나누어 질문하면 더 좋아집니다.",
    growth:
      "혼자 잠깐 시도한 뒤 막힌 지점을 한 문장으로 정리해 질문해보세요.",
  },
} as const;
```

---

## 12. 성향별 콘텐츠

### 전략 설계형

- 요약: `공부를 시작하기 전에 방향과 순서를 잡을 때 강점이 잘 드러나요.`
- 설명: `공부를 시작하기 전에 길을 먼저 그리는 지도 제작자처럼 목표와 순서를 정할 때 강점이 드러납니다.`
- 강점:
  - 목표와 순서를 정리하기 좋습니다.
  - 공부할 양이 많을 때 작은 단위로 나누기 좋습니다.
  - 계획과 개념 이해를 연결하기 쉽습니다.
- 주의:
  - 계획을 세우는 시간이 길어지면 실행이 늦어질 수 있습니다.
  - 이해했다고 느껴도 확인문제를 풀지 않으면 빈틈이 남을 수 있습니다.
- 추천:
  - 오늘 목표 1개
  - 공부 순서 3단계
  - 25분 실행 블록
  - 마지막 5분 확인문제
- 기본 미션: `목표 1개와 순서 3개만 정하고 바로 시작해보세요.`

### 실행 추진형

- 요약: `일단 시작하고 정한 분량을 밀고 나가는 힘이 좋아요.`
- 설명: `생각이 너무 길어지기보다 움직이면서 공부의 속도를 만드는 편입니다.`
- 강점:
  - 시작하는 힘
  - 분량을 마무리하는 힘
  - 짧은 루틴에서 성과를 만드는 힘
- 주의:
  - 왜 틀렸는지 점검하지 않으면 같은 실수가 반복될 수 있습니다.
  - 속도에 집중하면 개념 이해가 얕아질 수 있습니다.
- 추천:
  - 타이머 공부
  - 최소분량 루틴
  - 5분 오답 점검
  - 틀린 이유 한 줄
- 기본 미션: `공부 후 마지막 5분에 틀린 이유 한 개를 적어보세요.`

### 개념 탐색형

- 요약: `개념을 여러 방식으로 이해하려는 탐색력이 좋아요.`
- 설명: `개념을 예시, 그림, 내 말 설명 등으로 바꾸며 이해하려는 힘이 좋습니다.`
- 강점:
  - 깊이 이해하려는 태도
  - 예시와 설명을 통한 연결
  - 새로운 관점
- 주의:
  - 탐색이 길어지면 문제풀이와 마무리가 늦어질 수 있습니다.
  - 이해한 느낌만 믿으면 실제 문제에서 막힐 수 있습니다.
- 추천:
  - 자기설명
  - 예시 만들기
  - 개념도
  - 개념 정리 후 확인문제
- 기본 미션: `개념 정리 15분 후 확인문제 3개를 풀어보세요.`

### 점검 성장형

- 요약: `공부가 잘 되고 있는지 확인하고 고치는 힘이 좋아요.`
- 설명: `학습 결과를 확인하고 다음 방법을 고치는 데 강점이 있습니다.`
- 강점:
  - 오답 원인 찾기
  - 공부 방법 수정
  - 작은 테스트 활용
- 주의:
  - 점검이 많아지면 자신감이 떨어질 수 있습니다.
  - 완벽하게 고치려다 속도가 느려질 수 있습니다.
- 추천:
  - 오답 원인 3분류
  - 미니 테스트
  - 자기점검 질문
  - 다음 방법 하나 수정
- 기본 미션: `오답을 실수, 개념, 문제 읽기 중 하나로 표시해보세요.`

### 자원 활용형

- 요약: `막힐 때 필요한 자료와 도움을 찾는 힘이 좋아요.`
- 설명: `혼자만 버티지 않고 필요한 자료, 사람, AI를 활용하는 힘이 좋습니다.`
- 강점:
  - 해결에 필요한 도움 찾기
  - 친구·교사·자료·AI 활용
  - 질문으로 방향 잡기
- 주의:
  - 바로 답을 받으면 스스로 생각하는 시간이 줄 수 있습니다.
  - 질문이 막연하면 원하는 도움을 얻기 어렵습니다.
- 추천:
  - 3분 혼자 시도
  - 아는 것/막힌 곳 분리
  - AI 답변 후 확인문제
  - 질문 템플릿
- 기본 미션: `질문 전에 아는 것과 막힌 곳을 한 줄씩 적어보세요.`

### 균형 조율형

- 요약: `여러 학습전략을 상황에 맞게 조율하는 편이에요.`
- 설명: `한쪽에 치우치기보다 여러 전략을 상황에 맞게 섞어 쓰는 편입니다.`
- 강점:
  - 여러 전략의 균형
  - 과목별 방법 전환
  - 자기조절의 안정성
- 주의:
  - 뚜렷한 성장 초점이 흐려질 수 있습니다.
  - 가장 약한 한 축을 놓칠 수 있습니다.
- 추천:
  - 단원별 전략 선택표
  - 주간 점검
  - 가장 낮은 축 하나 집중
  - 학습 후 다음 전략 선택
- 기본 미션: `이번 주에는 가장 낮은 축의 미션 한 개만 골라 실천해보세요.`

### 루틴 안정형

- 요약: `정한 흐름을 유지하고 반복하면서 안정적으로 공부하는 편이에요.`
- 설명: `정해둔 흐름과 반복을 활용할 때 공부가 안정적으로 이어지는 편입니다.`
- 강점:
  - 반복과 꾸준함
  - 시간과 분량 유지
  - 복습 루틴
- 주의:
  - 새로운 이해 방법이나 질문을 덜 사용할 수 있습니다.
  - 반복만 하고 이해 점검을 놓칠 수 있습니다.
- 추천:
  - 고정 공부 루틴
  - 인출연습
  - 주기적 복습
  - 반복 후 왜 질문
- 기본 미션: `반복 공부 뒤 왜 그런지 묻는 질문 두 개를 만들어보세요.`

### 기반 정리형

- 요약: `지금은 나에게 맞는 기본 루틴을 작게 정리해보면 좋아요.`
- 설명: `아직 한 가지 성향이 뚜렷하지 않거나 기본 학습 루틴을 정리하는 단계입니다.`
- 강점:
  - 새 루틴을 만들 여지가 큼
  - 작은 성공으로 빠르게 변할 수 있음
  - 여러 방식을 시험할 수 있음
- 주의:
  - 한 번에 많이 바꾸면 지칠 수 있습니다.
  - 모든 전략을 완벽하게 하려 하기보다 하나부터 시작해야 합니다.
- 추천:
  - 10분 시작 루틴
  - 쉬운 목표 1개
  - 확인문제 2개
  - 질문 1개
- 기본 미션: `오늘은 10분 공부, 확인문제 2개, 질문 1개만 남겨보세요.`

---

## 13. 타입 콘텐츠 데이터 형태

```ts
export type LearningTypeContent = {
  name: string;
  summary: string;
  description: string;
  strengths: string[];
  cautions: string[];
  recommendedMethods: string[];
  avoidMethods: string[];
  defaultMission: string;
};
```

`avoidMethods`는 다음 방식으로 타입별 생성한다.

예:

- 전략 설계형:
  - 계획표만 만들고 실행을 미루기
  - 확인문제 없이 이해했다고 판단하기
- 실행 추진형:
  - 속도만 보고 오답 이유를 넘기기
  - 어려운 개념을 반복만 하기
- 개념 탐색형:
  - 자료만 계속 찾고 문제를 풀지 않기
  - 한 개념에 시간을 무제한 쓰기
- 점검 성장형:
  - 모든 실수를 완벽하게 고치려 하기
  - 틀렸다는 사실만 보고 자신을 평가하기
- 자원 활용형:
  - 스스로 시도하기 전에 바로 답 요청하기
  - AI 답변을 확인 없이 그대로 사용하기
- 균형 조율형:
  - 여러 전략을 동시에 늘리기
  - 성장 목표를 너무 많이 정하기
- 루틴 안정형:
  - 같은 방식만 반복하기
  - 이해 여부를 확인하지 않기
- 기반 정리형:
  - 처음부터 긴 계획표 만들기
  - 하루에 여러 습관을 동시에 바꾸기

---

## 14. 결과 문장 조합

### 대표 문장

```text
현재 답변 기준으로는 “[대표 성향]”에 가장 가까워요.
```

보조 성향:

```text
현재 답변 기준으로는 “[대표 성향]”에 가장 가깝고,
“[보조 성향]”의 특징도 일부 보여요.
```

### 결과 안내

```text
이 결과는 고정된 성격이나 능력이 아니라,
지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.
```

---

## 15. 성장 미션 생성

타입 기본 미션을 그대로 보여주지 않고 성장 축과 조합한다.

```ts
export const AXIS_MISSIONS: Record<Axis, string[]> = {
  P: [
    "오늘 목표 1개와 공부 순서 3개만 적어보세요.",
    "공부할 분량을 10~15분 단위로 나누어보세요.",
  ],
  E: [
    "10분 타이머를 켜고 가장 쉬운 한 문제부터 시작해보세요.",
    "방해되는 앱을 닫고 정한 분량 하나를 끝내보세요.",
  ],
  U: [
    "배운 개념을 내 말로 세 문장 설명해보세요.",
    "개념에 맞는 예시를 하나 직접 만들어보세요.",
  ],
  M: [
    "확인문제 세 개를 풀고 틀린 이유를 한 줄 적어보세요.",
    "공부 마지막 5분에 헷갈린 내용을 표시해보세요.",
  ],
  H: [
    "질문 전에 아는 것과 막힌 곳을 한 줄씩 적어보세요.",
    "혼자 3분 시도한 뒤 구체적인 질문 하나를 만들어보세요.",
  ],
};
```

같은 축에서도 결과 재생성 때 랜덤으로 바꾸지 않는다. 결과가 안정적으로 재현되도록 첫 번째 문장 또는 deterministic index를 사용한다.

---

## 16. AI 프롬프트 입력

```ts
export type PromptInputs = {
  subject: string;
  unit: string;
  goal: string;
  situation: string;
  difficulty: string;
  desiredHelp: string;
  memo: string;
  includeMemo: boolean;
};
```

빈 값은 `아직 입력하지 않았습니다`로 처리하거나 해당 문장을 자연스럽게 생략한다. 대괄호 placeholder를 그대로 복사하지 않는다.

---

## 17. AI 프롬프트 템플릿

```text
나는 현재 답변 기준으로 “[대표 성향]”에 가까운 학습 성향입니다.
이 결과는 고정된 성격이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.

나의 학습 프로필은 다음과 같습니다.

- 계획 세우기: [라벨]
- 실행 유지하기: [라벨]
- 이해 방법 찾기: [라벨]
- 점검하고 고치기: [라벨]
- 질문과 도움 활용하기: [라벨]

나의 주요 강점:
[강점 요약 2~3문장]

주의할 점:
[주의점 1~2문장]

이번에 키워볼 성장 포인트:
[축 이름] — [축별 성장 설명]

나에게 잘 맞을 가능성이 높은 학습 방식:
- [추천 1]
- [추천 2]
- [추천 3]
- [추천 4]

이번에 공부할 과목: [과목 또는 미입력]
이번에 공부할 단원: [단원 또는 미입력]
이번 학습 목표: [목표 또는 미입력]
현재 상황: [상황 또는 미입력]
어려운 점: [어려움 또는 미입력]
원하는 도움: [원하는 도움 또는 미입력]

[메모 포함 선택 시]
내가 보기엔 이런 점도 있습니다:
[학생 메모]

내 성향과 현재 상황을 고려해서 오늘 바로 실천할 수 있는 자기주도학습 계획을 추천해주세요.

조건:
1. 전체 계획은 30~40분 안에 실행 가능해야 합니다.
2. 너무 복잡하지 않게 4~6단계로 나누어주세요.
3. 각 단계에서 내가 무엇을 해야 하는지 구체적으로 써주세요.
4. 내가 막힐 때 사용할 수 있는 도움 요청 방법을 포함해주세요.
5. 마지막에 스스로 점검할 질문 3개를 만들어주세요.
6. AI에게 다시 물어볼 수 있는 후속 질문 예시 2개도 만들어주세요.
7. 중학교 2학년 학생이 이해하기 쉬운 말로 설명해주세요.
```

---

## 18. 시작 화면 개인정보 문구

### 짧은 안내

```text
이 앱은 성격검사나 심리검사가 아닙니다.
자기주도학습 전략을 찾기 위한 자기이해 활동입니다.
결과는 고정된 성향이 아니라 현재 답변 기준의 참고 자료입니다.
```

```text
이름이나 별명 입력은 선택입니다.
입력하지 않아도 앱을 사용할 수 있습니다.
```

```text
답변, 결과, 메모는 서버로 전송되지 않습니다.
저장 기능을 사용할 경우 결과는 이 기기의 브라우저에만 저장됩니다.
저장된 결과와 메모는 언제든 삭제할 수 있습니다.
```

### 아이콘 요약

- `이름 대신 닉네임 사용 가능`
- `응답은 외부로 전송하지 않음`
- `결과는 이 기기에서만 확인`
- `저장 결과는 언제든 삭제 가능`

---

## 19. 결과 화면 안내

```text
현재 답변 기준으로 가장 가까운 학습 성향입니다.
고정된 성격이나 능력이 아니라, 다음 학습전략을 고르는 데 도움을 주기 위한 참고 자료입니다.
```

---

## 20. 메모 문구

제목:

```text
내가 보기엔 다른 점
```

설명:

```text
결과가 나와 조금 다르게 느껴질 수 있어요.
내가 보기엔 다른 점이 있다면 여기에 적어보세요.
```

체크박스:

```text
내가 쓴 메모를 AI 챗봇용 프롬프트에 포함하기
```

기본값: false

---

## 21. 상태·알림 문구

### 복사

- 성공: `AI 프롬프트를 복사했어요.`
- 상세 리포트 성공: `상세 리포트를 복사했어요.`
- 실패: `자동 복사가 어려워요. 아래 텍스트를 길게 눌러 복사해주세요.`

### 저장

- 성공: `이 기기의 브라우저에 결과를 저장했어요.`
- 실패: `이 브라우저에서는 저장하기 어려워요. 프롬프트 복사나 이미지 저장을 이용해주세요.`

### 삭제

- 확인 제목: `저장된 결과를 삭제할까요?`
- 설명: `삭제한 결과와 메모는 다시 복구할 수 없습니다.`
- 취소: `취소`
- 확인: `삭제하기`
- 완료: `저장된 결과를 삭제했어요.`

### 이미지

- 성공: `결과 이미지를 저장했어요.`
- 실패: `이미지 저장이 어려워요. 상세 리포트 또는 AI 프롬프트 복사를 이용해주세요.`

---

## 22. 20문항 확장 후보

v1 UI에는 노출하지 않는다. 데이터 구조만 확장 가능하게 둔다.

```ts
export const EXTENSION_QUESTIONS = [
  {
    id: "Q17",
    type: "likert",
    axis: "H",
    axisLabel: "도움",
    text: "도움을 받은 뒤에는 내가 이해한 내용을 다시 확인한다.",
  },
  {
    id: "Q18",
    type: "likert",
    axis: "M",
    axisLabel: "점검",
    text: "다음에 같은 실수를 줄이기 위해 오답 원인을 짧게 기록한다.",
  },
  {
    id: "Q19",
    type: "likert",
    axis: "P",
    axisLabel: "계획",
    text: "한 번에 몰아서 하기보다 여러 번 나누어 복습하려고 한다.",
  },
  {
    id: "Q20",
    type: "likert",
    axis: "U",
    axisLabel: "이해",
    text: "외운 뒤에는 가리고 떠올리거나 스스로 문제를 내본다.",
  },
] satisfies LikertQuestion[];
```
