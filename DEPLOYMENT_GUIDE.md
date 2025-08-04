# GitHub Pages Deployment Guide for Localix

This guide will help you deploy your Localix application to GitHub Pages.

## 🚀 **Step 1: Repository Setup**

### **1.1 Push Your Code to GitHub**
```bash
# Initialize git if not already done
git init

# Add your remote repository
git remote add origin https://github.com/ahmedsherifmohamed/localix2.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for GitHub Pages deployment"

# Push to main branch
git push -u origin main
```

## 🚀 **Step 2: Configure GitHub Secrets**

### **2.1 Go to Your Repository Settings**
1. Navigate to: `https://github.com/ahmedsherifmohamed/localix2/settings`
2. Click on "Secrets and variables" → "Actions"
3. Click "New repository secret"

### **2.2 Add These Secrets**
Add the following secrets with your actual values:

| Secret Name | Value |
|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pntkmsnsbfuifgigjsum.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudGttc25zYmZ1aWZnaWdqc3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMzYxMzEsImV4cCI6MjA2OTgxMjEzMX0.qfF50-x3BnDZxx5GKUouWzRhNZON8-HQF1vp4XzdRkw` |
| `FACEBOOK_APP_ID` | `756283810283662` |
| `FACEBOOK_APP_SECRET` | `your_facebook_app_secret_here` |
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | `756283810283662` |

## 🚀 **Step 3: Enable GitHub Pages**

### **3.1 Configure GitHub Pages**
1. Go to: `https://github.com/ahmedsherifmohamed/localix2/settings/pages`
2. Under "Source", select "Deploy from a branch"
3. Select "gh-pages" branch
4. Click "Save"

### **3.2 Enable GitHub Actions**
1. Go to: `https://github.com/ahmedsherifmohamed/localix2/settings/actions`
2. Under "Actions permissions", select "Allow all actions and reusable workflows"
3. Click "Save"

## 🚀 **Step 4: Deploy**

### **4.1 Trigger Deployment**
Push any change to the main branch:
```bash
git add .
git commit -m "Trigger deployment"
git push origin main
```

### **4.2 Monitor Deployment**
1. Go to: `https://github.com/ahmedsherifmohamed/localix2/actions`
2. Watch the "Deploy to GitHub Pages" workflow
3. Wait for it to complete successfully

## 🚀 **Step 5: Access Your Site**

### **5.1 Your Site URL**
Your site will be available at:
`https://ahmedsherifmohamed.github.io/localix2/`

### **5.2 Custom Domain (Optional)**
If you want a custom domain:
1. Go to repository settings → Pages
2. Add your custom domain
3. Update DNS settings

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Build Fails**
   - Check GitHub Actions logs
   - Verify all secrets are set correctly
   - Ensure all dependencies are in package.json

2. **404 Errors**
   - Make sure `.nojekyll` file exists in public folder
   - Check that `basePath` is set correctly in next.config.js

3. **Environment Variables Not Working**
   - Verify secrets are set in GitHub repository settings
   - Check that variable names match exactly

4. **Images Not Loading**
   - Ensure `images.unoptimized: true` is set in next.config.js
   - Check that image paths are correct

## 📝 **Important Notes**

### **Static Export Limitations:**
- No server-side API routes (they won't work)
- No dynamic server-side rendering
- Client-side only functionality

### **What Works:**
- ✅ Static pages
- ✅ Client-side JavaScript
- ✅ Supabase client operations
- ✅ OAuth redirects (with proper configuration)

### **What Doesn't Work:**
- ❌ Server-side API routes
- ❌ Server-side rendering (SSR)
- ❌ Dynamic routes with server-side data

## 🎯 **Next Steps After Deployment**

1. **Test Your Site**
   - Visit: `https://ahmedsherifmohamed.github.io/localix2/`
   - Test all functionality
   - Check mobile responsiveness

2. **Update Facebook App Settings**
   - Add your GitHub Pages URL to Facebook app domains
   - Update OAuth redirect URIs

3. **Monitor Performance**
   - Use browser dev tools to check loading times
   - Optimize images and assets if needed

## 🚀 **Your Site is Ready!**

Once deployment is complete, your Localix application will be live at:
**https://ahmedsherifmohamed.github.io/localix2/**

---

**Need Help?** Check the GitHub Actions logs or create an issue in your repository. 