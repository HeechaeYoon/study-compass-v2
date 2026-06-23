import { createHash } from "node:crypto";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const MASTER_CODE_SALT = "study-compass-v2:";
export const ACCESS_VERIFIER_DEFINE_KEY = "__ACCESS_VERIFIER_DIGEST__";
export const DEVELOPMENT_MASTER_CODE = "development-master-code";

function digestMasterCode(masterCode: string): string {
  return createHash("sha256").update(`${MASTER_CODE_SALT}${masterCode}`).digest("hex");
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
}: AccessVerifierDefineOptions): Record<typeof ACCESS_VERIFIER_DEFINE_KEY, string> {
  const isProductionBuild = command === "build" && mode === "production";
  const masterCode = env.MASTER_CODE ?? (isProductionBuild ? "" : DEVELOPMENT_MASTER_CODE);

  if (isProductionBuild && masterCode.length === 0) {
    throw new Error("MASTER_CODE must be set for production builds.");
  }

  return {
    [ACCESS_VERIFIER_DEFINE_KEY]: JSON.stringify(digestMasterCode(masterCode)),
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
