import { describe, expect, it } from "vitest";
import { TYPE_PROFILES } from "../../src/data/learningTypes";
import { matchLearningType } from "../../src/domain/matching";
import { calculateLearningTypeDistribution } from "../../src/domain/distribution";
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
      "strategy_designer",
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
    expect(matchLearningType(TYPE_PROFILES.balanced_coordinator).primaryType).toBe(
      "balanced_coordinator",
    );
    expect(matchLearningType(TYPE_PROFILES.routine_stabilizer).primaryType).toBe(
      "routine_stabilizer",
    );
    expect(matchLearningType(TYPE_PROFILES.foundation_builder).primaryType).toBe(
      "foundation_builder",
    );
  });

  it("keeps special handling from overriding a closer concrete profile", () => {
    expect(matchLearningType({ P: 29, E: 31, U: 30, M: 32, H: 33 }).primaryType).toBe(
      "foundation_builder",
    );
    expect(matchLearningType(TYPE_PROFILES.balanced_coordinator).primaryType).toBe(
      "balanced_coordinator",
    );
    expect(matchLearningType({ P: 35, E: 34, U: 36, M: 35, H: 34 }).primaryType).not.toBe(
      "balanced_coordinator",
    );
    expect(matchLearningType(TYPE_PROFILES.strategy_designer).primaryType).not.toBe(
      "balanced_coordinator",
    );
  });

  it("keeps the full response-space distribution within target bounds", () => {
    const distribution = calculateLearningTypeDistribution();

    expect(distribution.questionCount).toBe(16);
    expect(distribution.likertCount).toBe(12);
    expect(distribution.scenarioCount).toBe(4);
    expect(distribution.totalCombinations).toBe(10_485_760_000);

    for (const row of distribution.typeRows) {
      expect(row.percent).toBeGreaterThanOrEqual(3);
      expect(row.percent).toBeLessThanOrEqual(30);
    }

    const byId = Object.fromEntries(
      distribution.typeRows.map((row) => [row.id, row]),
    );
    expect(byId.strategy_designer?.percent).toBeGreaterThanOrEqual(3);
    expect(byId.foundation_builder?.percent).toBeLessThanOrEqual(30);
    expect(byId.balanced_coordinator?.percent).toBeLessThanOrEqual(22);
  }, 30_000);

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
