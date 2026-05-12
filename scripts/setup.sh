#!/bin/bash

set -e

echo "🚀 SOLEINTEL Development Setup"
echo "=============================="

# Check prerequisites
echo ""
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi
echo "✅ Node.js $(node --version)"

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing..."
    npm install -g pnpm@9
fi
echo "✅ pnpm $(pnpm --version)"

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Some features won't work."
    echo "   Install from: https://docs.docker.com/get-docker/"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Create environment file
echo ""
echo "⚙️  Setting up environment..."

if [ ! -f .env.local ]; then
    echo "Creating .env.local..."
    cp .env.example .env.local
    echo "✅ Created .env.local (update with your credentials)"
else
    echo "✅ .env.local already exists"
fi

# Start services
echo ""
echo "🐳 Starting Docker services..."

if command -v docker &> /dev/null; then
    docker-compose up -d

    # Wait for services to be ready
    echo ""
    echo "⏳ Waiting for services to start..."
    sleep 10

    # Run migrations
    echo ""
    echo "🗄️  Running database migrations..."
    pnpm db:push

    echo "✅ Services started successfully"
else
    echo "⚠️  Skipping Docker services (not installed)"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "1. Start development servers:"
echo "   pnpm dev"
echo ""
echo "2. View database UI (optional):"
echo "   pnpm db:studio"
echo ""
echo "3. Open extension in Chrome:"
echo "   - Go to chrome://extensions/"
echo "   - Enable 'Developer mode'"
echo "   - Click 'Load unpacked'"
echo "   - Select 'apps/extension/dist'"
echo ""
echo "4. View API documentation:"
echo "   http://localhost:3000/api"
echo ""
echo "Happy coding! 🎉"
