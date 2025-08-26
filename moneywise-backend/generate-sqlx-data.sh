#!/bin/bash
# Generate sqlx-data.json from .sqlx directory
# This creates the proper format that SQLx expects for offline mode

set -e

echo "🔄 Generating sqlx-data.json from query metadata..."

# Start the JSON structure
cat > sqlx-data.json << 'EOF'
{
  "db": "PostgreSQL",
  "queries": [
EOF

# Add each query file to the JSON
first=true
for query_file in .sqlx/query-*.json; do
    if [ -f "$query_file" ]; then
        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> sqlx-data.json
        fi

        # Extract the hash from filename
        hash=$(basename "$query_file" .json | cut -d'-' -f2-)

        # Add the query with its hash
        echo "    {" >> sqlx-data.json
        echo "      \"hash\": \"$hash\"," >> sqlx-data.json
        echo "      \"query\": $(jq -r '.query' "$query_file" | jq -R .)," >> sqlx-data.json
        echo "      \"describe\": $(jq -c '.describe' "$query_file")" >> sqlx-data.json
        echo -n "    }" >> sqlx-data.json
    fi
done

# Close the JSON structure
cat >> sqlx-data.json << 'EOF'

  ]
}
EOF

echo "✅ Generated sqlx-data.json with $(jq '.queries | length' sqlx-data.json) queries"
echo "📄 File size: $(du -h sqlx-data.json | cut -f1)"
