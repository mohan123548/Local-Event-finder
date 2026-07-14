from datasets import load_dataset
import pandas as pd
import json

ds = load_dataset("Data-Gouv-ML/liste-des-festivals-en-france", "festivals-global-festivals-_-pl")
split_name = list(ds.keys())[0]
df = pd.DataFrame(ds[split_name])

# Clean column names (strip BOM or spaces)
df.columns = [c.lstrip('\ufeff') for c in df.columns]

print("Unique disciplines:")
print(df['Discipline dominante'].value_counts())

print("\nUnique periods:")
print(df['Période principale de déroulement du festival'].value_counts())

# Save summary to JSON
summary = {
    "disciplines": df['Discipline dominante'].value_counts().to_dict(),
    "periods": df['Période principale de déroulement du festival'].value_counts().to_dict()
}

with open("dataset_values_summary.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2, ensure_ascii=False)
