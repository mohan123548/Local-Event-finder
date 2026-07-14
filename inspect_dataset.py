from datasets import load_dataset
import json

try:
    print("Loading dataset...")
    ds = load_dataset("Data-Gouv-ML/liste-des-festivals-en-france", "festivals-global-festivals-_-pl")
    print("Dataset loaded successfully.")
    
    # Get the train split
    split_name = list(ds.keys())[0]
    data_split = ds[split_name]
    
    num_rows = len(data_split)
    columns = data_split.column_names
    first_row = data_split[0] if num_rows > 0 else {}
    
    info = {
        "num_rows": num_rows,
        "columns": columns,
        "first_row_example": first_row
    }
    
    with open("dataset_info.json", "w", encoding="utf-8") as f:
        json.dump(info, f, indent=2, ensure_ascii=False)
        
    print("Dataset info written to dataset_info.json")
except Exception as e:
    with open("dataset_info.json", "w", encoding="utf-8") as f:
        json.dump({"error": str(e)}, f, indent=2)
    print("Error:", e)
