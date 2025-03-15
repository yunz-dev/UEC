from cal import event_adapter, extract_event_data
from categoriser import Categoriser
from db import upsert_event
from scraper import getEventsFromPage, getIcsUrl, getPageCount

ACTIVATE_UTS = "https://www.activateuts.com.au"
UTS_EVENT_PAGE = "https://www.activateuts.com.au/events"
PAGE_INCREMENT = "/?orderby=featured&page_num="
if __name__ == "__main__":
    Categoriser._instance_ = Categoriser()
    print("Finding Page Count...", end="")
    pages = getPageCount(UTS_EVENT_PAGE)
    print(pages)
    event_pages = []
    print("Finding Events...")
    for i in range(1, pages + 1):
        print("searching page: ", i)
        event_pages += getEventsFromPage(UTS_EVENT_PAGE + PAGE_INCREMENT + str(i))
    print("\n", event_pages, "\n")
    for i, event_page in enumerate(event_pages):
        url = ACTIVATE_UTS + event_page

        print(UTS_EVENT_PAGE + event_page)
        ics = getIcsUrl(url)

        cal_event = extract_event_data(ics)

        event = event_adapter(cal_event, url)

        print(i + 1, "/", len(event_pages), "upserting:", event.summary)
        upsert_event(event)
    print("SUCCESS!")
