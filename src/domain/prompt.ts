import { AXES, AXIS_NAMES } from "../data/axes";
import { LEARNING_TYPE_CONTENT, TYPE_NAMES } from "../data/learningTypes";
import {
  LIKERT_OPTIONS,
  QUESTIONS,
  type Question,
} from "../data/questions";
import {
  AI_PRIVACY_NOTE,
  createResultSummary,
  getAxisInterpretation,
  type Result,
} from "./result";

export type PromptInputs = {
  subject: string;
  unit: string;
  goal: string;
  situation: string;
  difficulty: string;
  desiredHelp: string;
  memo: string;
};

export type PromptMode =
  | "studyPlan"
  | "conceptLearning"
  | "studyPlanInfographic"
  | "conceptInfographic";

export type PromptModeConfig = {
  mode: PromptMode;
  label: string;
  description: string;
};

export const PROMPT_MODE_CONFIGS: PromptModeConfig[] = [
  {
    mode: "studyPlan",
    label: "공부 계획",
    description: "오늘 바로 실행할 30~40분 계획",
  },
  {
    mode: "conceptLearning",
    label: "개념 학습",
    description: "쉬운 설명, 예시, 확인문제",
  },
  {
    mode: "studyPlanInfographic",
    label: "계획 이미지",
    description: "학습 계획 인포그래픽",
  },
  {
    mode: "conceptInfographic",
    label: "개념 이미지",
    description: "개념 학습 인포그래픽",
  },
];

export const EMPTY_PROMPT_INPUTS: PromptInputs = {
  subject: "",
  unit: "",
  goal: "",
  situation: "",
  difficulty: "",
  desiredHelp: "",
  memo: "",
};

function optionalValue(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "아직 입력하지 않았습니다";
}

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function cleanLines(lines: string[]): string {
  return lines
    .map((line) => line.trimEnd())
    .filter((line, index, allLines) => {
      if (line !== "") return true;
      return allLines[index - 1] !== "";
    })
    .join("\n")
    .trim();
}

function formatAnswer(
  question: Question,
  answer: Result["answers"][string] | undefined,
): string {
  if (question.type === "likert" && typeof answer === "number") {
    const option = LIKERT_OPTIONS.find((candidate) => candidate.value === answer);
    const label = option?.label ?? "응답 확인 필요";
    return `${label} (4점 척도 중 ${answer})`;
  }

  if (question.type === "scenario" && typeof answer === "string") {
    const option = question.options.find((candidate) => candidate.id === answer);
    return option?.text ?? "응답 확인 필요";
  }

  return "응답 확인 필요";
}

export function buildQuestionAnswerContext(
  result: Result,
  questions: Question[] = QUESTIONS,
): string {
  return questions
    .map((question) => {
      const answer = result.answers[question.id];
      return [
        `${question.id}. [${question.axisLabel}] ${question.text}`,
        `답변: ${formatAnswer(question, answer)}`,
      ].join("\n");
    })
    .join("\n\n");
}

function buildCommonPromptContext(result: Result, inputs: PromptInputs): string[] {
  const content = LEARNING_TYPE_CONTENT[result.match.primaryType];
  const summary = createResultSummary(result);
  const typeName = TYPE_NAMES[result.match.primaryType];
  const strengthSentences = content.strengths.slice(0, 3).join(" ");
  const cautionSentences = content.cautions.slice(0, 2).join(" ");
  const memo = inputs.memo.trim();

  const axisProfile = AXES.map(
    (axis) => `- ${AXIS_NAMES[axis]}: ${result.axisLabels[axis]}`,
  ).join("\n");

  return [
    `나는 현재 답변 기준으로 “${typeName}”에 가까운 학습 성향입니다.`,
    "이 결과는 고정된 성격이 아니라, 고정된 능력도 아니라, 지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.",
    "",
    "나의 학습 프로필은 다음과 같습니다.",
    "",
    axisProfile,
    "",
    "이렇게 판단한 근거:",
    bulletList(summary.evidenceLines),
    "",
    "현재 활용할 수 있는 전략:",
    strengthSentences,
    "",
    "조심하면 좋은 점:",
    cautionSentences,
    "",
    "이번에 키워볼 성장 포인트:",
    `${AXIS_NAMES[result.primaryGrowthAxis]} — ${getAxisInterpretation(
      result,
      result.primaryGrowthAxis,
    )}`,
    "",
    "나에게 잘 맞을 가능성이 높은 학습 방식:",
    bulletList(content.recommendedMethods.slice(0, 4)),
    "",
    `이번에 공부할 과목: ${optionalValue(inputs.subject)}`,
    `이번에 공부할 단원: ${optionalValue(inputs.unit)}`,
    `이번 학습 목표: ${optionalValue(inputs.goal)}`,
    `현재 상황: ${optionalValue(inputs.situation)}`,
    `어려운 점: ${optionalValue(inputs.difficulty)}`,
    `원하는 도움: ${optionalValue(inputs.desiredHelp)}`,
    memo.length > 0
      ? ["", "내가 보기엔 이런 점도 있습니다:", memo].join("\n")
      : "",
    "",
    "문항과 답변 전체 맥락:",
    buildQuestionAnswerContext(result),
    "",
    `참고: ${summary.safetyNote}`,
    AI_PRIVACY_NOTE,
  ];
}

