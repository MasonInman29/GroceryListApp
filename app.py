from flask import Flask, request, jsonify
import asyncio
from walmart_scraper import scrape_products, scrape_search

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/scrape', methods=['GET'])
def scrape():
    query = request.args.get('query', 'laptop')
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        search_data = loop.run_until_complete(scrape_search(query=query, sort="best_seller", max_pages=3))
        return jsonify({"search": search_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        loop.close()

if __name__ == '__main__':
    app.run(debug=True)
