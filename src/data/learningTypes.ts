import { AXES, type Axis, type AxisScores } from "./axes";

export type LearningTypeId =
  | "strategy_designer"
  | "execution_driver"
  | "concept_explorer"
  | "reflection_grower"
  | "resource_user"
  | "balanced_coordinator"
  | "routine_stabilizer"
  | "foundation_builder";

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

export const TYPE_PROFILES: Record<LearningTypeId, AxisScores> = {
  strategy_designer: { P: 70, E: 58, U: 50, M: 74, H: 44 },
  execution_driver: { P: 58, E: 84, U: 56, M: 50, H: 44 },
  concept_explorer: { P: 47, E: 47, U: 83, M: 56, H: 61 },
  reflection_grower: { P: 53, E: 53, U: 61, M: 83, H: 50 },
  resource_user: { P: 47, E: 47, U: 61, M: 56, H: 83 },
  balanced_coordinator: { P: 48, E: 48, U: 48, M: 50, H: 48 },
  routine_stabilizer: { P: 58, E: 74, U: 50, M: 67, H: 50 },
  foundation_builder: { P: 24, E: 24, U: 24, M: 24, H: 24 },
};

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

export const LEARNING_TYPE_CONTENT: Record<
  LearningTypeId,
  LearningTypeContent
