# 🔧 Troubleshooting Guide - AutoEra AI SaaS

## Issue: Blank Page

If you're seeing a blank page, follow these steps:

### Step 1: Check Browser Console
1. Open your browser (Chrome/Edge recommended)
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Look for any red error messages
5. Take note of the error and check solutions below

### Step 2: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Refresh the page (`Ctrl+R` or `F5`)
3. Look for any failed requests (red status codes)
4. Check if `index.tsx` and `App.tsx` are loading

### Step 3: Clear Browser Cache
```
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page (Ctrl+F5 for hard refresh)
```

### Step 4: Restart Development Server
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 5: Reinstall Dependencies
```bash
# If issues persist, try:
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

## Common Errors and Solutions

### Error: "Cannot find module"
**Solution:**
```bash
npm install
```

### Error: "Port 3000 is already in use"
**Solution:**
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or change port in vite.config.ts
```

### Error: "WebSocket connection failed"
**This is expected!** The WebSocket will fail to connect because there's no backend server running. This won't prevent the app from working - it just means real-time features won't update.

**To fix (optional):**
- Set up a backend WebSocket server
- Or comment out WebSocket initialization in `services/websocket.ts`

### Error: "Failed to fetch" or API errors
**This is expected!** The API calls will fail because there's no backend server. The app uses mock data as fallback.

**To fix (optional):**
- Set up a backend API server
- Update `.env.local` with correct API URL

---

## Verification Checklist

### ✅ Server Running
```bash
# You should see:
VITE v6.4.1  ready in XXXXms
➜  Local:   http://localhost:3000/
```

### ✅ No TypeScript Errors
```bash
# Run type check:
npx tsc --noEmit
```

### ✅ Browser Console Clean
- Open http://localhost:3000/
- Press F12
- Console tab should not have critical errors
- Warnings about WebSocket/API are OK

### ✅ Files Present
Check these files exist:
- ✅ `index.html`
- ✅ `index.tsx`
- ✅ `index.css`
- ✅ `App.tsx`
- ✅ `components/LoginScreen.tsx`
- ✅ `pages/Dashboard.tsx`

---

## Debug Mode

### Enable Verbose Logging

Add this to `App.tsx` at the top:
```typescript
console.log('App.tsx loaded');
console.log('User:', user);
console.log('Current View:', currentView);
```

Add this to `index.tsx`:
```typescript
console.log('index.tsx loaded');
console.log('Root element:', rootElement);
```

### Check React DevTools
1. Install React DevTools browser extension
2. Open DevTools
3. Go to "Components" tab
4. Check if `<App>` component is rendered

---

## Manual Testing Steps

### 1. Test Login Screen
- Open http://localhost:3000/
- You should see the login screen with role buttons
- Click any role (e.g., "General Manager")
- You should be redirected to the dashboard

### 2. Test Navigation
- After login, check the sidebar on the left
- Click different menu items
- Each should load a different page

### 3. Test Service AI Dashboard
- In sidebar, under "AI Model Dashboards"
- Click "Service AI Models"
- You should see 15 AI model cards

---

## Still Not Working?

### Check These Files

**1. App.tsx** - Should have:
```typescript
import React, { useState } from 'react';
// ... other imports

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }
  
  return (
    <AuthProvider>
      <WebSocketProvider userId={user.id}>
        {/* ... rest of app */}
      </WebSocketProvider>
    </AuthProvider>
  );
};
```

**2. index.tsx** - Should have:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**3. index.html** - Should have:
```html
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
```

---

## Emergency Reset

If nothing works, try this complete reset:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Clean everything
rm -rf node_modules
rm -rf .vite
rm package-lock.json

# 3. Reinstall
npm install

# 4. Clear browser cache completely
# - Close all browser tabs
# - Clear all browsing data
# - Restart browser

# 5. Start fresh
npm run dev

# 6. Open in incognito/private window
# - This ensures no cached data
```

---

## Get More Help

### Check Browser Console
The browser console will show the exact error. Common patterns:

**"Cannot read property of undefined"**
- Check if data is being passed correctly
- Look for null/undefined values

**"Module not found"**
- Run `npm install`
- Check import paths

**"Unexpected token"**
- Syntax error in code
- Check for missing brackets/parentheses

### Check Server Terminal
The terminal where `npm run dev` is running will show:
- Compilation errors
- TypeScript errors
- Module resolution issues

---

## Working Configuration

Your app should work with:
- ✅ Node.js 16+ or 18+
- ✅ npm 8+ or 9+
- ✅ Modern browser (Chrome, Edge, Firefox)
- ✅ All dependencies installed
- ✅ No TypeScript errors
- ✅ Server running on port 3000

---

## Expected Warnings (These are OK!)

```
⚠️ WebSocket connection failed
   → This is normal without a backend server

⚠️ Failed to fetch from API
   → This is normal without a backend server

⚠️ React DevTools warning
   → This is just informational
```

---

## Success Indicators

You'll know it's working when you see:

1. **Login Screen** with role buttons
2. **After clicking a role:** Dashboard with sidebar
3. **Sidebar** with menu items
4. **Service AI Models** page with 15 model cards
5. **No critical errors** in browser console

---

## Contact Information

If you're still stuck:
1. Check the browser console error message
2. Check the terminal error message
3. Take screenshots of both
4. Review the error messages carefully

Most issues are:
- Missing dependencies → Run `npm install`
- Port conflicts → Change port or kill process
- Cache issues → Clear browser cache
- TypeScript errors → Check console

---

**Last Updated:** ${new Date().toISOString()}
