import { describe, expect, it } from "vitest";
import { TYPE_PROFILES } from "../../src/data/learningTypes";
import { matchLearningType } from "../../src/domain/matching";
import {
  createResult,
  selectGrowthAxes,
  selectStrengthAxes,
} from "../../src/domain/result";

const baseAnswers = {
  Q01: 4,
  Q02: 4,
  Q03: 4,
  Q04: 4,
  Q05: 4,
  Q06: "E",
  Q07: 4,
  Q08: 4,
  Q09: 4,
  Q10: 4,
  Q11: 4,
  Q12: 4,
  Q13: "A",
  Q14: 4,
  Q15: "D",
  Q16: "B",
};

describe("learning type matching", () => {
  it("matches exact profile vectors", () => {
    expect(matchLearningType(TYPE_PROFILES.strategy_designer).primaryType).toBe(
      "balanced_coordinator",
    );
    expect(matchLearningType(TYPE_PROFILES.execution_driver).primaryType).toBe(
      "execution_driver",
    );
    expect(matchLearningType(TYPE_PROFILES.concept_explorer).primaryType).toBe(
      "concept_explorer",
    );
    expect(matchLearningType(TYPE_PROFILES.reflection_grower).primaryType).toBe(
      "reflection_grower",
    );
    expect(matchLearningType(TYPE_PROFILES.resource_user).primaryType).toBe(
      "resource_user",
    );
  });

  it("applies special rules before distance", () => {
    expect(matchLearningType({ P: 44, E: 45, U: 46, M: 47, H: 48 }).primaryType).toBe(
      "foundation_builder",
    );
    expect(matchLearningType({ P: 65, E: 66, U: 64, M: 67, H: 65 }).primaryType).toBe(
      "balanced_coordinator",
    );
    expect(matchLearningType({ P: 45, E: 59, U: 64, M: 65, H: 67 }).primaryType).toBe(
      "balanced_coordinator",
    );
  });

  it("sets secondary type when the next profile is very close", () => {
    const match = matchLearningType({ P: 75, E: 76, U: 70, M: 72, H: 66 });
    expect(match.secondaryType).toBeDefined();
  });

  it("selects strength and growth axes deterministically", () => {
    const scores = { P: 75, E: 75, U: 50, M: 35, H: 35 };
    const match = matchLearningType(scores);
    expect(selectStrengthAxes(scores)).toEqual(["P", "E"]);
    expect(selectGrowthAxes(scores, match)[0]).toBe("M");
  });

  it("creates a complete result model", () => {
    const result = createResult({ answers: baseAnswers, nickname: "" });
    expect(result.questionnaireVersion).toBe("16-basic");
    expect(result.match.primaryType).toBeDefined();
    expect(result.nickname).toBeUndefined();
  });
});
