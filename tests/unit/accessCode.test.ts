import { describe, expect, it } from "vitest";
import {
  createAccessSessionToken,
  deriveAccessCodeSeed,
  generateAccessCode,
  getAccessExpiry,
  normalizeAccessCode,
  validateAccessCode,
  verifyMasterCode,
} from "../../src/domain/accessCode";

const DEV_VERIFIER_DIGEST =
  "467934acc99f69b35a94c1c9a1f7b6345aee56695f78e4c5b80468f7477799ca";
const CODE_SEED_A =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const CODE_SEED_B =
  "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

describe("access code domain", () => {
  it("normalizes pasted codes to the canonical uppercase format", () => {
    expect(normalizeAccessCode("  ql ty-9f  ")).toBe("QLTY9F");
  });

  it("generates deterministic six-character classroom access codes with bounded valid days", () => {
    const issuedAt = new Date(2026, 5, 23, 15, 30);

    const first = generateAccessCode({
      issuedAt,
      validDays: 7,
      codeSeedDigest: CODE_SEED_A,
    });
    const second = generateAccessCode({
      issuedAt,
      validDays: 7,
      codeSeedDigest: CODE_SEED_A,
    });

    expect(first).toBe(second);
    expect(first).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    expect(() =>
      generateAccessCode({
        issuedAt,
        validDays: 0,
        codeSeedDigest: CODE_SEED_A,
      }),
    ).toThrow(/validDays/);
    expect(() =>
      generateAccessCode({
        issuedAt,
        validDays: 91,
        codeSeedDigest: CODE_SEED_A,
      }),
    ).toThrow(/validDays/);
  });

  it("validates generated codes through the local end of the final valid day", () => {
    const code = generateAccessCode({
      issuedAt: new Date(2026, 5, 23, 9, 0),
      validDays: 1,
      codeSeedDigest: CODE_SEED_A,
    });

    expect(
      validateAccessCode(code, new Date(2026, 5, 23, 23, 59, 59), CODE_SEED_A),
    ).toMatchObject({
      ok: true,
      issuedAt: new Date(2026, 5, 23, 0, 0, 0),
      validDays: 1,
      expiresAt: new Date(2026, 5, 24, 0, 0, 0),
    });
    expect(
      validateAccessCode(code, new Date(2026, 5, 24, 0, 0, 0), CODE_SEED_A),
    ).toEqual({
      ok: false,
      reason: "expired",
      code,
      expiresAt: new Date(2026, 5, 24, 0, 0, 0),
    });
    expect(
      getAccessExpiry(code, new Date(2026, 5, 23, 12, 0), CODE_SEED_A),
    ).toEqual(new Date(2026, 5, 24, 0, 0, 0));
  });

  it("invalidates generated codes when the access-code revision seed changes", () => {
    const code = generateAccessCode({
      issuedAt: new Date(2026, 5, 23, 9, 0),
      validDays: 7,
      codeSeedDigest: CODE_SEED_A,
    });

    expect(validateAccessCode(code, new Date(2026, 5, 24, 12, 0), CODE_SEED_A)).toMatchObject({
      ok: true,
    });
    expect(validateAccessCode(code, new Date(2026, 5, 24, 12, 0), CODE_SEED_B)).toMatchObject({
      ok: false,
      reason: "signature-mismatch",
    });
    expect(verifyMasterCode("development-master-code", DEV_VERIFIER_DIGEST)).toBe(true);
  });

  it("derives session-specific code seeds for classroom links", () => {
    const sessionASeed = deriveAccessCodeSeed(CODE_SEED_A, "ABCDEFGH");
    const sessionASeedAgain = deriveAccessCodeSeed(CODE_SEED_A, "ABCDEFGH");
    const sessionBSeed = deriveAccessCodeSeed(CODE_SEED_A, "BCDEFGHJ");
    const issuedAt = new Date(2026, 5, 23, 9, 0);
    const code = generateAccessCode({
      issuedAt,
      validDays: 1,
      codeSeedDigest: sessionASeed,
    });

    expect(sessionASeed).toBe(sessionASeedAgain);
    expect(sessionASeed).toMatch(/^[a-f0-9]{64}$/);
    expect(sessionASeed).not.toBe(CODE_SEED_A);
    expect(sessionASeed).not.toBe(sessionBSeed);
    expect(validateAccessCode(code, new Date(2026, 5, 23, 12, 0), sessionASeed)).toMatchObject({
      ok: true,
    });
    expect(validateAccessCode(code, new Date(2026, 5, 23, 12, 0), sessionBSeed)).toMatchObject({
      ok: false,
      reason: "signature-mismatch",
    });
  });

  it("creates eight-character classroom session tokens without confusing letters", () => {
    const token = createAccessSessionToken();

    expect(token).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
  });

  it("rejects malformed and unknown short codes", () => {
    const now = new Date(2026, 5, 23, 12, 0);
    const valid = generateAccessCode({
      issuedAt: now,
      validDays: 7,
      codeSeedDigest: CODE_SEED_A,
    });

    expect(validateAccessCode("ABC", now, CODE_SEED_A)).toMatchObject({
      ok: false,
      reason: "malformed",
    });
    expect(validateAccessCode("ABC10Z", now, CODE_SEED_A)).toMatchObject({
      ok: false,
      reason: "malformed",
    });
    const tampered = `${valid.slice(0, -1)}${valid.endsWith("A") ? "B" : "A"}`;
    expect(validateAccessCode(tampered, now, CODE_SEED_A)).toMatchObject({
      ok: false,
      reason: "signature-mismatch",
    });
  });

  it("verifies a master code against only the derived digest", () => {
    expect(verifyMasterCode("development-master-code", DEV_VERIFIER_DIGEST)).toBe(true);
    expect(verifyMasterCode("wrong-master-code", DEV_VERIFIER_DIGEST)).toBe(false);
  });
});
