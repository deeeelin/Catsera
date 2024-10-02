import pandas as pd
from pymongo import MongoClient

from utils.embeddings_utils import (
    get_embedding,
    distances_from_embeddings,
    tsne_components_from_embeddings,
    chart_from_components,
    indices_of_nearest_neighbors_from_distances,
)
connection_string = input("Please enter mongodb connection string:")
# constants
EMBEDDING_MODEL = "text-embedding-ada-002"

# 讀取CSV文件
csv_file_path = './Processed_Coursera.csv'
data = pd.read_csv(csv_file_path)

# 轉換為字典
data_dict = data.to_dict("records")

# 取得embedding


# 連接到MongoDB
client = MongoClient(connection_string)
db = client['hackathon']  # 更換為你的數據庫名稱
collection = db['courses']  # 更換為你的集合名稱

# 插入數據
for d in data_dict:
    embedding_input = d["courseName"]+d["courseDescription"]+d["skills"]
    embedding_output = get_embedding(embedding_input, EMBEDDING_MODEL)
    d["embedding"] = embedding_output

    # quest if courseName is unique
    query = {'courseName': d['courseName']}
    collection.replace_one(query, d, upsert=True)
    print(embedding_output)

