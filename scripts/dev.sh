#!/usr/bin/env bash
set -e

echo "Starting Foundry Online Pro development environment..."

# Postgres is already available via Replit's postgres service
# Check if database exists and create if needed
if command -v createdb >/dev/null 2>&1; then
    createdb foundry_online 2>/dev/null || echo "Database foundry_online already exists or could not be created"
fi

# Install dependencies for API app
echo "Installing API dependencies..."
cd apps/api
npm install
cd ../..

# Install dependencies for Web app  
echo "Installing Web dependencies..."
cd apps/web
npm install  
cd ../..

# Install package dependencies if they exist
for pkg_dir in packages/*/; do
    if [ -f "$pkg_dir/package.json" ]; then
        echo "Installing dependencies for $pkg_dir"
        cd "$pkg_dir"
        npm install
        cd ../..
    fi
done

# Handle Prisma if packages/db exists
if [ -f "packages/db/package.json" ]; then
    echo "Setting up Prisma..."
    cd packages/db
    npm run prisma:generate 2>/dev/null || npx prisma generate 2>/dev/null || echo "Prisma generate failed or not configured"
    npm run prisma:migrate 2>/dev/null || npx prisma migrate dev 2>/dev/null || echo "Prisma migrate failed or not configured"
    cd ../..
fi

# Start applications directly in parallel
echo "Starting applications..."
echo "API will be available at http://localhost:4000"
echo "Web app will be available at http://localhost:5000"

# Start API in background
cd apps/api
npm run dev &
API_PID=$!
cd ../..

# Start Web app in background  
cd apps/web
npm run dev &
WEB_PID=$!
cd ../..

# Function to cleanup background processes
cleanup() {
    echo "Shutting down applications..."
    kill $API_PID $WEB_PID 2>/dev/null
    exit
}

# Trap signals to cleanup
trap cleanup INT TERM

echo "Applications started!"
echo "- API (NestJS): http://localhost:4000"
echo "- Web (Next.js): http://localhost:5000"
echo "Press Ctrl+C to stop both applications"

# Wait for background processes
wait