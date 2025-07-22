import requests
import pandas as pd
import kagglehub
# The dataset handle and the path to the specific file within the dataset
handle = 'muby98/imdb-tv-show-data-sets-top-250-tv-shows-on-imdb'
path = 'IMDb_top_250.csv'

# Load the dataset file using kagglehub.dataset_load()
df = kagglehub.dataset_load(
    kagglehub.KaggleDatasetAdapter.PANDAS,
    handle,
    path,

)
# removing rows with missing values in 'name' and 'description' columns
df = df.dropna(subset=['title', 'show_desc'])
df = df[df['title'].str.strip() != ""]
df = df[df['show_desc'].str.strip() != ""]

# This script loads user data from a CSV file and sends it to a local server to add media entries.
for _, row in df.iterrows():
    response = requests.post(
        f"http://localhost:3000/media", # change url as needed.
        json={
            "media_name": row['title'], # change row[column_name] to match your CSV structure
            "description": row['show_desc'],
            "medium": "show", # whatever your dataset is comprised of.
        }
    )
    try:
        data = response.json()
        print("JSON response:", data)
    except Exception:
        print("Status code:", response.status_code)
        print("Response text:", response.text)

