/// <reference types="node" />

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  ACCESS_VERIFIER_DEFINE_KEY,
  DEVELOPMENT_MASTER_CODE,
  buildAccessVerifierDefine,
} from "../../vite.config";

function expectedDigest(masterCode: string): string {
  return createHash("sha256")
    .update(`study-compass-v2:${masterCode}`)
    .digest("hex");
}

describe("vite access verifier config", () => {
  it("uses unprefixed MASTER_CODE and injects only its digest", () => {
    const define = buildAccessVerifierDefine({
      command: "build",
      mode: "production",
      env: {
        MASTER_CODE: "teacher-secret",
        VITE_MASTER_CODE: "wrong-prefixed-secret",
      },
    });

    expect(Object.keys(define)).toEqual([ACCESS_VERIFIER_DEFINE_KEY]);
    expect(JSON.parse(define[ACCESS_VERIFIER_DEFINE_KEY])).toBe(
      expectedDigest("teacher-secret"),
    );
    expect(JSON.stringify(define)).not.toContain("teacher-secret");
    expect(JSON.stringify(define)).not.toContain("wrong-prefixed-secret");
  });

  it("uses a deterministic non-production fallback", () => {
    const define = buildAccessVerifierDefine({
      command: "serve",
      mode: "development",
      env: {},
    });

    expect(JSON.parse(define[ACCESS_VERIFIER_DEFINE_KEY])).toBe(
      expectedDigest(DEVELOPMENT_MASTER_CODE),
    );
    expect(JSON.stringify(define)).not.toContain(DEVELOPMENT_MASTER_CODE);
  });

  it("fails production builds when MASTER_CODE is missing", () => {
    expect(() =>
      buildAccessVerifierDefine({
        command: "build",
        mode: "production",
        env: {},
      }),
    ).toThrow("MASTER_CODE must be set for production builds.");
    expect(() =>
      buildAccessVerifierDefine({
        command: "build",
        mode: "production",
        env: { MASTER_CODE: "" },
      }),
    ).toThrow("MASTER_CODE must be set for production builds.");
  });
});
