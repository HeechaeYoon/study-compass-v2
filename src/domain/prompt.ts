import { AXES, AXIS_NAMES } from "../data/axes";
import { LEARNING_TYPE_CONTENT, TYPE_NAMES } from "../data/learningTypes";
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
  includeMemo: boolean;
};

export const EMPTY_PROMPT_INPUTS: PromptInputs = {
  subject: "",
  unit: "",
  goal: "",
  situation: "",
  difficulty: "",
  desiredHelp: "",
  memo: "",
  includeMemo: false,
};

function optionalValue(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "아직 입력하지 않았습니다";
}

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildAiPrompt(result: Result, inputs: PromptInputs): string {
  const content = LEARNING_TYPE_CONTENT[result.match.primaryType];
  const summary = createResultSummary(result);
  const typeName = TYPE_NAMES[result.match.primaryType];
  const strengthSentences = content.strengths.slice(0, 3).join(" ");
  const cautionSentences = content.cautions.slice(0, 2).join(" ");
  const memo = inputs.memo.trim();
  const memoBlock =
    inputs.includeMemo && memo.length > 0
      ? `\n내가 보기엔 이런 점도 있습니다:\n${memo}\n`
      : "";

  const axisProfile = AXES.map(
    (axis) => `- ${AXIS_NAMES[axis]}: ${result.axisLabels[axis]}`,
  ).join("\n");

  return [
    `나는 현재 답변 기준으로 “${typeName}”에 가까운 학습 성향입니다.`,
    "이 결과는 고정된 성격이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.",
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
    memoBlock.trimEnd(),
    "",
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
    "",
    `참고: ${summary.safetyNote}`,
    AI_PRIVACY_NOTE,
  ]
    .filter((line, index, lines) => {
      if (line !== "") return true;
      return lines[index - 1] !== "";
    })
    .join("\n");
}

export function buildPromptPreview(result: Result, inputs: PromptInputs): string {
  return buildAiPrompt(result, inputs);
}
