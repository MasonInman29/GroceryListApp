# import asyncio
# import json
# import math
# from typing import Dict, List
# from urllib.parse import urlencode
# from scrapfly import ScrapeConfig, ScrapflyClient, ScrapeApiResponse
# import os

# SCRAPFLY_KEY = os.environ.get("SCRAPFLY_KEY")
# SCRAPFLY = ScrapflyClient(key=SCRAPFLY_KEY)

# BASE_CONFIG = {
#     "asp": True,
#     "country": "US",
# }

# def parse_product(response: ScrapeApiResponse):
#     sel = response.selector
#     data = sel.xpath('//script[@id="__NEXT_DATA__"]/text()').get()
#     data = json.loads(data)
#     product_raw = data["props"]["pageProps"]["initialData"]["data"]["product"]
#     wanted_product_keys = [
#         "availabilityStatus",
#         "averageRating",
#         "brand",
#         "id",
#         "imageInfo",
#         "manufacturerName",
#         "name",
#         "orderLimit",
#         "orderMinLimit",
#         "priceInfo",
#         "shortDescription",
#         "type",
#     ]
#     product = {k: v for k, v in product_raw.items() if k in wanted_product_keys}
#     reviews_raw = data["props"]["pageProps"]["initialData"]["data"]["reviews"]
#     return {"product": product, "reviews": reviews_raw}

# def parse_search(response: ScrapeApiResponse) -> List[Dict]:
#     sel = response.selector
#     data = sel.xpath('//script[@id="__NEXT_DATA__"]/text()').get()
#     data = json.loads(data)
#     total_results = data["props"]["pageProps"]["initialData"]["searchResult"]["itemStacks"][0]["count"]
#     results = data["props"]["pageProps"]["initialData"]["searchResult"]["itemStacks"][0]["items"]
#     return {"results": results, "total_results": total_results}

# async def scrape_products(urls: List[str]) -> List[Dict]:
#     result = []
#     to_scrape = [ScrapeConfig(url, **BASE_CONFIG) for url in urls]
#     async for response in SCRAPFLY.concurrent_scrape(to_scrape):
#         result.append(parse_product(response))
#     return result

# async def scrape_search(query: str = "", sort: str = "best_match", max_pages: int = None) -> List[Dict]:
#     def make_search_url(page):
#         url = "https://www.walmart.com/search?" + urlencode(
#             {"q": query, "page": page, sort: sort, "affinityOverride": "default"}
#         )
#         return url

#     first_page = await SCRAPFLY.async_scrape(ScrapeConfig(make_search_url(1), **BASE_CONFIG))
#     data = parse_search(first_page)
#     search_data = data["results"]
#     total_results = data["total_results"]

#     total_pages = math.ceil(total_results / 40)
#     if total_pages > 25:
#         total_pages = 25
#     if max_pages and max_pages < total_pages:
#         total_pages = max_pages

#     other_pages = [ScrapeConfig(make_search_url(page), **BASE_CONFIG) for page in range(2, total_pages + 1)]
#     async for response in SCRAPFLY.concurrent_scrape(other_pages):
#         search_data.extend(parse_search(response)["results"])
#     return search_data
import asyncio
import json
import math
from typing import Dict, List
from urllib.parse import urlencode
from bs4 import BeautifulSoup
import requests
import os

BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}

def fetch_page(url: str) -> str:
    response = requests.get(url, headers=BASE_HEADERS)
    response.raise_for_status()
    return response.text

def parse_product(html: str) -> Dict:
    soup = BeautifulSoup(html, "html.parser")
    script_data = soup.find("script", {"id": "__NEXT_DATA__"})
    data = json.loads(script_data.string)
    product_raw = data["props"]["pageProps"]["initialData"]["data"]["product"]

    wanted_product_keys = [
        "availabilityStatus",
        "averageRating",
        "brand",
        "id",
        "imageInfo",
        "manufacturerName",
        "name",
        "orderLimit",
        "orderMinLimit",
        "priceInfo",
        "shortDescription",
        "type",
    ]
    product = {k: v for k, v in product_raw.items() if k in wanted_product_keys}
    reviews_raw = data["props"]["pageProps"]["initialData"]["data"]["reviews"]
    return {"product": product, "reviews": reviews_raw}

def parse_search(html: str) -> Dict:
    soup = BeautifulSoup(html, "html.parser")
    script_data = soup.find("script", {"id": "__NEXT_DATA__"})
    data = json.loads(script_data.string)
    total_results = data["props"]["pageProps"]["initialData"]["searchResult"]["itemStacks"][0]["count"]
    results = data["props"]["pageProps"]["initialData"]["searchResult"]["itemStacks"][0]["items"]
    return {"results": results, "total_results": total_results}

async def scrape_products(urls: List[str]) -> List[Dict]:
    result = []
    for url in urls:
        print("trying url:", url)
        html = fetch_page(url)
        result.append(parse_product(html))
    return result

async def scrape_search(query: str = "", sort: str = "best_match", max_pages: int = None) -> List[Dict]:
    def make_search_url(page):
        url = "https://www.walmart.com/search?" + urlencode(
            {"q": query, "page": page, sort: sort, "affinityOverride": "default"}
        )
        return url

    first_page_html = fetch_page(make_search_url(1))
    data = parse_search(first_page_html)
    search_data = data["results"]
    total_results = data["total_results"]

    total_pages = math.ceil(total_results / 40)
    if total_pages > 25:
        total_pages = 25
    if max_pages and max_pages < total_pages:
        total_pages = max_pages

    for page in range(2, total_pages + 1):
        html = fetch_page(make_search_url(page))
        search_data.extend(parse_search(html)["results"])
    return search_data