function buildModeInstructions(mode: PromptMode): string[] {
  if (mode === "conceptLearning") {
    return [
      "위의 학습 성향, 현재 입력, 문항과 답변 맥락을 고려해서 내가 지금 공부할 단원을 이해할 수 있도록 개념 학습용 설명을 만들어주세요.",
      "",
      "조건:",
      "1. 중학교 2학년 학생이 이해하기 쉬운 말로 설명해주세요.",
      "2. 핵심 개념 3~5개를 먼저 정리해주세요.",
      "3. 각 개념마다 쉬운 예시나 비유를 하나씩 넣어주세요.",
      "4. 내가 헷갈릴 만한 오개념이나 실수 포인트를 알려주세요.",
      "5. 마지막에 확인문제 3개와 간단한 채점 기준을 만들어주세요.",
      "6. 내가 AI에게 다시 물어볼 수 있는 후속 질문 예시 2개도 만들어주세요.",
      "7. 내가 쓴 정보에 이름, 연락처, 민감한 개인정보가 있다면 사용하지 말라고 알려주세요.",
    ];
  }

  if (mode === "studyPlanInfographic") {
    return [
      "위 정보를 참고해 Gemini 또는 ChatGPT의 이미지 생성 기능에 넣을 학습 계획 인포그래픽 프롬프트를 만들어주세요.",
      "",
      "이미지 생성 프롬프트 조건:",
      "1. 한국어 중학생용 학습 계획 인포그래픽으로 만들어주세요.",
      "2. 16:9 가로형 또는 A4 세로형 중 하나를 명확히 지정해주세요.",
      "3. 30~40분 안에 실행할 수 있는 4~6단계 학습 타임라인을 중심으로 구성해주세요.",
      "4. 계획, 실행, 이해, 점검, 도움 요청 흐름이 한눈에 보이게 해주세요.",
      "5. 색감은 따뜻한 노트, 연필, 부드러운 파란색과 민트색 중심으로 요청해주세요.",
      "6. 문항과 답변은 디자인 참고 맥락으로만 사용하고, 이미지에 그대로 쓰지 말 것이라고 명시해주세요.",
      "7. 이름, 연락처, 민감한 개인정보, 원문 답변, 점수, 고정된 성향 라벨은 이미지에 넣지 말라고 명시해주세요.",
      "8. 최종 출력은 바로 복사해 이미지 생성 AI에 붙여넣을 수 있는 하나의 프롬프트로 작성해주세요.",
    ];
  }

  if (mode === "conceptInfographic") {
    return [
      "위 정보를 참고해 Gemini 또는 ChatGPT의 이미지 생성 기능에 넣을 개념 학습 인포그래픽 프롬프트를 만들어주세요.",
      "",
      "이미지 생성 프롬프트 조건:",
      "1. 한국어 중학생용 개념 학습 인포그래픽으로 만들어주세요.",
      "2. 핵심 개념 구조도, 쉬운 예시, 오개념 주의, 미니 퀴즈 영역을 포함해주세요.",
      "3. 과목이나 단원이 비어 있으면 특정 단원명 대신 '오늘 배울 개념'처럼 자연스럽게 표현해주세요.",
      "4. 텍스트는 짧은 제목과 짧은 설명 위주로 구성해 읽기 쉽게 요청해주세요.",
      "5. 색감은 따뜻한 노트, 연필, 부드러운 파란색과 민트색 중심으로 요청해주세요.",
      "6. 문항과 답변은 디자인 참고 맥락으로만 사용하고, 이미지에 그대로 쓰지 말 것이라고 명시해주세요.",
      "7. 이름, 연락처, 민감한 개인정보, 원문 답변, 점수, 고정된 성향 라벨은 이미지에 넣지 말라고 명시해주세요.",
      "8. 최종 출력은 바로 복사해 이미지 생성 AI에 붙여넣을 수 있는 하나의 프롬프트로 작성해주세요.",
    ];
  }

  return [
    "내 성향과 현재 상황을 고려해서 오늘 바로 실천할 수 있는 자기주도학습 계획을 추천해주세요.",
    "",
    "조건:",
    "1. 전체 계획은 30~40분 안에 실행 가능해야 합니다.",
    "2. 너무 복잡하지 않게 4~6단계로 나누어주세요.",
    "3. 각 단계에서 내가 무엇을 해야 하는지 구체적으로 써주세요.",
    "4. 내가 막힐 때 사용할 수 있는 도움 요청 방법을 포함해주세요.",
    "5. 마지막에 스스로 점검할 질문 3개를 만들어주세요.",
    "6. AI에게 다시 물어볼 수 있는 후속 질문 예시 2개도 만들어주세요.",
    "7. 중학교 2학년 학생이 이해하기 쉬운 말로 설명해주세요.",
    "8. 내가 쓴 정보에 이름, 연락처, 민감한 개인정보가 있다면 사용하지 말라고 알려주세요.",
  ];
}

export function buildPrompt(
  result: Result,
  inputs: PromptInputs,
  mode: PromptMode = "studyPlan",
): string {
  return cleanLines([
    ...buildCommonPromptContext(result, inputs),
    "",
    ...buildModeInstructions(mode),
  ]);
}

export function buildAiPrompt(result: Result, inputs: PromptInputs): string {
  return buildPrompt(result, inputs, "studyPlan");
}

export function buildPromptPreview(result: Result, inputs: PromptInputs): string {
  return buildPrompt(result, inputs, "studyPlan");
}
