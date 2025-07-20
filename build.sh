#!/bin/bash

# This script ensures client dependencies are installed before building
echo "📦 Installing client dependencies..."
cd client && npm install

echo "🔨 Building client..."
npm run build

echo "✅ Build complete!"