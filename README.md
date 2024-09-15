# EpiRecipes Search Platform

## Project Description and Objectives

EpiRecipes Search Platform is a comprehensive platform designed to provide users with the ability to search for recipes based on various categories, ingredients, and nutritional content. The primary objective of this project is to implement a user-friendly search platform for recipes, allowing users to explore detailed recipe information and filter results based on dietary preferences.

### Key Features

- Search recipes by category, ingredients, and nutritional values.
- Filter search results to match user preferences.
- Intuitive UI for seamless interaction.
- Backend integration with OpenSearch for efficient recipe searching.
- Modern frontend built with React and TypeScript for scalability and responsiveness.

## Objectives

- Implement a scalable search engine with OpenSearch.
- Provide a responsive UI for easy navigation and search.
- Ensure efficient storage and retrieval of recipe data.

---

## Setup and Installation Instructions

### Prerequisites

- **Node.js**
- **Python**
- **OpenSearch**
- **Git**
- **Flask**
- **React** and **TypeScript**

### OpenSearch Setup and Data Ingestion

#### Prerequisites

- **Docker** (For setting up OpenSearch)
- **Python** (To run the ingestion script)
- **OpenSearch Python Client** **(`opensearch-py`)** (To interact with OpenSearch from Python)

#### Setup and run OpenSearch with Docker

To set up and run OpenSearch, follow the instructions in the official OpenSearch documentation:

- **Official Docker Setup Guide**: [OpenSearch Docker Documentation](https://opensearch.org/docs/latest/opensearch/install/docker/)

This guide will walk you through pulling the OpenSearch image and running it via Docker.

#### Accessing OpenSearch

Once OpenSearch is running, it should be accessible at `http://localhost:9200`. You can use tools like cURL or Postman to verify that it's running. For more information on interacting with OpenSearch:

- **OpenSearch API Guide**: [OpenSearch REST APIs](https://opensearch.org/docs/latest/api-reference/)

### Data Ingestion into OpenSearch

1. **Install OpenSearch Python Client**: Before running the ingestion script, make sure to install the `opensearch-py` package.

   ```
   pip install opensearch-py
   ```
2. **Dataset**: The dataset `full_format_recipes.json` contains detailed recipe information, including ingredients, directions, categories, and nutritional values. It has been downloaded from [Kaggle](https://www.kaggle.com/datasets/hugodarwood/epirecipes) website and will be used for ingestion into OpenSearch.
3. **Ingestion Script**: The `ingest_recipes.py` script is located in the project directory and is responsible for indexing the recipe data into OpenSearch. It will:

   - Create an index called `recipes`.
   - Ingest data from the `full_format_recipes.json` file into this index.
4. **Set Up Environment Variables**: Ensure your `.env` file in the directory is correctly set up with the following 		  parameters to connect to your OpenSearch instance:

   ```
   OPENSEARCH_HOST=<your-opensearch-host>
   OPENSEARCH_PORT=<your-opensearch-port>
   OPENSEARCH_USER=<your-opensearch-username>
   OPENSEARCH_PASSWORD=<your-opensearch-password>
   ```
5. **Run the Data Ingestion Script**: Run the `ingest_recipes.py` script to index the recipes from `full_format_recipes.json` into the `recipes` index of your OpenSearch instance:

   ```
   python ingest_recipes.py
   ```

   This script will parse the dataset from `full_format_recipes.json` and create the `recipes` index in OpenSearch.
6. **Verify Data Ingestion**

   After running the ingestion script, verify that the data has been indexed correctly by querying OpenSearch:

   ```
   curl -X GET "http://localhost:9200/recipes/_search?pretty"
   ```

   This command will return the indexed recipe data if everything has been set up correctly.

### Backend Setup (ESP-backend)

1. Navigate to the backend directory.

   ```
   cd ESP-backend
   ```
2. Create a virtual environment and activate it.

   - Windows

     ```
     python -m venv .venv
     .venv\Scripts\activate
     ```
   - Linux/macOS

     ```
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3. Install the required dependencies

   ```
   pip install -r requirements.txt
   ```
4. Configure environment variables

   - Create a `.env` file in the `ESP-backend` folder with the following variables
     ```
     FLASK_HOST=<backend-server-host>
     FLASK_PORT=<backend-server-port>
     OPENSEARCH_HOST=<your-opensearch-host>
     OPENSEARCH_PORT=<your-opensearch-port>
     OPENSEARCH_USER=<your-opensearch-username>
     OPENSEARCH_PASSWORD=<your-opensearch-password>
     ```
5. Run the backend

   ```
   flask run 
   ```

### Frontend Setup (ESP-frontend)

1. Navigate to the frontend directory.

   ```
   cd ESP-frontend
   ```
2. Install the required dependencies

   ```
   npm install
   ```
3. Configure environment variables

   - Create a `.env` file in the `ESP-frontend` folder with the following variables
     ```
     HOST=<backend-server-host>
     PORT=<backend-server-port>
     ```
4. Start the development server

   ```
   npm run dev
   ```

## Usage Guidelines

### Searching for Recipes

- Users can enter keywords in the search bar to find relevant categories of the recipes.
- Utilize filters to refine search results based on ingredients, calories, or categories.
- View recipe details including preparation steps, nutritional information, and ratings.

---

## Technologies and Frameworks Used

- **Backend**: Python, Flask
- **Frontend**: React, TypeScript
- **Database**:  OpenSearch
- **Search Engine**: OpenSearch (Installed via Docker)
- **Version Control**: Git, GitHub

---

## Link to the Demo Video

Watch the demo of EpiRecipes Search Platform on YouTube: [Demo Video](https://youtu.be/5mTPSk8uYJU)
