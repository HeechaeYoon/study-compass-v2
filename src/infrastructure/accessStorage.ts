import {
  fingerprintAccessCode,
  fingerprintAccessCodeSeed,
} from "../domain/accessCode";

export const ACCESS_STORAGE_KEY = "srl-coach-access-v1";

export type AccessPass = {
  schemaVersion: 1;
  codeFingerprint: string;
  codeSeedFingerprint: string;
  expiresAt: string;
};

export type AccessStorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: "unavailable" | "invalid" | "quota" | "unknown" };

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredAccessPass(value: unknown): value is AccessPass {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== 1) return false;
  if (typeof value.codeFingerprint !== "string" || !/^[a-f0-9]{64}$/.test(value.codeFingerprint)) {
    return false;
  }
  if (
    typeof value.codeSeedFingerprint !== "string" ||
    !/^[a-f0-9]{64}$/.test(value.codeSeedFingerprint)
  ) {
    return false;
  }
  if (typeof value.expiresAt !== "string" || !Number.isFinite(Date.parse(value.expiresAt))) {
    return false;
  }
  return Object.keys(value).every((key) =>
    ["schemaVersion", "codeFingerprint", "codeSeedFingerprint", "expiresAt"].includes(key),
  );
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

export function saveAccessPass(
  code: string,
  expiresAt: Date,
  codeSeedDigest: string,
): AccessStorageResult<void> {
  const storage = getStorage();
  if (!storage) return { ok: false, error: "unavailable" };
  if (!Number.isFinite(expiresAt.getTime())) return { ok: false, error: "invalid" };

  const value: AccessPass = {
    schemaVersion: 1,
    codeFingerprint: fingerprintAccessCode(code),
    codeSeedFingerprint: fingerprintAccessCodeSeed(codeSeedDigest),
    expiresAt: expiresAt.toISOString(),
  };

  try {
    storage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(value));
    return { ok: true, value: undefined };
  } catch (error) {
    if (isQuotaError(error)) return { ok: false, error: "quota" };
    return { ok: false, error: "unknown" };
  }
}

export function loadAccessPass(
  now: Date,
  codeSeedDigest: string,
): AccessStorageResult<AccessPass | null> {
  const storage = getStorage();
  if (!storage) return { ok: false, error: "unavailable" };

  let raw: string | null;
  try {
    raw = storage.getItem(ACCESS_STORAGE_KEY);
  } catch {
    return { ok: false, error: "unavailable" };
  }

  if (raw === null) return { ok: true, value: null };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "invalid" };
  }

  if (!isStoredAccessPass(parsed)) return { ok: false, error: "invalid" };

  if (parsed.codeSeedFingerprint !== fingerprintAccessCodeSeed(codeSeedDigest)) {
    try {
      storage.removeItem(ACCESS_STORAGE_KEY);
    } catch {
      // Revision mismatches fail closed; cleanup is best-effort.
    }
    return { ok: true, value: null };
  }

  if (Date.parse(parsed.expiresAt) <= now.getTime()) {
    try {
      storage.removeItem(ACCESS_STORAGE_KEY);
    } catch {
      // Expired passes are non-critical cleanup; loading should still fail closed.
    }
    return { ok: true, value: null };
  }

  return { ok: true, value: parsed };
}

export function deleteAccessPass(): AccessStorageResult<void> {
  const storage = getStorage();
  if (!storage) return { ok: false, error: "unavailable" };

  try {
    storage.removeItem(ACCESS_STORAGE_KEY);
    return { ok: true, value: undefined };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
