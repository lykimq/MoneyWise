#!/usr/bin/env python3
"""
Create proper sqlx-data.json from .sqlx directory
This script converts the individual query files into the format SQLx expects
"""

import json
import os
import glob
from pathlib import Path

def create_sqlx_data():
    print("🔄 Creating sqlx-data.json from query metadata...")

    # Find all query files in .sqlx directory
    query_files = glob.glob(".sqlx/query-*.json")

    if not query_files:
        print("❌ No query files found in .sqlx directory")
        return False

    print(f"📁 Found {len(query_files)} query files")

    # Create the base structure
    sqlx_data = {
        "db": "PostgreSQL",
        "queries": []
    }

    # Process each query file
    for query_file in sorted(query_files):
        try:
            with open(query_file, 'r') as f:
                query_data = json.load(f)

            # Extract hash from filename
            filename = os.path.basename(query_file)
            hash_part = filename.replace('query-', '').replace('.json', '')

            # Create the query entry in the format SQLx expects
            query_entry = {
                "hash": hash_part,
                "query": query_data["query"],
                "describe": query_data["describe"]
            }

            sqlx_data["queries"].append(query_entry)
            print(f"✅ Added query: {query_data['query'][:50]}...")

        except Exception as e:
            print(f"⚠️  Error processing {query_file}: {e}")
            continue

    # Write the sqlx-data.json file
    try:
        with open("sqlx-data.json", 'w') as f:
            json.dump(sqlx_data, f, indent=2)

        print(f"✅ Created sqlx-data.json with {len(sqlx_data['queries'])} queries")

        # Show file size
        size = os.path.getsize("sqlx-data.json")
        print(f"📄 File size: {size} bytes ({size/1024:.1f} KB)")

        return True

    except Exception as e:
        print(f"❌ Error writing sqlx-data.json: {e}")
        return False

if __name__ == "__main__":
    success = create_sqlx_data()
    exit(0 if success else 1)
