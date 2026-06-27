import { expect, test, type Page } from "@playwright/test";

const COPYRIGHT_TEXT =
  "© Daisy Teacher. All rights reserved. 무단 복제 및 재배포 금지";
const TEST_MASTER_CODE = "development-master-code";
const ACCESS_STORAGE_KEY = "srl-coach-access-v1";
const SESSION_CODE_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/;

async function openAdminModal(page: Page): Promise<void> {
  const ownershipMark = page.getByText(COPYRIGHT_TEXT).first();
  await expect(ownershipMark).toBeVisible();
  for (let index = 0; index < 7; index += 1) {
    await ownershipMark.click({ force: true });
  }
  await expect(page.getByRole("dialog", { name: "관리자 접속 코드" })).toBeVisible();
}

async function generateSessionAccess(
  page: Page,
  validDays = "1",
): Promise<{ code: string; link: string }> {
  await openAdminModal(page);
  await page.getByLabel("마스터코드").fill(TEST_MASTER_CODE);
  const dayInput = page.getByLabel("유효 기간 (일 단위)");
  await expect(dayInput).toHaveValue("1");
  if (validDays !== "1") {
    await dayInput.fill(validDays);
  }
  await page.getByRole("button", { name: "새 수업 세션 만들기" }).click();

  const codeOutput = page.locator("#generated-access-code");
  const linkOutput = page.locator("#generated-access-link");
  await expect(codeOutput).toContainText(SESSION_CODE_PATTERN);
  await expect(linkOutput).toContainText(/\?session=[A-HJ-NP-Z2-9]{8}/);
  await expect(page.getByRole("img", { name: "세션 수업 링크 QR 코드" })).toBeVisible();
  return {
    code: (await codeOutput.textContent())?.trim() ?? "",
    link: (await linkOutput.textContent())?.trim() ?? "",
  };
}

async function unlockWithGeneratedCode(page: Page): Promise<void> {
  const { code, link } = await generateSessionAccess(page);
  await page.getByRole("button", { name: "닫기" }).click();
  await page.goto(link);
  await page.getByLabel("수업 접속 코드").fill(code);
  await page.getByRole("button", { name: "입장하기" }).click();
  await expect(
    page.getByTestId("screen-surface").getByRole("heading", {
      name: /나의 공부 스타일을/,
    }),
  ).toBeVisible();
}

async function activeElementIsInsideDialog(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
    return dialog instanceof HTMLElement && dialog.contains(document.activeElement);
  });
}

test("requires a valid access code before the start screen", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "수업 접속 코드" })).toBeVisible();
  const accessInput = page.getByLabel("수업 접속 코드");
  await expect(accessInput).toBeVisible();
  await expect(accessInput).toHaveAttribute("placeholder", /QLTY9F/);
  await expect(
    page.getByTestId("screen-surface").getByRole("heading", {
      name: /나의 공부 스타일을/,
    }),
  ).toHaveCount(0);

  await page.getByLabel("수업 접속 코드").fill("WRONG-CODE");
  await page.getByRole("button", { name: "입장하기" }).click();
  await expect(page.getByRole("alert")).toContainText("유효하지 않은 접속 코드");
});

test("admin modal traps focus while open", async ({ page }) => {
  await page.goto("/");
  await openAdminModal(page);
  await expect(page.getByLabel("마스터코드")).toBeFocused();
  await expect(page.locator(".wideApp")).toHaveAttribute("inert", "");

  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press("Tab");
    await expect.poll(() => activeElementIsInsideDialog(page)).toBe(true);
  }

  await page.keyboard.down("Shift");
  await page.keyboard.press("Tab");
  await page.keyboard.up("Shift");
  await expect.poll(() => activeElementIsInsideDialog(page)).toBe(true);
});

test("admin modal defaults to one day and labels validity as day units", async ({ page }) => {
  await page.goto("/");
  await openAdminModal(page);

  await expect(page.getByLabel("유효 기간 (일 단위)")).toHaveValue("1");
  await expect(page.getByText("1~90일 사이로 입력하세요. 기본값은 1일입니다.")).toBeVisible();
});

test("hidden admin generator creates a code that unlocks the app", async ({ page }) => {
  await page.goto("/");

  await unlockWithGeneratedCode(page);
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();
});

