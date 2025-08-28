#!/bin/bash

# MoneyWise Documentation Regeneration Script
# This script helps regenerate the OCaml documentation with enhanced styling

set -e

echo "🔧 MoneyWise Documentation Regeneration Script"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the docs/ directory"
    exit 1
fi

# Check if OCaml tools are available
if ! command -v dune &> /dev/null; then
    echo "❌ Error: dune not found. Please install OCaml and dune first."
    echo "   You can still view the enhanced documentation without regenerating."
    echo ""
    echo "📖 View enhanced documentation:"
    echo "   - Main docs: file://$(pwd)/index.html"
    echo "   - API docs: file://$(pwd)/api-index.html"
    echo "   - Prerequisites: file://$(pwd)/Prerequisites/index.html"
    exit 1
fi

echo "📚 Regenerating OCaml documentation..."

# Go to the OCaml tools directory
cd ../tools/ocaml

# Clean and rebuild
echo "🧹 Cleaning previous build..."
dune clean

echo "🔨 Building documentation..."
dune build @doc

echo "📁 Copying enhanced CSS to generated docs..."

# Copy our enhanced CSS to the generated docs
cp ../../docs/odoc.support/moneywise-enhanced.css _build/default/_doc/_html/odoc.support/

# Update the generated HTML files to use our enhanced CSS
echo "🎨 Updating generated HTML files..."

# Function to update CSS references in HTML files
update_css_references() {
    local file="$1"
    if [ -f "$file" ]; then
        # Replace odoc.css with moneywise-enhanced.css
        sed -i 's|href="odoc.css"|href="moneywise-enhanced.css"|g' "$file"
        echo "✅ Updated: $file"
    fi
}

# Update main index
update_css_references "_build/default/_doc/_html/index.html"

# Update moneywise-tools index
update_css_references "_build/default/_doc/_html/moneywise-tools/index.html"

# Update Prerequisites module
update_css_references "_build/default/_doc/_html/moneywise-tools/Prerequisites/index.html"

echo ""
echo "🎉 Documentation regeneration complete!"
echo ""
echo "📖 You can now view the enhanced documentation at:"
echo "   - Main docs: file://$(pwd)/../../docs/index.html"
echo "   - API docs: file://$(pwd)/../../docs/api-index.html"
echo "   - Prerequisites: file://$(pwd)/../../docs/Prerequisites/index.html"
echo "   - Generated docs: file://$(pwd)/_build/default/_doc/_html/index.html"
echo ""
echo "✨ The documentation now features:"
echo "   - Modern, responsive design"
echo "   - Better typography and spacing"
echo "   - Enhanced navigation"
echo "   - Dark mode support"
echo "   - Improved code highlighting"
echo "   - Better mobile experience"
echo "   - Fixed code block formatting"
echo "   - Reduced redundant content"
echo ""
echo "🚀 To view the documentation:"
echo "   - Open any of the HTML files in your browser"
echo "   - The enhanced styling will automatically apply"
echo "   - Dark mode will activate if your system prefers it"
