import os
import time
import requests
import pandas as pd
import kagglehub
import zipfile
from urllib.parse import urljoin

KAGGLE_HANDLE = 'samlearner/letterboxd-movie-ratings-data'
METADATA_CSV  = 'movie_data.csv'
POSTER_DIR    = 'static/posters'
API_URL       = 'http://localhost:3000/media'
BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500/"
DELAY_SEC     = 0.2

os.makedirs(POSTER_DIR, exist_ok=True)

zip_path = kagglehub.dataset_download(KAGGLE_HANDLE)
extract_folder = os.path.splitext(zip_path)[0]

if not os.path.exists(extract_folder):
    os.makedirs(extract_folder)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_folder)

csv_path = os.path.join(extract_folder, METADATA_CSV)
df = pd.read_csv(
    csv_path,
    encoding='ISO-8859-1',
    sep=',',
    quotechar='"',
    on_bad_lines='skip',
    engine='python'
)

df = (
    df.dropna(subset=['movie_title', 'overview', 'image_url'])
      .loc[lambda d: d['movie_title'].str.strip().ne("")]
      .loc[lambda d: d['overview'].str.strip().ne("")]
      .loc[lambda d: d['image_url'].str.strip().ne("")]
      [['movie_title', 'overview', 'image_url']]
)


for _, row in df.iterrows():
    title      = row['movie_title'].strip()
    overview   = row['overview'].strip()
    image_url  = row['image_url'].strip()

    if image_url.startswith('/'):
        image_url = urljoin(BASE_IMAGE_URL, image_url)

    filename   = os.path.basename(image_url)
    file_path  = os.path.join(POSTER_DIR, filename)

    if not os.path.isfile(file_path):
        try:
            resp = requests.get(image_url, timeout=10)
            resp.raise_for_status()
            with open(file_path, 'wb') as f:
                f.write(resp.content)
            print(f"Downloaded poster for '{title}'")
        except Exception as e:
            print(f"Skipping '{title}'—failed to download poster: {e}")
            continue

    try:
        check = requests.get(API_URL, params={"filter[media_name]": title}, timeout=5)
        check.raise_for_status()
        exists = bool(check.json().get("result"))
    except Exception as e:
        print(f"Could not verify existence of '{title}': {e}")
        continue

    if exists:
        print(f"Skipping '{title}'—already in database")
        continue

    try:
        with open(file_path, 'rb') as f:
            raw = f.read()
        if not raw:
            raise ValueError("empty file")
    except Exception as e:
        print(f"Skipping '{title}'—failed to read poster: {e}")
        continue

    payload = {
        "media_name": title,
        "description": overview,
        "medium": "movie",
        "image": list(raw),
    }

    try:
        resp = requests.post(API_URL, json=payload, timeout=10)
        resp.raise_for_status()
        print(f"Added '{title}' with poster")
    except Exception as e:
        print(f"Failed adding '{title}': {e}")
        if 'resp' in locals():
            print("   Response:", resp.text)

    time.sleep(DELAY_SEC)

