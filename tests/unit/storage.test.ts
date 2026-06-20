import { afterEach, describe, expect, it, vi } from "vitest";
import { createFixtureResult } from "../../src/app/fixtures";
import { EMPTY_PROMPT_INPUTS } from "../../src/domain/prompt";
import {
  STORAGE_KEY,
  deleteResult,
  loadResult,
  saveResult,
  type SavedResult,
} from "../../src/infrastructure/storage";

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

describe("storage", () => {
  it("saves and loads valid data", () => {
    const storage = makeStorage();
    stubWindow(storage);
    const saved: SavedResult = {
      schemaVersion: 2,
      savedAt: "2026-06-20T00:00:00.000Z",
      result: createFixtureResult(),
      memo: "",
      promptInputs: EMPTY_PROMPT_INPUTS,
    };
    expect(saveResult(saved).ok).toBe(true);
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));
    const loaded = loadResult();
    expect(loaded.ok).toBe(true);
    expect(loaded.ok ? loaded.value?.schemaVersion : null).toBe(2);
  });

  it("migrates v1 data by dropping memo checkbox state", () => {
    const storage = makeStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        savedAt: "2026-06-20T00:00:00.000Z",
        result: createFixtureResult(),
        memo: "상위 메모",
        includeMemoInPrompt: false,
        promptInputs: {
          ...EMPTY_PROMPT_INPUTS,
          memo: "입력 메모",
          includeMemo: false,
        },
      }),
    );
    stubWindow(storage);

    const loaded = loadResult();

    expect(loaded.ok).toBe(true);
    expect(loaded.ok ? loaded.value?.schemaVersion : null).toBe(2);
    expect(loaded.ok ? loaded.value?.memo : null).toBe("입력 메모");
    expect(loaded.ok ? loaded.value?.promptInputs.memo : null).toBe("입력 메모");
    expect(
      loaded.ok && loaded.value
        ? "includeMemoInPrompt" in loaded.value
        : true,
    ).toBe(false);
  });

  it("returns null when no saved result exists", () => {
    stubWindow(makeStorage());
    const loaded = loadResult();
    expect(loaded.ok).toBe(true);
    expect(loaded.ok ? loaded.value : "fail").toBeNull();
  });

  it("handles invalid JSON and wrong schema safely", () => {
    const storage = makeStorage();
    storage.setItem(STORAGE_KEY, "{bad json");
    stubWindow(storage);
    expect(loadResult()).toEqual({ ok: false, error: "invalid" });

    storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 999 }));
    expect(loadResult()).toEqual({ ok: false, error: "invalid" });

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 2,
        savedAt: "2026-06-20T00:00:00.000Z",
        result: {},
        memo: "",
        promptInputs: EMPTY_PROMPT_INPUTS,
      }),
    );
    expect(loadResult()).toEqual({ ok: false, error: "invalid" });
  });

  it("deletes stored data", () => {
    const storage = makeStorage();
    stubWindow(storage);
    expect(deleteResult().ok).toBe(true);
    expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("handles unavailable storage", () => {
    vi.stubGlobal("window", {});
    expect(loadResult()).toEqual({ ok: false, error: "unavailable" });
  });
});