test("session links only accept codes generated for the same session", async ({ page }) => {
  await page.goto("/");
  const { code, link } = await generateSessionAccess(page);
  const wrongSessionLink = new URL(link);
  wrongSessionLink.searchParams.set("session", "ABCDEFGH");

  await page.goto(wrongSessionLink.toString());
  await page.getByLabel("수업 접속 코드").fill(code);
  await page.getByRole("button", { name: "입장하기" }).click();

  await expect(page.getByRole("alert")).toContainText("유효하지 않은 접속 코드");
});

test("admin modal copies the session link bundle and QR image", async ({ page }) => {
  await page.addInitScript(() => {
    class TestClipboardItem {
      readonly types: string[];

      constructor(items: Record<string, Blob>) {
        this.types = Object.keys(items);
      }
    }

    Object.defineProperty(window, "ClipboardItem", {
      configurable: true,
      value: TestClipboardItem,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        write: async (items: Array<{ types: string[] }>) => {
          (
            window as Window & {
              __qrClipboardTypes?: string[];
            }
          ).__qrClipboardTypes = items.flatMap((item) => item.types);
        },
        writeText: async (text: string) => {
          (
            window as Window & {
              __clipboardText?: string;
            }
          ).__clipboardText = text;
        },
      },
    });
  });

  await page.goto("/");
  const { code, link } = await generateSessionAccess(page);
  await page.getByRole("button", { name: "링크+코드 복사" }).click();

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & {
              __clipboardText?: string;
            }
          ).__clipboardText ?? "",
      ),
    )
    .toContain(link);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & {
              __clipboardText?: string;
            }
          ).__clipboardText ?? "",
      ),
    )
    .toContain(code);

  await page.getByRole("button", { name: "QR 이미지 복사" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & {
              __qrClipboardTypes?: string[];
            }
          ).__qrClipboardTypes ?? [],
      ),
    )
    .toContain("image/png");
});

test("admin QR copy falls back to copying the session link when image clipboard is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "ClipboardItem", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (
            window as Window & {
              __clipboardText?: string;
            }
          ).__clipboardText = text;
        },
      },
    });
  });

  await page.goto("/");
  const { link } = await generateSessionAccess(page);
  await page.getByRole("button", { name: "QR 이미지 복사" }).click();

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & {
              __clipboardText?: string;
            }
          ).__clipboardText ?? "",
      ),
    )
    .toBe(link);
  await expect(page.getByText("QR 이미지 복사가 어려워 링크를 복사했어요.")).toBeVisible();
});

test("admin modal disables QR image actions when QR rendering fails", async ({ page }) => {
  await page.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(
      this: HTMLCanvasElement,
      contextId: string,
      options?: CanvasRenderingContext2DSettings,
    ) {
      if (this.classList.contains("accessQrCanvas")) {
        return null;
      }
      return originalGetContext.call(this, contextId, options);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });

  await page.goto("/");
  await generateSessionAccess(page);

  await expect(page.getByText("QR 코드를 그리기 어려워요. 링크 복사를 이용해주세요.")).toBeVisible();
  await expect(page.getByRole("button", { name: "QR 이미지 복사" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "QR PNG 저장" })).toBeDisabled();
});

test("access pass survives reload without storing student answers", async ({ page }) => {
  await page.goto("/");
  await unlockWithGeneratedCode(page);

  await page.reload();
  await expect(
    page.getByTestId("screen-surface").getByRole("heading", {
      name: /나의 공부 스타일을/,
    }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem("srl-coach-access-v1")),
    )
    .toContain("expiresAt");
  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem("srl-coach-access-v1")),
    )
    .toContain("codeSeedFingerprint");
  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem("srl-coach-access-v1")),
    )
    .not.toContain("answers");
});

test("stored access pass without the current code revision returns to the access gate", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          codeFingerprint: "a".repeat(64),
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        }),
      );
    },
    { key: ACCESS_STORAGE_KEY },
  );

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "수업 접속 코드" })).toBeVisible();
  await expect(
    page.getByTestId("screen-surface").getByRole("heading", {
      name: /나의 공부 스타일을/,
    }),
  ).toHaveCount(0);
});
