from playwright.sync_api import sync_playwright, Page, expect
import datetime

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    otp_code = [""] # Use list to be mutable inside callback

    def handle_dialog(dialog):
        print(f"Dialog message: {dialog.message}")
        if "Your OTP is" in dialog.message:
            code = dialog.message.split(": ")[1]
            otp_code[0] = code
            print(f"Captured OTP: {code}")
        dialog.accept()

    page.on("dialog", handle_dialog)

    try:
        print("Navigating to app...")
        page.goto("http://localhost:5173")

        print("Logging in...")
        page.fill("input[placeholder='Username']", "admin")
        page.fill("input[placeholder='Password']", "admin")
        page.click("button:has-text('Sign In')")

        # Wait for OTP input to appear
        page.wait_for_selector("input[placeholder='Enter OTP']")

        print(f"Entering OTP: {otp_code[0]}")
        page.fill("input[placeholder='Enter OTP']", otp_code[0])
        page.click("button:has-text('Verify OTP')")

        # Wait for Dashboard
        page.wait_for_selector("text=Admin Profile", timeout=5000)
        print("Logged in successfully.")

        # Navigate to Checks tab
        print("Navigating to Checks tab...")
        page.click("button:has-text('Checks')")

        # Verify empty state or headers
        expect(page.locator("text=Coming Amount")).to_be_visible()
        expect(page.locator("text=Given Amount")).to_be_visible()

        # Add a Check
        print("Adding a check...")
        page.click(".fab-btn.checks")

        page.wait_for_selector("text=Add New Check")

        # Fill Form
        page.fill("input[placeholder='Enter Check Number']", "CHK123456")
        page.fill("input[placeholder='Enter Bank Name']", "BOC")
        page.fill("input[placeholder='Enter Amount']", "50000")
        page.fill("input[placeholder='Enter Person Name']", "John Doe")
        page.fill("input[placeholder='Enter Contact Number']", "0771234567")

        # Date - select tomorrow for "Due Soon" test
        tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
        page.fill("input[type='date']", tomorrow)

        page.click("button:has-text('Save Check')")

        # Verify Check in List
        print("Verifying check in list...")
        page.wait_for_selector("text=John Doe")
        page.wait_for_selector("text=CHK123456")
        page.wait_for_selector("text=Due Soon")

        # Check Total
        expect(page.locator("text=LKR 50000.00")).to_be_visible()

        # Screenshot
        print("Taking screenshot...")
        page.screenshot(path="/home/jules/verification/checks_verification.png")

        print("Verification successful!")

    except Exception as e:
        print(f"Verification failed: {e}")
        try:
            page.screenshot(path="/home/jules/verification/error_screenshot.png")
        except:
            pass
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
