import { afterEach, describe, expect, it, vi } from "vitest";
import { generateAccessCode } from "../../src/domain/accessCode";
import {
  ACCESS_STORAGE_KEY,
  deleteAccessPass,
  loadAccessPass,
  saveAccessPass,
} from "../../src/infrastructure/accessStorage";

const DEV_VERIFIER_DIGEST =
  "467934acc99f69b35a94c1c9a1f7b6345aee56695f78e4c5b80468f7477799ca";

function makeStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => values.delete(key)),
  } satisfies Pick<Storage, "getItem" | "setItem" | "removeItem">;
}

function stubWindow(storage: Pick<Storage, "getItem" | "setItem" | "removeItem">) {
  vi.stubGlobal("window", { localStorage: storage });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("access storage", () => {
  it("stores only a schema version, code fingerprint, and expiry timestamp", () => {
    const storage = makeStorage();
    stubWindow(storage);
    const code = generateAccessCode({
      issuedAt: new Date(2026, 5, 23, 9, 0),
      validDays: 7,
      verifierDigest: DEV_VERIFIER_DIGEST,
    });
    const expiresAt = new Date(2026, 5, 30, 0, 0, 0);

    expect(saveAccessPass(code, expiresAt).ok).toBe(true);

    const stored = storage.setItem.mock.calls[0]?.[1];
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored ?? "{}") as Record<string, unknown>;
    expect(Object.keys(parsed).sort()).toEqual([
      "codeFingerprint",
      "expiresAt",
      "schemaVersion",
    ]);
    expect(parsed).not.toHaveProperty("code");
    expect(parsed).not.toHaveProperty("answers");
    expect(parsed).toMatchObject({
      schemaVersion: 1,
      expiresAt: expiresAt.toISOString(),
    });
    expect(parsed.codeFingerprint).toMatch(/^[a-f0-9]{64}$/);
  });

  it("loads a valid unexpired access pass", () => {
    const storage = makeStorage();
    stubWindow(storage);
    const expiresAt = new Date(2026, 5, 30, 0, 0, 0);
    saveAccessPass("DAISY-A1-260623-007-ABCDEFG234", expiresAt);

    expect(loadAccessPass(new Date(2026, 5, 29, 23, 59, 59))).toMatchObject({
      ok: true,
      value: {
        schemaVersion: 1,
        expiresAt: expiresAt.toISOString(),
      },
    });
  });

  it("ignores expired access passes without throwing", () => {
    const storage = makeStorage();
    stubWindow(storage);
    saveAccessPass("DAISY-A1-260623-001-ABCDEFG234", new Date(2026, 5, 24, 0, 0, 0));

    expect(loadAccessPass(new Date(2026, 5, 24, 0, 0, 0))).toEqual({
      ok: true,
      value: null,
    });
  });

  it("handles malformed stored values safely", () => {
    const storage = makeStorage();
    storage.setItem(ACCESS_STORAGE_KEY, "{bad json");
    stubWindow(storage);

    expect(loadAccessPass(new Date(2026, 5, 23, 12, 0))).toEqual({
      ok: false,
      error: "invalid",
    });

    storage.setItem(
      ACCESS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        code: "DAISY-A1-260623-007-ABCDEFG234",
        expiresAt: "2026-06-30T00:00:00.000Z",
      }),
    );
    expect(loadAccessPass(new Date(2026, 5, 23, 12, 0))).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("reports unavailable storage and deletes safely", () => {
    vi.stubGlobal("window", {});
    expect(loadAccessPass()).toEqual({ ok: false, error: "unavailable" });
    expect(saveAccessPass("DAISY-A1-260623-007-ABCDEFG234", new Date())).toEqual({
      ok: false,
      error: "unavailable",
    });

    const storage = makeStorage();
    stubWindow(storage);
    expect(deleteAccessPass().ok).toBe(true);
    expect(storage.removeItem).toHaveBeenCalledWith(ACCESS_STORAGE_KEY);
  });

  it("does not throw when localStorage operations throw", () => {
    const quotaStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new DOMException("quota", "QuotaExceededError");
      }),
      removeItem: vi.fn(),
    } satisfies Pick<Storage, "getItem" | "setItem" | "removeItem">;
    stubWindow(quotaStorage);

    expect(() =>
      saveAccessPass("DAISY-A1-260623-007-ABCDEFG234", new Date(2026, 5, 30)),
    ).not.toThrow();
    expect(
      saveAccessPass("DAISY-A1-260623-007-ABCDEFG234", new Date(2026, 5, 30)),
    ).toEqual({
      ok: false,
      error: "quota",
    });

    const readErrorStorage = {
      getItem: vi.fn(() => {
        throw new Error("blocked");
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } satisfies Pick<Storage, "getItem" | "setItem" | "removeItem">;
    stubWindow(readErrorStorage);

    expect(() => loadAccessPass(new Date(2026, 5, 23))).not.toThrow();
    expect(loadAccessPass(new Date(2026, 5, 23))).toEqual({
      ok: false,
      error: "unavailable",
    });

    const removeErrorStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(() => {
        throw new Error("blocked");
      }),
    } satisfies Pick<Storage, "getItem" | "setItem" | "removeItem">;
    stubWindow(removeErrorStorage);

    expect(() => deleteAccessPass()).not.toThrow();
    expect(deleteAccessPass()).toEqual({
      ok: false,
      error: "unknown",
    });
  });

  it("does not throw when the window.localStorage getter throws", () => {
    vi.stubGlobal(
      "window",
      Object.defineProperty({}, "localStorage", {
        get() {
          throw new Error("blocked");
        },
      }),
    );

    expect(() => loadAccessPass()).not.toThrow();
    expect(loadAccessPass()).toEqual({ ok: false, error: "unavailable" });
    expect(() =>
      saveAccessPass("DAISY-A1-260623-007-ABCDEFG234", new Date(2026, 5, 30)),
    ).not.toThrow();
    expect(saveAccessPass("DAISY-A1-260623-007-ABCDEFG234", new Date(2026, 5, 30))).toEqual({
      ok: false,
      error: "unavailable",
    });
    expect(() => deleteAccessPass()).not.toThrow();
    expect(deleteAccessPass()).toEqual({ ok: false, error: "unavailable" });
  });
});
