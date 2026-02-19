import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Login Page - WITH DIAGNOSTICS", () => {
  test.beforeEach(async ({ page }) => {
    // Setup detailed logging
    page.on("console", (msg) => {
      console.log("🌐 Browser console:", msg.text());
    });

    page.on("pageerror", (err) => {
      console.log("❌ Page error:", err.message);
      console.log("   Stack:", err.stack);
    });

    page.on("requestfailed", (request) => {
      console.log("❌ Failed request:", request.url());
      console.log("   Method:", request.method());
      console.log("   Error:", request.failure()?.errorText);
    });

    page.on("response", (response) => {
      // Log Appwrite responses
      if (response.url().includes("appwrite")) {
        console.log(
          `📡 Appwrite response: ${response.status()} ${response.url()}`
        );
      }
    });

    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    console.log("✅ Page loaded:", page.url());
  });

  test("should successfully login - DIAGNOSTIC VERSION", async ({
    page,
    context,
  }) => {
    const testEmail = process.env.TEST_USER_EMAIL || "test@example.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "Testpassword123";

    console.log("\n🔍 ========== LOGIN TEST START ==========");
    console.log("📧 Email:", testEmail);
    console.log("🔑 Password:", testPassword.substring(0, 3) + "***");
    console.log("🌐 Current URL:", page.url());
    console.log("🖥️  Environment:", process.env.CI ? "CI" : "Local");
    console.log("=========================================\n");

    // Step 1: Fill email
    console.log("📝 Step 1: Filling email...");
    const emailInput = page.getByLabel("Email");
    await emailInput.waitFor({ state: "visible" });
    await emailInput.click();
    await emailInput.fill(testEmail);

    const emailValue = await emailInput.inputValue();
    console.log("   Input value:", emailValue);
    console.log("   Matches expected:", emailValue === testEmail ? "✅" : "❌");

    await expect(emailInput).toHaveValue(testEmail);
    console.log("✅ Email filled successfully\n");

    // Step 2: Fill password
    console.log("📝 Step 2: Filling password...");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.waitFor({ state: "visible" });
    await passwordInput.click();
    await passwordInput.fill(testPassword);

    const passwordValue = await passwordInput.inputValue();
    console.log("   Input length:", passwordValue.length);
    console.log("   Expected length:", testPassword.length);
    console.log(
      "   Matches expected:",
      passwordValue === testPassword ? "✅" : "❌"
    );

    await expect(passwordInput).toHaveValue(testPassword);
    console.log("✅ Password filled successfully\n");

    // Step 3: Check remember me
    console.log("📝 Step 3: Checking remember me...");
    const rememberMe = page.getByLabel("Remember me");
    await rememberMe.check();
    const isChecked = await rememberMe.isChecked();
    console.log("   Checkbox checked:", isChecked ? "✅" : "❌");
    await expect(rememberMe).toBeChecked();
    console.log("✅ Remember me checked\n");

    // Step 4: Check submit button state
    console.log("📝 Step 4: Checking submit button...");
    const submitButton = page.getByRole("button", { name: "Sign in" });
    const isEnabled = await submitButton.isEnabled();
    const isVisible = await submitButton.isVisible();
    console.log("   Button visible:", isVisible ? "✅" : "❌");
    console.log("   Button enabled:", isEnabled ? "✅" : "❌");
    await expect(submitButton).toBeEnabled();
    console.log("✅ Submit button ready\n");

    page.on('framenavigated', frame => {
      console.log('📍 Navigation to:', frame.url())
    })

    // Step 5: Submit form
    console.log("📝 Step 5: Submitting form...");
    await submitButton.click();
    console.log("✅ Submit clicked\n");

    // Step 6: Wait and observe
    console.log("⏳ Step 6: Waiting for response (3 seconds)...");
    await page.waitForTimeout(3000);

    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");

    const currentUrl = page.url();
    const pageTitle = await page.title();

    console.log("📍 Current URL:", currentUrl);
    console.log("📄 Page title:", pageTitle);

    // Step 7: Check for error messages
    console.log("\n📝 Step 7: Checking for errors...");
    const errorMessage = page.locator(".bg-red-50");
    const hasError = await errorMessage.isVisible().catch(() => false);

    if (hasError) {
      const errorText = await errorMessage.textContent();
      console.log("❌ ERROR MESSAGE VISIBLE:");
      console.log("   ", errorText);
    } else {
      console.log("✅ No error message visible");
    }

    // Step 8: Check cookies
    console.log("\n📝 Step 8: Checking cookies...");
    const cookies = await context.cookies();
    console.log("🍪 Total cookies:", cookies.length);

    if (cookies.length > 0) {
      cookies.forEach((cookie) => {
        const value =
          cookie.value.length > 20
            ? cookie.value.substring(0, 20) + "..."
            : cookie.value;
        console.log(`   - ${cookie.name}: ${value}`);
        console.log(`     Domain: ${cookie.domain}, Path: ${cookie.path}`);
      });

      // Look for Appwrite session cookie
      const appwriteCookie = cookies.find(
        (c) =>
          c.name.includes("session") ||
          c.name.includes("appwrite") ||
          c.name.startsWith("a_")
      );

      if (appwriteCookie) {
        console.log("✅ Appwrite session cookie found:", appwriteCookie.name);
      } else {
        console.log("⚠️  No Appwrite session cookie found!");
        console.log("   This might be the problem!");
      }
    } else {
      console.log("⚠️  NO COOKIES SET!");
      console.log("   This is definitely a problem!");
    }

    // Step 9: Check network state
    console.log("\n📝 Step 9: Final state check...");
    console.log("   Starting URL: /login");
    console.log("   Current URL:", currentUrl);
    console.log("   Expected URL: /backlog");
    console.log("   Match:", currentUrl.includes("/backlog") ? "✅" : "❌");

    if (!currentUrl.includes("/backlog")) {
      console.log("\n❌ TEST WILL FAIL: Not redirected to /backlog");
      console.log("   Possible reasons:");
      console.log("   1. Authentication failed (check error message above)");
      console.log("   2. Session cookie not set (check cookies above)");
      console.log("   3. Redirect logic not working");
      console.log("   4. CORS issues (check browser console logs above)");
    }

    // Step 10: Final assertion
    console.log("\n📝 Step 10: Final assertion...");
    await expect(page).toHaveURL("/backlog", { timeout: 60000 });
    console.log("✅ Successfully redirected to /backlog");

    console.log("\n🎉 ========== LOGIN TEST PASSED ==========\n");

    // Cleanup
    await context.clearCookies();
  });
});