> = {
  strategy_designer: {
    name: TYPE_NAMES.strategy_designer,
    summary:
      "공부를 시작하기 전에 방향과 순서를 잡는 전략이 잘 맞을 수 있어요.",
    description:
      "공부를 시작하기 전에 길을 먼저 그리는 지도 제작자처럼 목표와 순서를 정할 때 흐름이 안정될 수 있습니다.",
    strengths: [
      "목표와 순서를 정리하기 좋습니다.",
      "공부할 양이 많을 때 작은 단위로 나누기 좋습니다.",
      "계획과 개념 이해를 연결하기 쉽습니다.",
    ],
    cautions: [
      "계획을 세우는 시간이 길어지면 실행이 늦어질 수 있습니다.",
      "이해했다고 느껴도 확인문제를 풀지 않으면 빈틈이 남을 수 있습니다.",
    ],
    recommendedMethods: [
      "오늘 목표 1개",
      "공부 순서 3단계",
      "25분 실행 블록",
      "마지막 5분 확인문제",
    ],
    avoidMethods: [
      "계획표만 만들고 실행을 미루기",
      "확인문제 없이 이해했다고 판단하기",
    ],
    defaultMission: "목표 1개와 순서 3개만 정하고 바로 시작해보세요.",
  },
  execution_driver: {
    name: TYPE_NAMES.execution_driver,
    summary: "일단 시작하고 정한 분량을 밀고 나가는 힘이 좋아요.",
    description:
      "생각이 너무 길어지기보다 움직이면서 공부의 속도를 만드는 편입니다.",
    strengths: ["시작하는 힘", "분량을 마무리하는 힘", "짧은 루틴에서 성과를 만드는 힘"],
    cautions: [
      "왜 틀렸는지 점검하지 않으면 같은 실수가 반복될 수 있습니다.",
      "속도에 집중하면 개념 이해가 얕아질 수 있습니다.",
    ],
    recommendedMethods: ["타이머 공부", "최소분량 루틴", "5분 오답 점검", "틀린 이유 한 줄"],
    avoidMethods: ["속도만 보고 오답 이유를 넘기기", "어려운 개념을 반복만 하기"],
    defaultMission: "공부 후 마지막 5분에 틀린 이유 한 개를 적어보세요.",
  },
  concept_explorer: {
    name: TYPE_NAMES.concept_explorer,
    summary: "개념을 여러 방식으로 이해하려는 탐색력이 좋아요.",
    description:
      "개념을 예시, 그림, 내 말 설명 등으로 바꾸며 이해하려는 힘이 좋습니다.",
    strengths: ["깊이 이해하려는 태도", "예시와 설명을 통한 연결", "새로운 관점"],
    cautions: [
      "탐색이 길어지면 문제풀이와 마무리가 늦어질 수 있습니다.",
      "이해한 느낌만 믿으면 실제 문제에서 막힐 수 있습니다.",
    ],
    recommendedMethods: ["자기설명", "예시 만들기", "개념도", "개념 정리 후 확인문제"],
    avoidMethods: ["자료만 계속 찾고 문제를 풀지 않기", "한 개념에 시간을 무제한 쓰기"],
    defaultMission: "개념 정리 15분 후 확인문제 3개를 풀어보세요.",
  },
  reflection_grower: {
    name: TYPE_NAMES.reflection_grower,
    summary: "공부가 잘 되고 있는지 확인하고 고치는 힘이 좋아요.",
    description: "학습 결과를 확인하고 다음 방법을 고치는 전략이 잘 맞을 수 있습니다.",
    strengths: ["오답 원인 찾기", "공부 방법 수정", "작은 테스트 활용"],
    cautions: [
      "점검이 많아지면 자신감이 떨어질 수 있습니다.",
      "완벽하게 고치려다 속도가 느려질 수 있습니다.",
    ],
    recommendedMethods: ["오답 원인 3분류", "미니 테스트", "자기점검 질문", "다음 방법 하나 수정"],
    avoidMethods: ["모든 실수를 완벽하게 고치려 하기", "틀렸다는 사실만 보고 자신을 평가하기"],
    defaultMission: "오답을 실수, 개념, 문제 읽기 중 하나로 표시해보세요.",
  },
  resource_user: {
    name: TYPE_NAMES.resource_user,
    summary: "막힐 때 필요한 자료와 도움을 찾는 힘이 좋아요.",
    description:
      "혼자만 버티지 않고 필요한 자료, 사람, AI를 활용하는 힘이 좋습니다.",
    strengths: ["해결에 필요한 도움 찾기", "친구·교사·자료·AI 활용", "질문으로 방향 잡기"],
    cautions: [
      "바로 답을 받으면 스스로 생각하는 시간이 줄 수 있습니다.",
      "질문이 막연하면 원하는 도움을 얻기 어렵습니다.",
    ],
    recommendedMethods: ["3분 혼자 시도", "아는 것/막힌 곳 분리", "AI 답변 후 확인문제", "질문 템플릿"],
    avoidMethods: ["스스로 시도하기 전에 바로 답 요청하기", "AI 답변을 확인 없이 그대로 사용하기"],
    defaultMission: "질문 전에 아는 것과 막힌 곳을 한 줄씩 적어보세요.",
  },
  balanced_coordinator: {
    name: TYPE_NAMES.balanced_coordinator,
    summary: "여러 학습전략을 상황에 맞게 조율하는 편이에요.",
    description: "한쪽에 치우치기보다 여러 전략을 상황에 맞게 섞어 쓰는 편입니다.",
    strengths: ["여러 전략의 균형", "과목별 방법 전환", "자기조절의 안정성"],
    cautions: ["뚜렷한 성장 초점이 흐려질 수 있습니다.", "성장 포인트 한 축을 놓칠 수 있습니다."],
    recommendedMethods: ["단원별 전략 선택표", "주간 점검", "성장 포인트 하나 집중", "학습 후 다음 전략 선택"],
    avoidMethods: ["여러 전략을 동시에 늘리기", "성장 목표를 너무 많이 정하기"],
    defaultMission: "이번 주에는 성장 포인트 미션 한 개만 골라 실천해보세요.",
  },
  routine_stabilizer: {
    name: TYPE_NAMES.routine_stabilizer,
    summary: "정한 흐름을 유지하고 반복하면서 안정적으로 공부하는 편이에요.",
    description: "정해둔 흐름과 반복을 활용할 때 공부가 안정적으로 이어지는 편입니다.",
    strengths: ["반복과 꾸준함", "시간과 분량 유지", "복습 루틴"],
    cautions: ["새로운 이해 방법이나 질문을 덜 사용할 수 있습니다.", "반복만 하고 이해 점검을 놓칠 수 있습니다."],
    recommendedMethods: ["고정 공부 루틴", "인출연습", "주기적 복습", "반복 후 왜 질문"],
    avoidMethods: ["같은 방식만 반복하기", "이해 여부를 확인하지 않기"],
    defaultMission: "반복 공부 뒤 왜 그런지 묻는 질문 두 개를 만들어보세요.",
  },
  foundation_builder: {
    name: TYPE_NAMES.foundation_builder,
    summary: "지금은 나에게 맞는 기본 루틴을 작게 정리해보면 좋아요.",
    description: "아직 한 가지 성향이 뚜렷하지 않거나 기본 학습 루틴을 정리하는 단계입니다.",
    strengths: ["새 루틴을 만들 여지가 큼", "작은 성공으로 빠르게 변할 수 있음", "여러 방식을 시험할 수 있음"],
    cautions: [
      "한 번에 많이 바꾸면 지칠 수 있습니다.",
      "모든 전략을 완벽하게 하려 하기보다 하나부터 시작해야 합니다.",
    ],
    recommendedMethods: ["10분 시작 루틴", "쉬운 목표 1개", "확인문제 2개", "질문 1개"],
    avoidMethods: ["처음부터 긴 계획표 만들기", "하루에 여러 습관을 동시에 바꾸기"],
    defaultMission: "오늘은 10분 공부, 확인문제 2개, 질문 1개만 남겨보세요.",
  },
};

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

