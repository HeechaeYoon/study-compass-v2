import { createHash } from "node:crypto";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const MASTER_CODE_SALT = "study-compass-v2:";
const DEVELOPMENT_MASTER_CODE = "development-master-code";

function digestMasterCode(masterCode: string): string {
  return createHash("sha256").update(`${MASTER_CODE_SALT}${masterCode}`).digest("hex");
}

export default defineConfig(({ command, mode }) => {
  const isProductionBuild = command === "build" && mode === "production";
  const masterCode = process.env.MASTER_CODE ?? (isProductionBuild ? "" : DEVELOPMENT_MASTER_CODE);

  if (isProductionBuild && masterCode.length === 0) {
    throw new Error("MASTER_CODE must be set for production builds.");
  }

  return {
    base: "./",
    define: {
      __ACCESS_VERIFIER_DIGEST__: JSON.stringify(digestMasterCode(masterCode)),
    },
    plugins: [react()],
  };
});
