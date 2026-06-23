import { expect, test, type Page } from "@playwright/test";

const COPYRIGHT_TEXT =
  "© Daisy Teacher. All rights reserved. 무단 복제 및 재배포 금지";
const TEST_MASTER_CODE = "development-master-code";

async function openAdminModal(page: Page): Promise<void> {
  const ownershipMark = page.getByText(COPYRIGHT_TEXT).first();
  await expect(ownershipMark).toBeVisible();
  for (let index = 0; index < 7; index += 1) {
    await ownershipMark.click({ force: true });
  }
  await expect(page.getByRole("dialog", { name: "관리자 접속 코드" })).toBeVisible();
}

async function generateAccessCode(page: Page, validDays = "7"): Promise<string> {
  await openAdminModal(page);
  await page.getByLabel("마스터코드").fill(TEST_MASTER_CODE);
  await page.getByLabel("유효 기간").fill(validDays);
  await page.getByRole("button", { name: "접속 코드 생성" }).click();

  const codeOutput = page.locator("#generated-access-code");
  await expect(codeOutput).toContainText(/^DAISY-A1-/);
  return (await codeOutput.textContent())?.trim() ?? "";
}

async function unlockWithGeneratedCode(page: Page): Promise<void> {
  const code = await generateAccessCode(page);
  await page.getByRole("button", { name: "닫기" }).click();
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
  await expect(accessInput).toHaveAttribute(
    "placeholder",
    /DAISY-A1-\d{6}-\d{3}-[A-Z2-9]{10}/,
  );
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

test("hidden admin generator creates a code that unlocks the app", async ({ page }) => {
  await page.goto("/");

  await unlockWithGeneratedCode(page);
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();
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
    .not.toContain("answers");
});