export const AXIS_COPY: Record<
  Axis,
  { strength: string; balanced: string; growth: string }
> = {
  P: {
    strength: "목표와 순서를 정하고 공부를 시작하는 힘이 자연스럽게 나타납니다.",
    balanced:
      "필요할 때 계획을 세울 수 있습니다. 목표와 분량을 더 작게 나누면 실행이 안정될 수 있습니다.",
    growth:
      "공부 전에 목표 한 개와 순서 세 개만 정해보면 시작이 더 쉬워질 수 있습니다.",
  },
  E: {
    strength: "시작한 공부를 정한 시간이나 분량까지 이어가는 힘이 잘 나타납니다.",
    balanced:
      "집중을 유지할 수 있지만 방해 요소를 줄이는 고정 루틴을 만들면 더 안정될 수 있습니다.",
    growth:
      "처음부터 오래 하려 하기보다 10분 또는 한 문제부터 시작하는 루틴을 만들어보세요.",
  },
  U: {
    strength: "개념을 예시, 연결, 자기설명으로 바꾸어 이해하려는 힘이 잘 나타납니다.",
    balanced:
      "여러 이해 방법을 사용할 수 있습니다. 내 말 설명이나 예시 만들기를 더 자주 활용해보세요.",
    growth:
      "읽고 넘어가기 전에 배운 내용을 내 말로 두세 문장 설명해보면 이해를 확인하기 좋습니다.",
  },
  M: {
    strength: "이해 여부와 오류 원인을 확인하고 다음 방법을 고치는 힘이 잘 나타납니다.",
    balanced:
      "공부 결과를 확인할 수 있습니다. 마지막 5분 점검을 고정하면 더 안정될 수 있습니다.",
    growth: "공부가 끝난 뒤 확인문제 세 개나 오답 이유 한 줄을 남겨보세요.",
  },
  H: {
    strength: "막힐 때 자료, 사람, AI를 적절히 찾아 활용하는 힘이 잘 나타납니다.",
    balanced:
      "필요할 때 도움을 구할 수 있습니다. 아는 부분과 막힌 부분을 나누어 질문하면 더 좋아집니다.",
    growth: "혼자 잠깐 시도한 뒤 막힌 지점을 한 문장으로 정리해 질문해보세요.",
  },
};

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

export function getAxisCopyForLabel(axis: Axis, label: "강점" | "균형" | "성장 포인트"): string {
  const copy = AXIS_COPY[axis];
  if (label === "강점") return copy.strength;
  if (label === "균형") return copy.balanced;
  return copy.growth;
}

export function getAxisOrderIndex(axis: Axis): number {
  return AXES.indexOf(axis);
}
