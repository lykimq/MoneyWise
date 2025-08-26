#!/bin/bash

# Purpose: Test GitHub Actions workflows locally using act
# Usage: ./scripts/test-ci.sh [workflow_file] [-d|--debug]

# Parse command line arguments
DEBUG=0
WORKFLOW_FILE=".github/workflows/backend-build.yml"

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--debug)
            DEBUG=1
            shift
            ;;
        *)
            WORKFLOW_FILE="$1"
            shift
            ;;
    esac
done

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ Error: $1 is not installed"
        case $1 in
            act)
                echo "Please run: curl -s https://api.github.com/repos/nektos/act/releases/latest | grep 'browser_download_url.*act_Linux_x86_64.tar.gz' | cut -d : -f 2,3 | tr -d \\\" | wget -qi - && tar xf act_Linux_x86_64.tar.gz && sudo mv act /usr/local/bin/ && rm act_Linux_x86_64.tar.gz"
                ;;
            docker)
                echo "Please install Docker using: sudo apt-get install docker.io"
                ;;
        esac
        exit 1
    fi
}

# Check required commands
check_command act
check_command docker

# Ensure Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker using: sudo systemctl start docker"
    exit 1
fi

# Check if we're in the project root (where .github exists)
if [ ! -d ".github" ]; then
    echo "❌ Error: Must be run from project root"
    echo "Please cd to the directory containing .github folder"
    exit 1
fi

# Load environment variables from .secrets
if [ -f ".secrets" ]; then
    echo "✅ Loading secrets from .secrets file"
    export $(cat .secrets | xargs)
else
    echo "❌ Error: .secrets file not found"
    echo "Please create .secrets file with POSTGRES_PASSWORD=your_password"
    exit 1
fi

# Check if workflow file exists
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "❌ Error: Workflow file not found: $WORKFLOW_FILE"
    exit 1
fi

echo "🔍 Testing workflow: $WORKFLOW_FILE"
echo "📝 Using environment:"
echo "  - POSTGRES_PASSWORD is set (length: ${#POSTGRES_PASSWORD})"
echo "  - Docker version: $(docker --version)"
echo "  - Act version: $(act version)"

# Ensure act config directory exists
mkdir -p ~/.config/act

# Create minimal act configuration
cat > ~/.config/act/actrc << EOL
-P ubuntu-latest=node:20-slim
--container-architecture linux/amd64
--bind
EOL

# Prepare act command
ACT_CMD="act"
ACT_CMD+=" --secret-file .secrets"
ACT_CMD+=" --artifact-server-path /tmp/artifacts"

# Add debug flags if requested
if [ $DEBUG -eq 1 ]; then
    echo "🐛 Debug mode enabled"
    ACT_CMD+=" -v"
fi

ACT_CMD+=" -W $WORKFLOW_FILE"

# Run act with error handling
echo "🚀 Running workflow..."
if [ $DEBUG -eq 1 ]; then
    echo "Command: $ACT_CMD"
fi

eval $ACT_CMD
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo "✅ Workflow test completed successfully"
else
    echo "❌ Workflow test failed with exit code: $exit_code"
    if [ $DEBUG -eq 0 ]; then
        echo "💡 Try running with --debug flag for more information"
    fi
fi

exit $exit_code