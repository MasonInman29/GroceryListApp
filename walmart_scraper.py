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
    print("response:", response)
    response.raise_for_status()
    return response.text

def parse_product(html: str) -> Dict:
    print("running parse_product")
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
    print("parsing:", product)
    # reviews_raw = data["props"]["pageProps"]["initialData"]["data"]["reviews"]
    # return {"product": product,"reviews": reviews_raw}
    return {"product": product}


def parse_search(html: str) -> Dict:
    print("running parse_search")
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

# async def scrape_search(query: str = "", sort: str = "best_match", max_pages: int = 3) -> List[Dict]:
#     print("starting scrape_search...")
#     def make_search_url(page):
#         url = "https://www.walmart.com/search?" + urlencode(
#             {"q": query, "page": page, sort: sort, "affinityOverride": "default"}
#         )
#         return url

#     first_page_html = fetch_page(make_search_url(1))
#     print("page fetched...")
#     data = parse_search(first_page_html)
#     search_data = data["results"]
#     total_results = data["total_results"]

#     total_pages = math.ceil(total_results / 40)
#     if total_pages > 25:
#         total_pages = 25
#     if max_pages and max_pages < total_pages:
#         total_pages = max_pages

#     for page in range(2, total_pages + 1):
#         html = fetch_page(make_search_url(page))
#         search_data.extend(parse_search(html)["results"])
#         print("page ", page, "parsed...")
#     return search_data
async def scrape_search(query: str = "", sort: str = "best_match", max_pages: int = 1) -> List[Dict]:
    print("starting scrape_search...")
    def make_search_url(page):
        url = "https://www.walmart.com/search?" + urlencode(
            {"q": query, "page": page, sort: sort, "affinityOverride": "default"}
        )
        return url

    # Fetch and parse the first page only
    url = make_search_url(1)
    print(url)
    first_page_html = fetch_page(url)
    print("page fetched...")
    data = parse_search(first_page_html)
    search_data = data["results"]

    # No need to fetch additional pages
    return search_data
