# Activate Scraper

python3 script that goes through all the pages in [Activate UTS Event's Page](https://www.activateuts.com.au/events/?orderby=featured) and stores event data in a MongoDB Database

## Setup

### environment variables
```bash
MONGO_URI #
```
### install dependencies
`pip install -r requirements.txt`
### install browsers
`python -m playwright install`
### run script
`python3 main.py`

should be run every 30-60 mins on a crobjob
