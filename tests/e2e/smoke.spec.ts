import { expect, test } from "@playwright/test";

test("home loads the editor shell and can run JavaScript", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Run Code" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset to default code" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Share snippet" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Select editor theme" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Select programming language" })).toBeVisible();
  await expect(page.getByText("Output", { exact: true })).toBeVisible();
  await expect(page.getByText("No output yet")).toBeVisible();
  await expect(page.getByText(/stdout is pretending not to care/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Run Code" })).toBeEnabled();

  await page.getByRole("button", { name: "Run Code" }).click();
  await expect(page.getByText("Execution Successful")).toBeVisible();
  await expect(page.getByText("It ran. Try not to look too powerful.")).toBeVisible();
  await expect(page.getByText(/Tiny Cafe queue:/)).toBeVisible();
});

test("mobile home keeps the brand, nav, and editor controls in view", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("link", { name: /CodeCraft/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open snippets" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run Code" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Share snippet" })).toBeVisible();

  const hasNoHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
  );
  expect(hasNoHorizontalOverflow).toBe(true);
});

test("pricing renders for signed-out users", async ({ page }) => {
  await page.goto("/pricing");

  await expect(page.getByText("Upgrade Your")).toBeVisible();
  await expect(page.getByText("Lifetime Pro Access")).toBeVisible();
  await expect(page.getByRole("main").getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("footer support, privacy, and terms routes exist", async ({ page }) => {
  await page.goto("/support");
  await expect(page.getByRole("heading", { name: "Get CodeCraft working smoothly" })).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();

  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Terms of Use" })).toBeVisible();
});

test("profile redirects signed-out users to the editor", async ({ page }) => {
  await page.goto("/profile");

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Run Code" })).toBeVisible();
});

test("snippets page has search, filters, and signed-out CTA", async ({ page }) => {
  await page.goto("/snippets");

  await expect(page.getByRole("link", { name: /CodeCraft/i })).toBeVisible();
  await expect(
    page
      .getByPlaceholder("Search snippets by title, language, or author...")
      .or(page.getByTestId("snippets-loading"))
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Show snippets as grid" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Show snippets as list" })).toBeVisible();
  await expect(page.getByLabel("Sort snippets")).toBeVisible();
});

test("snippet search empty state appears above results", async ({ page }) => {
  await page.goto("/snippets");

  const search = page.getByPlaceholder("Search snippets by title, language, or author...");
  await expect(search).toBeVisible();

  await search.fill("zz-no-snippet-match-zz");
  await expect(page.getByRole("heading", { name: "No snippets found" })).toBeVisible();
});
