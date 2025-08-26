#!/usr/bin/env python3
"""
Fix SQLx data generation script
Creates a proper sqlx-data.json file from the .sqlx query metadata files
"""

import json
import os
import glob
from pathlib import Path

def main():
    print("🔄 Generating proper sqlx-data.json from query metadata...")

    # Initialize the structure
    sqlx_data = {
        "db": "PostgreSQL",
        "queries": []
    }

    # Find all query files
    query_files = glob.glob('.sqlx/query-*.json')

    if not query_files:
        print("❌ No query files found in .sqlx directory")
        return

    print(f"📂 Found {len(query_files)} query files")

    for query_file in sorted(query_files):
        try:
            with open(query_file, 'r') as f:
                query_data = json.load(f)

            # Extract hash from filename
            hash_value = Path(query_file).stem.replace('query-', '')

            # Create proper query entry
            query_entry = {
                "hash": hash_value,
                "query": query_data["query"],
                "describe": query_data["describe"]
            }

            sqlx_data["queries"].append(query_entry)

        except Exception as e:
            print(f"⚠️  Warning: Failed to process {query_file}: {e}")
            continue

    # Write the corrected sqlx-data.json
    with open('sqlx-data.json', 'w') as f:
        json.dump(sqlx_data, f, indent=2)

    print(f"✅ Generated sqlx-data.json with {len(sqlx_data['queries'])} queries")

    # Show file size
    size = os.path.getsize('sqlx-data.json')
    if size > 1024:
        print(f"📄 File size: {size // 1024}KB")
    else:
        print(f"📄 File size: {size}B")

if __name__ == "__main__":
    main()
