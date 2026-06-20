export const AXES = ["P", "E", "U", "M", "H"] as const;

export type Axis = (typeof AXES)[number];

export type AxisScores = Record<Axis, number>;

export type AxisLabel = "강점" | "균형" | "성장 포인트";

export const AXIS_NAMES: Record<Axis, string> = {
  P: "계획 세우기",
  E: "실행 유지하기",
  U: "이해 방법 찾기",
  M: "점검하고 고치기",
  H: "질문과 도움 활용하기",
};

export const AXIS_SHORT_NAMES: Record<Axis, string> = {
  P: "계획",
  E: "실행",
  U: "이해",
  M: "점검",
  H: "도움",
};

export const AXIS_DEFINITIONS: Record<Axis, string> = {
  P: "목표를 정하고 공부 순서를 잡는 힘",
  E: "시작한 공부를 집중해서 이어가는 힘",
  U: "나에게 맞는 방식으로 개념을 이해하는 힘",
  M: "공부가 잘 되고 있는지 확인하고 방법을 수정하는 힘",
  H: "막힐 때 자료, 친구, 선생님, AI를 적절히 활용하는 힘",
};

export const EMPTY_AXIS_SCORES: AxisScores = {
  P: 0,
  E: 0,
  U: 0,
  M: 0,
  H: 0,
};

export const AXIS_ACCENTS: Record<
  Axis,
  {
    className: string;
    color: string;
    pale: string;
  }
> = {
  P: { className: "axis-plan", color: "#4559DE", pale: "#EEF1FF" },
  E: { className: "axis-execute", color: "#43C99B", pale: "#E6F7EE" },
  U: { className: "axis-understand", color: "#F5BE2E", pale: "#FFF5C7" },
  M: { className: "axis-monitor", color: "#F16D48", pale: "#FFECE4" },
  H: { className: "axis-help", color: "#5371D8", pale: "#EAF0FF" },
};

export function createAxisScores(value = 0): AxisScores {
  return {
    P: value,
    E: value,
    U: value,
    M: value,
    H: value,
  };
}
