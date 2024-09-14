from flask import Flask, request, jsonify
from opensearchpy import OpenSearch
from dotenv import load_dotenv
import os

load_dotenv()

FLASK_HOST = os.getenv('FLASK_HOST', '127.0.0.1')
FLASK_PORT = os.getenv('FLASK_PORT', 5000)
OPENSEARCH_HOST = os.getenv('OPENSEARCH_HOST', 'localhost')
OPENSEARCH_PORT = int(os.getenv('OPENSEARCH_PORT', 9200))
OPENSEARCH_USER = os.getenv('OPENSEARCH_USER', 'admin')
OPENSEARCH_PASSWORD = os.getenv('OPENSEARCH_PASSWORD', 'admin_password')
INDEX_NAME = "recipes"
app = Flask(__name__)


client = OpenSearch(
    hosts=[{'host': OPENSEARCH_HOST, 'port': OPENSEARCH_PORT}],
    http_auth=(OPENSEARCH_USER, OPENSEARCH_PASSWORD),
    use_ssl=True,
    verify_certs=False,
    ssl_show_warn=False
)
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    search_body = {
        "size": 0,  
        "query": {
            "bool": {
                "should": [
                    {
                        "wildcard": {
                            "categories": {
                                "value": f"{query}*",
                                "case_insensitive": True,
                                "boost": 1.0
                            }
                        }
                    }
                ]
            }
        },
        "aggs": {
            "unique_categories": {
                "terms": {
                    "field": "categories",
                    "size": 10 
                }
            }
        }
    }

    response = client.search(index=INDEX_NAME, body=search_body)

    unique_categories = [bucket['key'] for bucket in response['aggregations']['unique_categories']['buckets']]
    print(unique_categories)
    return jsonify(unique_categories)


@app.route('/categories', methods=['GET'])
def get_categories():
    print("hello")
    query = {
        "size": 0, 
        "aggs": {
            "categories": {
                "terms": {"field": "categories", "size": 50},
                "aggs": {
                    "top_hits": {
                        "top_hits": {"_source": ["title"], "size": 5}
                    }
                }
            }
        }
    }
    
    response = client.search(index=INDEX_NAME, body=query)
    categories = []
    for bucket in response["aggregations"]["categories"]["buckets"]:
        items = [hit["_source"]["title"] for hit in bucket["top_hits"]["hits"]["hits"]]
        categories.append({"name": bucket["key"], "items": items})

    return jsonify(categories)


@app.route('/categories/<category>', methods=['GET'])
def fetch_category_items(category):
    fats_range = request.args.get('fatsRange', default=[0, 100], type=lambda v: [int(i) for i in v.split(',')])
    proteins_range = request.args.get('proteinsRange', default=[0, 100], type=lambda v: [int(i) for i in v.split(',')])
    calories_range = request.args.get('caloriesRange', default=[0, 1000], type=lambda v: [int(i) for i in v.split(',')])
    rating_filter = request.args.get('ratingFilter', type=int)

    search_query = {
        "bool": {
            "must": [
                {"term": {"categories": category}}  
            ],
            "filter": [
                {"range": {"fat": {"gte": fats_range[0], "lte": fats_range[1]}}},
                {"range": {"protein": {"gte": proteins_range[0], "lte": proteins_range[1]}}},
                {"range": {"calories": {"gte": calories_range[0], "lte": calories_range[1]}}}
            ]
        }
    }

    if rating_filter is not None:
        search_query["bool"]["filter"].append({"range": {"rating": {"gte": rating_filter}}})

    response = client.search(
        index=INDEX_NAME,
        body={
            "query": search_query,
            "size": 100 
        }
    )

    items = [hit['_source']['title'] for hit in response['hits']['hits']]
    print(items)
    return jsonify({'items': items})

@app.route('/recipe/<category>/<title>', methods=['GET'])
def get_recipe(category, title):
    query = {
        "query": {
            "bool": {
                "must": [
                    {"term": {"categories": category}},
                    {"match": {"title": title}}
                ]
            }
        }
    }

    response = client.search(index=INDEX_NAME, body=query)
    if response['hits']['total']['value'] > 0:
        return jsonify(response['hits']['hits'][0]['_source'])
    else:
        return jsonify({"error": "Recipe not found"}), 404


@app.route('/categories/count', methods=['GET'])
def count_categories():
    aggregation_body = {
        "size": 0,  
        "aggs": {
            "unique_categories_count": {
                "cardinality": {
                    "field": "categories"
                }
            }
        }
    }

    response = client.search(index=INDEX_NAME, body=aggregation_body)

    unique_categories_count = response['aggregations']['unique_categories_count']['value']

    return jsonify({"unique_categories_count": unique_categories_count})



@app.route('/categories/<name>', methods=['GET'])
def get_category_items(name):
    
    query = {
        "query": {
            "term": {
                "categories": name
            }
        }
    }
    
    response = client.search(index=INDEX_NAME, body=query)
    items = [hit["_source"]["title"] for hit in response["hits"]["hits"]]
    
    return jsonify({"items": items})


if __name__ == '__main__':
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=True)
