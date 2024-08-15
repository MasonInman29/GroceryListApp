from flask import Flask, request, jsonify
import asyncio
from walmart_scraper import scrape_products, scrape_search

app = Flask(__name__)

@app.route('/scrape', methods=['GET'])
def scrape():
    query = request.args.get('query', 'laptop')
    urls = request.args.getlist('urls')

    if not urls:
        urls = [
            "https://www.walmart.com/ip/1736740710",
            "https://www.walmart.com/ip/715596133",
            "https://www.walmart.com/ip/496918359",
        ]

    # Create a new event loop for each request
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        #products_data = loop.run_until_complete(scrape_products(urls))
        #print("products data: ", products_data)
        search_data = loop.run_until_complete(scrape_search(query=query, sort="best_seller", max_pages=3))
        return jsonify({"search": search_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        loop.close()

if __name__ == '__main__':
    app.run(debug=True)
