# Localix Troubleshooting Guide

This guide helps you fix common issues with the Localix application.

## 🚨 **Common Issues & Solutions**

### **1. Server Error: Cannot find module 'middleware-manifest.json'**

**Symptoms:**
- Server crashes on startup
- Error about missing middleware-manifest.json
- Build process fails

**Solution:**
```bash
# 1. Stop all Node.js processes
taskkill /f /im node.exe

# 2. Clear build cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 3. Clear node_modules
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# 4. Reinstall dependencies
npm install

# 5. Start development server
npm run dev
```

### **2. Build Fails with Permission Errors**

**Symptoms:**
- EPERM errors during build
- Cannot delete .next folder
- Permission denied errors

**Solution:**
```bash
# 1. Close all editors and terminals
# 2. Run as Administrator (if on Windows)
# 3. Use the deployment script
npm run deploy:clean
```

### **3. Environment Variables Not Loading**

**Symptoms:**
- Supabase connection fails
- Facebook OAuth not working
- API keys not found

**Solution:**
1. Check `.env` file exists in root directory
2. Verify environment variable names are correct
3. Restart development server after changes
4. For production, set GitHub Secrets

### **4. Social Media Connections Not Working**

**Symptoms:**
- "No connections happen" error
- Database tables missing
- OAuth redirects fail

**Solution:**
1. Run SQL schema in Supabase SQL Editor
2. Check database tables exist
3. Verify OAuth credentials
4. Test with `/test-social-connections` page

### **5. Font Not Loading (DM Sans)**

**Symptoms:**
- Font appears as system default
- Font not applied to elements
- Inconsistent typography

**Solution:**
1. Check `app/layout.tsx` has correct font import
2. Verify `tailwind.config.js` font configuration
3. Check `app/globals.css` font rules
4. Clear browser cache

### **6. GitHub Pages Deployment Issues**

**Symptoms:**
- 404 errors on deployed site
- Assets not loading
- Build fails in GitHub Actions

**Solution:**
1. Check `next.config.js` basePath configuration
2. Verify `.nojekyll` file exists
3. Check GitHub Secrets are set
4. Monitor GitHub Actions logs

## 🔧 **Quick Fix Commands**

### **Reset Everything (Nuclear Option)**
```bash
# Stop all processes
taskkill /f /im node.exe

# Clear everything
Remove-Item -Recurse -Force .next, node_modules, out -ErrorAction SilentlyContinue

# Fresh install
npm install

# Start fresh
npm run dev
```

### **Fix Build Issues**
```bash
# Clean build
npm run deploy:clean
```

### **Test Database Connection**
```bash
# Test Supabase connection
npm run test-db
```

### **Check Environment Variables**
```bash
# View current .env file
Get-Content .env
```

## 📋 **Prevention Checklist**

### **Before Starting Development:**
- [ ] All Node.js processes stopped
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] Database schema applied

### **Before Deployment:**
- [ ] Build works locally
- [ ] All environment variables set
- [ ] GitHub Secrets configured
- [ ] `.nojekyll` file present

### **After Deployment:**
- [ ] Site loads without errors
- [ ] All functionality works
- [ ] Mobile responsiveness checked
- [ ] Performance optimized

## 🆘 **Getting Help**

### **1. Check Logs**
- Browser console (F12)
- Terminal output
- GitHub Actions logs

### **2. Test Individual Components**
- `/test-db` - Database connection
- `/test-oauth` - OAuth configuration
- `/test-social-connections` - Social media setup

### **3. Common Debugging Steps**
1. Clear browser cache
2. Restart development server
3. Check network tab for failed requests
4. Verify environment variables
5. Test in incognito mode

## 📞 **Still Having Issues?**

1. **Check the logs** - Look for specific error messages
2. **Test components** - Use the test pages we created
3. **Verify configuration** - Check all config files
4. **Restart everything** - Sometimes a fresh start helps

---

**Remember:** Most issues can be resolved by clearing cache and reinstalling dependencies! 