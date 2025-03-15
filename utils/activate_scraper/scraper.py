from playwright.sync_api import sync_playwright


def getEventsFromPage(url: str) -> list:
    """
    Args:
        url (str): The URL of the webpage to scrape.

    Returns:
        list: A list of hrefs to all the events found that match the criteria.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto(url)
        page.wait_for_selector("div.listing__items.row")

        div = page.query_selector("div.listing__items.row")
        hrefs = []

        if div:
            anchors = div.query_selector_all("a")
            for anchor in anchors:
                # Check if the anchor contains a div that contains an img
                if anchor.query_selector("div img"):
                    href = anchor.get_attribute("href")
                    if href and href.startswith("/events/"):
                        hrefs.append(href)

        browser.close()
        return hrefs


# def getEventsFromPage(url: str) -> list:
#     """
#     Args:
#         url (str): The URL of the webpage to scrape.
#
#     Returns:
#         list: A list of href to all the events found
#         If no such div or anchor tags are found, an empty list is returned.
#     """
#     with sync_playwright() as p:
#         browser = p.chromium.launch(headless=True)
#         page = browser.new_page()
#
#         page.goto(url)
#
#         page.wait_for_selector("div.listing__items.row")
#
#         div = page.query_selector("div.listing__items.row")
#         if div:
#             anchors = div.query_selector_all("a")
#             if anchors:
#                 hrefs = [
#                     anchor.get_attribute("href")
#                     for anchor in anchors
#                     if anchor.get_attribute("href")
#                 ]
#                 return hrefs
#             else:
#                 print("No anchor tags found in the div.")
#         else:
#             print("No div with class 'tile tile--event' found.")
#
#         browser.close()
#         return []


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
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto(url)

        page.wait_for_selector('button:has(span:text("Add to calendar"))')

        add_to_calendar_button = page.query_selector(
            'button:has(span:text("Add to calendar"))'
        )
        if add_to_calendar_button:
            add_to_calendar_button.click()
            print("Clicked 'Add to calendar' button.")
        else:
            print("Button with 'Add to calendar' not found.")

        page.wait_for_load_state("domcontentloaded")

        anchor = page.query_selector('a:has(div:has(span:text("Apple Calendar")))')
        if anchor:
            href = anchor.get_attribute("href")
            return href
        else:
            print("No Apple Calendar link found.")

        browser.close()
