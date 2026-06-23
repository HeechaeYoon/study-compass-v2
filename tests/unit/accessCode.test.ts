import { describe, expect, it } from "vitest";
import {
  ACCESS_CODE_PREFIX,
  generateAccessCode,
  getAccessExpiry,
  normalizeAccessCode,
  validateAccessCode,
  verifyMasterCode,
} from "../../src/domain/accessCode";

const DEV_VERIFIER_DIGEST =
  "467934acc99f69b35a94c1c9a1f7b6345aee56695f78e4c5b80468f7477799ca";

describe("access code domain", () => {
  it("normalizes pasted codes to the canonical uppercase format", () => {
    expect(normalizeAccessCode("  daisy-a1-260623-007-abcd2345  ")).toBe(
      "DAISY-A1-260623-007-ABCD2345",
    );
  });

  it("generates deterministic classroom access codes with bounded valid days", () => {
    const issuedAt = new Date(2026, 5, 23, 15, 30);

    const first = generateAccessCode({
      issuedAt,
      validDays: 7,
      verifierDigest: DEV_VERIFIER_DIGEST,
    });
    const second = generateAccessCode({
      issuedAt,
      validDays: 7,
      verifierDigest: DEV_VERIFIER_DIGEST,
    });

    expect(first).toBe(second);
    expect(first).toMatch(/^DAISY-A1-260623-007-[A-Z2-9]{10}$/);
    expect(first.startsWith(`${ACCESS_CODE_PREFIX}-`)).toBe(true);
    expect(() =>
      generateAccessCode({
        issuedAt,
        validDays: 0,
        verifierDigest: DEV_VERIFIER_DIGEST,
      }),
    ).toThrow(/validDays/);
    expect(() =>
      generateAccessCode({
        issuedAt,
        validDays: 91,
        verifierDigest: DEV_VERIFIER_DIGEST,
      }),
    ).toThrow(/validDays/);
  });

  it("validates generated codes through the local end of the final valid day", () => {
    const code = generateAccessCode({
      issuedAt: new Date(2026, 5, 23, 9, 0),
      validDays: 1,
      verifierDigest: DEV_VERIFIER_DIGEST,
    });

    expect(
      validateAccessCode(code, new Date(2026, 5, 23, 23, 59, 59), DEV_VERIFIER_DIGEST),
    ).toMatchObject({
      ok: true,
      expiresAt: new Date(2026, 5, 24, 0, 0, 0),
    });
    expect(
      validateAccessCode(code, new Date(2026, 5, 24, 0, 0, 0), DEV_VERIFIER_DIGEST),
    ).toEqual({
      ok: false,
      reason: "expired",
      code,
      expiresAt: new Date(2026, 5, 24, 0, 0, 0),
    });
    expect(getAccessExpiry(code)).toEqual(new Date(2026, 5, 24, 0, 0, 0));
  });

  it("rejects malformed, wrong-prefix, invalid-date, invalid-day, and bad-signature codes", () => {
    const now = new Date(2026, 5, 23, 12, 0);
    const valid = generateAccessCode({
      issuedAt: now,
      validDays: 7,
      verifierDigest: DEV_VERIFIER_DIGEST,
    });

    expect(validateAccessCode("DAISY-A1-260623", now, DEV_VERIFIER_DIGEST)).toMatchObject({
      ok: false,
      reason: "malformed",
    });
    expect(
      validateAccessCode("ROSE-A1-260623-007-ABCDEFG234", now, DEV_VERIFIER_DIGEST),
    ).toMatchObject({
      ok: false,
      reason: "invalid-prefix",
    });
    expect(
      validateAccessCode("DAISY-B1-260623-007-ABCDEFG234", now, DEV_VERIFIER_DIGEST),
    ).toMatchObject({
      ok: false,
      reason: "invalid-version",
    });
    expect(
      validateAccessCode("DAISY-A1-260231-007-ABCDEFG234", now, DEV_VERIFIER_DIGEST),
    ).toMatchObject({
      ok: false,
      reason: "invalid-date",
    });
    expect(
      validateAccessCode("DAISY-A1-260623-000-ABCDEFG234", now, DEV_VERIFIER_DIGEST),
    ).toMatchObject({
      ok: false,
      reason: "invalid-valid-days",
    });
    const tampered = `${valid.slice(0, -1)}${valid.endsWith("A") ? "B" : "A"}`;
    expect(validateAccessCode(tampered, now, DEV_VERIFIER_DIGEST)).toMatchObject({
      ok: false,
      reason: "signature-mismatch",
    });
  });

  it("verifies a master code against only the derived digest", () => {
    expect(verifyMasterCode("development-master-code", DEV_VERIFIER_DIGEST)).toBe(true);
    expect(verifyMasterCode("wrong-master-code", DEV_VERIFIER_DIGEST)).toBe(false);
  });
});
