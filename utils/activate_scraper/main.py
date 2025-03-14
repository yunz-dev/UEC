from scraper import getEventsFromPage, getIcsUrl, getPageCount


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
    print(
        getEventsFromPage(
            "https://www.activateuts.com.au/events/?orderby=featured&page_num=1"
        )
    )


if __name__ == "__main__":
    main()
