# PowerShell script for Docker development on Windows
param(
    [Parameter(Position=0)]
    [string]$Command = ""
)

Write-Host "🐳 YouTube Clone Docker Development Scripts" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Yellow
Write-Host "  dev     - Start development server"
Write-Host "  build   - Build the project"
Write-Host "  prod    - Start production server"
Write-Host "  test    - Run tests"
Write-Host "  clean   - Clean up Docker containers and images"
Write-Host ""

switch ($Command) {
    "dev" {
        Write-Host "Starting development server..." -ForegroundColor Yellow
        docker-compose up dev
    }
    "build" {
        Write-Host "Building the project..." -ForegroundColor Yellow
        docker-compose run --rm build
    }
    "prod" {
        Write-Host "Starting production server..." -ForegroundColor Yellow
        docker-compose up prod
    }
    "test" {
        Write-Host "Running tests..." -ForegroundColor Yellow
        docker-compose run --rm build bun test
    }
    "clean" {
        Write-Host "Cleaning up Docker containers and images..." -ForegroundColor Yellow
        docker-compose down --rmi all --volumes --remove-orphans
        docker system prune -f
    }
    default {
        Write-Host "Usage: .\docker-dev.ps1 [dev|build|prod|test|clean]" -ForegroundColor Red
        Write-Host "Example: .\docker-dev.ps1 dev" -ForegroundColor Gray
    }
}
