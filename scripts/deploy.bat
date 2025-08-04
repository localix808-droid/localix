@echo off
echo 🚀 Starting Localix deployment...

echo 🧹 Cleaning up previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules rmdir /s /q node_modules

echo 📦 Installing dependencies...
npm install

echo 🔨 Building for production...
set NODE_ENV=production
npm run build

echo 📝 Creating .nojekyll file...
if exist out (
    echo. > out\.nojekyll
    echo ✅ Build completed successfully!
    echo 📁 Static files are in the 'out' directory
    echo 🌐 Ready for deployment to GitHub Pages
) else (
    echo ❌ Build failed! Check the error messages above.
)

pause 