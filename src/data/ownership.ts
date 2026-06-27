export const CLASSROOM_OWNER_NAME = "Daisy Teacher";
export const CLASSROOM_COPYRIGHT_NOTICE =
  "All rights reserved. 무단 복제 및 재배포 금지";

export const CLASSROOM_OWNERSHIP_TEXT =
  `© ${CLASSROOM_OWNER_NAME}. ${CLASSROOM_COPYRIGHT_NOTICE}`;

export const CLASSROOM_OWNERSHIP_CONFIG = {
  ownerName: CLASSROOM_OWNER_NAME,
  copyrightNotice: CLASSROOM_COPYRIGHT_NOTICE,
  copyrightText: CLASSROOM_OWNERSHIP_TEXT,
  forkCustomizationFile: "src/data/ownership.ts",
} as const;

// Backward-compatible alias used by existing screens and tests.
export const DAISY_COPYRIGHT_TEXT = CLASSROOM_OWNERSHIP_TEXT;
