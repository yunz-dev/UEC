from playwright.sync_api import sync_playwright


def getPageCount(url: str) -> int:
    """
    This function navigates to the events page and finds the page count

    Args:
        url (str): The URL of the webpage to scrape.

    Returns:
        int: the amount of pages of events
        if nothing was found return -1
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto(url)

        page.wait_for_selector("div.col-xs-12.col-md-9")

        div = page.query_selector("div.col-xs-12.col-md-9")
        if div:
            anchors = div.query_selector_all("a")
            if anchors:
                last_anchor_text = anchors[-1].text_content()
                return int(last_anchor_text.strip()) if last_anchor_text else -1
            else:
                print("No anchor tags found in the div.")
        else:
            print("No div with classes 'col-xs-12 col-md-9' found.")

        # Close the browser
        browser.close()
        return -1


def getIcsUrl(url: str) -> str:
    """
    This function navigates to a URL, clicks the 'Add to Calendar' button, waits for
    any page updates, and extracts the ICS link from the page.

    Args:
        url (str): The URL of the webpage to scrape.

    Returns:
        str: The 'href' attribute of the anchor tag that contains the 'ICS' link.
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
    print(
        getPageCount(
            "https://www.activateuts.com.au/events/?orderby=featured&page_num=1"
        )
    )
    if href:
        print(f"Found Apple Calendar link: {href}")


if __name__ == "__main__":
    main()
