#!/bin/bash
# Development scripts for Docker

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 YouTube Clone Docker Development Scripts${NC}"
echo "Available commands:"
echo "  dev     - Start development server"
echo "  build   - Build the project"
echo "  prod    - Start production server"
echo "  test    - Run tests"
echo "  clean   - Clean up Docker containers and images"
echo ""

case "$1" in
  "dev")
    echo -e "${YELLOW}Starting development server...${NC}"
    docker-compose up dev
    ;;
  "build")
    echo -e "${YELLOW}Building the project...${NC}"
    docker-compose run --rm build
    ;;
  "prod")
    echo -e "${YELLOW}Starting production server...${NC}"
    docker-compose up prod
    ;;
  "test")
    echo -e "${YELLOW}Running tests...${NC}"
    docker-compose run --rm build bun test
    ;;
  "clean")
    echo -e "${YELLOW}Cleaning up Docker containers and images...${NC}"
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune -f
    ;;
  "help"|"")
    echo "Usage: ./docker-dev.sh [dev|build|prod|test|clean]"
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    echo "Usage: ./docker-dev.sh [dev|build|prod|test|clean]"
    exit 1
    ;;
esac
