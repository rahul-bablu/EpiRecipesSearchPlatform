import os
import json
from dotenv import load_dotenv
from opensearchpy import OpenSearch, helpers

load_dotenv()

HOST = os.getenv("OPENSEARCH_HOST")
PORT = os.getenv("OPENSEARCH_PORT")
USER = os.getenv("OPENSEARCH_USER")
PASSWORD = os.getenv("OPENSEARCH_PASSWORD")

def create_opensearch_client():
    """Create and return an OpenSearch client."""
    client = OpenSearch(
        hosts=[{"host": HOST, "port": int(PORT)}],
        http_auth=(USER, PASSWORD),
        use_ssl=True,
        verify_certs=False,
        ssl_show_warn=False,
    )
    return client

# Create an index for recipe
def create_index(client, index_name):
    """Create an OpenSearch index with mappings."""
    index_body = {
        "mappings": {
            "properties": {
                "title": {"type": "search_as_you_type"},
                "desc": {"type": "text"},
                "date": {"type": "date"},
                "categories": {"type": "keyword"},
                "ingredients": {"type": "text"},
                "directions": {"type": "text"},
                "fat": {"type": "float"},
                "calories": {"type": "float"},
                "protein": {"type": "float"},
                "rating": {"type": "float"},
                "sodium": {"type": "float"}
            }
        }
    }
    response = client.indices.create(index_name, body=index_body)
    print(f"Index {index_name} created successfully.")
    return response

# Ingest data from the JSON file
def load_data(client, index_name, file_path="full_format_recipes.json"):
    """Yields data from json file with a unique ID."""
    with open(file_path, "r") as f:
        data = json.load(f)
        print("Data is being ingested...")
        for i, recipe in enumerate(data):
            yield {"_index": index_name, "_id": i, "_source": recipe}


def ingest_data(client, index_name, file_path="full_format_recipes.json"):
    """Ingest data in bulk to the OpenSearch index."""
    data = load_data(client, index_name, file_path)
    print(f"Ingesting {index_name} data...")
    response = helpers.bulk(client, data)
    print(f"Data sent to OpenSearch.")
    return response


client = create_opensearch_client()
info = client.info()
print(f"Welcome to {info['version']['distribution']} {info['version']['number']}!")

index_name = "recipes"
create_index(client, index_name)
ingest_data(client, index_name)

