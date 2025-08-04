#!/bin/bash

# Localix Deployment Script
echo "🚀 Starting Localix deployment..."

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
NODE_ENV=production npm run build

# Create .nojekyll file for GitHub Pages
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

echo "✅ Build completed successfully!"
echo "📁 Static files are in the 'out' directory"
echo "🌐 Ready for deployment to GitHub Pages" 