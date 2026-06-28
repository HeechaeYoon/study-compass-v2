import { createHash } from "node:crypto";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const MASTER_CODE_SALT = "study-compass-v2:";
const ACCESS_CODE_REVISION_SALT = "study-compass-v2:access-code:";
export const ACCESS_VERIFIER_DEFINE_KEY = "__ACCESS_VERIFIER_DIGEST__";
export const ACCESS_CODE_SEED_DEFINE_KEY = "__ACCESS_CODE_SEED_DIGEST__";
export const DEVELOPMENT_MASTER_CODE = "development-master-code";
export const DEVELOPMENT_ACCESS_CODE_REVISION = "development-access-code-revision";

function digestMasterCode(masterCode: string): string {
  return createHash("sha256").update(`${MASTER_CODE_SALT}${masterCode}`).digest("hex");
}

function digestAccessCodeRevision(revision: string): string {
  return createHash("sha256")
    .update(`${ACCESS_CODE_REVISION_SALT}${revision}`)
    .digest("hex");
}

type AccessVerifierDefineOptions = {
  command: "build" | "serve";
  mode: string;
  env?: Record<string, string | undefined>;
};

type AccessVerifierEnvOptions = {
  mode: string;
  cwd: string;
  processEnv?: Record<string, string | undefined>;
};

export function loadAccessVerifierEnv({
  mode,
  cwd,
  processEnv = process.env,
}: AccessVerifierEnvOptions): Record<string, string | undefined> {
  return {
    ...loadEnv(mode, cwd, ""),
    ...processEnv,
  };
}

export function buildAccessVerifierDefine({
  command,
  mode,
  env = process.env,
}: AccessVerifierDefineOptions): Record<
  typeof ACCESS_VERIFIER_DEFINE_KEY | typeof ACCESS_CODE_SEED_DEFINE_KEY,
  string
> {
  const isProductionBuild = command === "build" && mode === "production";
  const masterCode = env.MASTER_CODE ?? (isProductionBuild ? "" : DEVELOPMENT_MASTER_CODE);
  const accessCodeRevision =
    env.ACCESS_CODE_REVISION && env.ACCESS_CODE_REVISION.length > 0
      ? env.ACCESS_CODE_REVISION
      : isProductionBuild
        ? ""
        : DEVELOPMENT_ACCESS_CODE_REVISION;

  if (isProductionBuild && masterCode.length === 0) {
    throw new Error("MASTER_CODE must be set for production builds.");
  }

  if (isProductionBuild && accessCodeRevision.length === 0) {
    throw new Error("ACCESS_CODE_REVISION must be set for production builds.");
  }

  return {
    [ACCESS_VERIFIER_DEFINE_KEY]: JSON.stringify(digestMasterCode(masterCode)),
    [ACCESS_CODE_SEED_DEFINE_KEY]: JSON.stringify(
      digestAccessCodeRevision(accessCodeRevision),
    ),
  };
}

export default defineConfig(({ command, mode }) => {
  return {
    base: "./",
    define: buildAccessVerifierDefine({
      command,
      mode,
      env: loadAccessVerifierEnv({ mode, cwd: process.cwd() }),
    }),
    plugins: [react()],
  };
});
