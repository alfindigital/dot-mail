import { test, expect, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

async function getFaqTriggers(page: Page) {
  const section = page.getByRole("heading", { name: "Pertanyaan", level: 2 }).locator("..");
  return section.locator('[data-slot="accordion-trigger"], button[aria-controls]');
}

for (const vp of VIEWPORTS) {
  test.describe(`FAQ accordion @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("renders, expands, and stays within viewport width", async ({ page }) => {
      await page.goto("/");

      // Section visible
      const heading = page.getByRole("heading", { name: "Pertanyaan", level: 2 });
      await expect(heading).toBeVisible();

      // Has 4 FAQ items
      const triggers = page.locator('button[aria-expanded]').filter({
        hasText: /Legal\?|diblokir\?|Data simpan|Bisa buat/,
      });
      await expect(triggers).toHaveCount(4);

      // All collapsed by default
      for (let i = 0; i < 4; i++) {
        await expect(triggers.nth(i)).toHaveAttribute("aria-expanded", "false");
      }

      // Expand first item, content shows
      await triggers.first().click();
      await expect(triggers.first()).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByText(/fitur bawaan Gmail/i)).toBeVisible();

      // No horizontal overflow anywhere on page
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(1);

      // FAQ container fits viewport
      const box = await triggers.first().boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);

      // Expand all and verify still no overflow
      for (let i = 1; i < 4; i++) await triggers.nth(i).click();
      const overflowAfter = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflowAfter).toBeLessThanOrEqual(1);
    });

    test("no em dash visible to user", async ({ page }) => {
      await page.goto("/");
      // expand everything so accordion content is in DOM text
      const triggers = page.locator('button[aria-expanded="false"]');
      const n = await triggers.count();
      for (let i = 0; i < n; i++) await triggers.nth(i).click({ trial: false }).catch(() => {});
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toContain("\u2014");
    });
  });
}
