import { AXES, type Axis, type AxisScores } from "./axes";

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

export type AnswerValue = number | string;

export type AnswerMap = Record<string, AnswerValue>;

export const LIKERT_OPTIONS = [
  { value: 1, label: "전혀 아니다", dotLevel: 1 },
  { value: 2, label: "별로 아니다", dotLevel: 2 },
  { value: 3, label: "대체로 그렇다", dotLevel: 3 },
  { value: 4, label: "매우 그렇다", dotLevel: 4 },
] as const;

export const QUESTIONS: Question[] = [
  {
    id: "Q01",
    type: "likert",
    axis: "P",
    axisLabel: "계획",
    text: "공부를 시작하기 전에 오늘 끝낼 목표를 짧게 정하는 편이다.",
  },
  {
    id: "Q02",
    type: "likert",
    axis: "P",
    axisLabel: "계획",
    text: "해야 할 공부가 여러 개 있으면 무엇부터 할지 순서를 정하고 시작한다.",
  },
  {
    id: "Q03",
    type: "likert",
    axis: "P",
    axisLabel: "계획",
    text: "공부할 양이 많아 보이면 작은 단위로 나누어 시작한다.",
  },
  {
    id: "Q04",
    type: "likert",
    axis: "E",
    axisLabel: "실행",
    text: "공부를 시작하면 정한 시간 동안 다른 일을 줄이려고 노력한다.",
  },
  {
    id: "Q05",
    type: "likert",
    axis: "E",
    axisLabel: "실행",
    text: "하기 싫은 과목도 최소한 정한 분량은 끝내려고 한다.",
  },
  {
    id: "Q06",
    type: "scenario",
    axisLabel: "실행",
    text: "공부할 때, 나는 주로 어떤 방식으로 집중하며 실천하나요?",
    options: [
      {
        id: "A",
        text: "집중하기가 어려워요.",
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
  },
  {
    id: "Q07",
    type: "likert",
    axis: "U",
    axisLabel: "이해",
    text: "새 개념을 배울 때 예시, 그림, 표, 내 말 설명 중 하나로 바꿔 이해하려고 한다.",
  },
  {
    id: "Q08",
    type: "likert",
    axis: "U",
    axisLabel: "이해",
    text: "문제를 풀 때 답만 확인하기보다 왜 그런 답이 나오는지 생각해본다.",
  },
  {
    id: "Q09",
    type: "likert",
    axis: "U",
    axisLabel: "이해",
    text: "외워야 할 내용과 이해해야 할 내용을 구분해서 공부하려고 한다.",
  },
  {
    id: "Q10",
    type: "likert",
    axis: "M",
    axisLabel: "점검",
    text: "공부 중간이나 끝에 내가 제대로 이해했는지 확인한다.",
  },
  {
    id: "Q11",
    type: "likert",
    axis: "M",
    axisLabel: "점검",
    text: "틀린 문제나 헷갈린 부분은 이유를 찾아 다음 공부 방법을 바꿔본다.",
  },
  {
    id: "Q12",
    type: "likert",
    axis: "H",
    axisLabel: "도움",
    text: "막힐 때 교과서, 필기, 친구, 선생님, AI 같은 도움을 적절히 활용한다.",
  },
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
  },
  {
    id: "Q14",
    type: "likert",
    axis: "H",
    axisLabel: "도움",
    text: "질문하기 전에 내가 아는 부분과 막힌 부분을 나누어 말하려고 한다.",
  },
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
  },
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
  },
];

export function getLikertQuestionCount(questions: Question[]): number {
  return questions.filter((question) => question.type === "likert").length;
}

export function getScenarioQuestionCount(questions: Question[]): number {
  return questions.filter((question) => question.type === "scenario").length;
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((question) => question.id === id);
}

export function isAxis(value: string): value is Axis {
  return AXES.includes(value as Axis);
}
