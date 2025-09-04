#!/bin/bash

echo "🤖 Starting HumanoSync Platform..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists python3; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"

# Start backend
echo -e "\n${YELLOW}Starting backend server...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Start FastAPI server
echo -e "${GREEN}✓ Starting FastAPI server on port 8000${NC}"
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo -e "\n${YELLOW}Starting frontend...${NC}"
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install --silent

# Start React development server
echo -e "${GREEN}✓ Starting React app on port 3000${NC}"
npm start &
FRONTEND_PID=$!

# Print success message
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ HumanoSync is running!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to handle shutdown
shutdown() {
    echo -e "\n${YELLOW}Shutting down HumanoSync...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Shutdown complete${NC}"
    exit 0
}

# Set up trap for graceful shutdown
trap shutdown INT

# Wait for processes
wait