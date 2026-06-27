/// <reference types="node" />

import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ACCESS_CODE_SEED_DEFINE_KEY,
  ACCESS_VERIFIER_DEFINE_KEY,
  DEVELOPMENT_ACCESS_CODE_REVISION,
  DEVELOPMENT_MASTER_CODE,
  buildAccessVerifierDefine,
  loadAccessVerifierEnv,
} from "../../vite.config";

function expectedDigest(masterCode: string): string {
  return createHash("sha256")
    .update(`study-compass-v2:${masterCode}`)
    .digest("hex");
}

function expectedCodeSeedDigest(revision: string): string {
  return createHash("sha256")
    .update(`study-compass-v2:access-code:${revision}`)
    .digest("hex");
}

describe("vite access verifier config", () => {
  it("uses unprefixed MASTER_CODE and injects only its digest", () => {
    const define = buildAccessVerifierDefine({
      command: "build",
      mode: "production",
      env: {
        MASTER_CODE: "teacher-secret",
        ACCESS_CODE_REVISION: "class-a-20260624",
        VITE_MASTER_CODE: "wrong-prefixed-secret",
        VITE_ACCESS_CODE_REVISION: "wrong-prefixed-revision",
      },
    });

    expect(Object.keys(define).sort()).toEqual([
      ACCESS_CODE_SEED_DEFINE_KEY,
      ACCESS_VERIFIER_DEFINE_KEY,
    ]);
    expect(JSON.parse(define[ACCESS_VERIFIER_DEFINE_KEY])).toBe(
      expectedDigest("teacher-secret"),
    );
    expect(JSON.parse(define[ACCESS_CODE_SEED_DEFINE_KEY])).toBe(
      expectedCodeSeedDigest("class-a-20260624"),
    );
    expect(JSON.stringify(define)).not.toContain("teacher-secret");
    expect(JSON.stringify(define)).not.toContain("class-a-20260624");
    expect(JSON.stringify(define)).not.toContain("wrong-prefixed-secret");
    expect(JSON.stringify(define)).not.toContain("wrong-prefixed-revision");
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
    expect(JSON.parse(define[ACCESS_CODE_SEED_DEFINE_KEY])).toBe(
      expectedCodeSeedDigest(DEVELOPMENT_ACCESS_CODE_REVISION),
    );
    expect(JSON.stringify(define)).not.toContain(DEVELOPMENT_MASTER_CODE);
    expect(JSON.stringify(define)).not.toContain(DEVELOPMENT_ACCESS_CODE_REVISION);
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

  it("loads unprefixed MASTER_CODE from env files for production builds", () => {
    const cwd = mkdtempSync(join(tmpdir(), "study-compass-env-"));
    try {
      writeFileSync(
        join(cwd, ".env.production"),
        [
          "MASTER_CODE=file-master-code",
          "ACCESS_CODE_REVISION=file-access-revision",
          "VITE_MASTER_CODE=wrong-prefixed-code",
          "VITE_ACCESS_CODE_REVISION=wrong-prefixed-revision",
          "",
        ].join("\n"),
      );

      const env = loadAccessVerifierEnv({
        mode: "production",
        cwd,
        processEnv: {},
      });

      const define = buildAccessVerifierDefine({
        command: "build",
        mode: "production",
        env,
      });
      expect(JSON.parse(define[ACCESS_VERIFIER_DEFINE_KEY])).toBe(
        expectedDigest("file-master-code"),
      );
      expect(JSON.parse(define[ACCESS_CODE_SEED_DEFINE_KEY])).toBe(
        expectedCodeSeedDigest("file-access-revision"),
      );
      expect(JSON.stringify(define)).not.toContain("file-master-code");
      expect(JSON.stringify(define)).not.toContain("file-access-revision");
      expect(JSON.stringify(define)).not.toContain("wrong-prefixed-code");
      expect(JSON.stringify(define)).not.toContain("wrong-prefixed-revision");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
