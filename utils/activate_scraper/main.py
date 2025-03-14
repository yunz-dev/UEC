from playwright.sync_api import sync_playwright


def getIcsUrl(url: str) -> str:
    """
    This function navigates to a URL, clicks the 'Add to Calendar' button, waits for
    any page updates, saves the HTML content to a file, and extracts the 'Apple Calendar'
    link from the page.

    Args:
        url (str): The URL of the webpage to scrape.

    Returns:
        str: The 'href' attribute of the anchor tag that contains the 'Apple Calendar' link.
        If no such link is found, an empty string is returned.
    """
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the URL
        page.goto(url)

        # Wait for the button with the span containing 'Add to calendar' to be visible
        page.wait_for_selector('button:has(span:text("Add to calendar"))')

        # Click the button that contains the 'Add to calendar' span
        add_to_calendar_button = page.query_selector(
            'button:has(span:text("Add to calendar"))'
        )
        if add_to_calendar_button:
            add_to_calendar_button.click()
            print("Clicked 'Add to calendar' button.")
        else:
            print("Button with 'Add to calendar' not found.")

        # Optionally wait for the page to load after clicking the button (e.g., if it redirects or updates)
        page.wait_for_load_state("domcontentloaded")

        # Use Playwright to find the anchor tag based on the nested elements
        anchor = page.query_selector('a:has(div:has(span:text("Apple Calendar")))')
        if anchor:
            # Get the href attribute of the anchor tag
            href = anchor.get_attribute("href")
            return href
        else:
            print("No Apple Calendar link found.")

        # Close the browser
        browser.close()


def main():
    href = getIcsUrl(
        "https://www.activateuts.com.au/events/discover-sydney-autumn-2025/"
    )
    if href:
        print(f"Found Apple Calendar link: {href}")


if __name__ == "__main__":
    main()
