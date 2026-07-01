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

    test("generator produces variants", async ({ page }) => {
      await page.goto("/");
      await page.getByPlaceholder("e.g. john").fill("john");
      await page.getByRole("button", { name: /Generate/ }).click();
      await expect(page.getByRole("heading", { name: /8 variations/ })).toBeVisible();
      expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    });

    test("deep link ?u= auto-generates", async ({ page }) => {
      await page.goto("/?u=andi");
      await expect(page.getByRole("heading", { name: /variations/ })).toBeVisible();
    });

    test("no em dash visible to user", async ({ page }) => {
      await page.goto("/");
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toContain("—");
    });
  });
}

test("article page renders", async ({ page }) => {
  await page.goto("/articles/filter-gmail-with-dots");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Filter Gmail");
});
