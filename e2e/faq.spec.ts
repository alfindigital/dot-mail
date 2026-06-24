import { test, expect, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

async function noHorizontalOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

for (const vp of VIEWPORTS) {
  test.describe(`Home @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("generator produces variants and copies", async ({ page }) => {
      await page.goto("/");
      await page.getByPlaceholder("contoh: satu").fill("satu");
      await page.getByRole("button", { name: /Generate/ }).click();
      // 8 variants for a 4-char username.
      await expect(page.getByRole("heading", { name: /8 variasi/ })).toBeVisible();
    });

    test("on-page FAQ is visible and expands", async ({ page }) => {
      await page.goto("/");
      const heading = page.getByRole("heading", {
        name: "Pertanyaan yang sering ditanya",
        level: 2,
      });
      await expect(heading).toBeVisible();

      const trigger = page.getByRole("button", { name: /Apa itu Gmail dot trick/ });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByText(/fitur bawaan Gmail/i).first()).toBeVisible();

      expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    });

    test("deep link ?u= auto-generates", async ({ page }) => {
      await page.goto("/?u=andi");
      await expect(page.getByRole("heading", { name: /variasi/ })).toBeVisible();
    });

    test("no em dash visible to user", async ({ page }) => {
      await page.goto("/");
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toContain("—");
    });
  });
}

test("English route renders", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: /One inbox/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Frequently asked questions" })).toBeVisible();
});

test("article page renders", async ({ page }) => {
  await page.goto("/artikel/cara-filter-gmail-dengan-titik");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Cara Filter Email");
});
