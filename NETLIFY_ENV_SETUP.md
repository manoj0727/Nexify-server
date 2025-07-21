# Netlify Environment Variables Setup Guide

## Why Demo Button and Admin Page Don't Work

The issues are caused by missing environment variables in your Netlify deployment. React apps need environment variables to be prefixed with `REACT_APP_` and they must be set during build time.

## Complete Fix Instructions

### Method 1: Using Netlify Dashboard (Recommended)

1. **Login to Netlify** and go to your site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable** and add these:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `REACT_APP_API_URL` | Your backend URL (e.g., `https://nexify-api.onrender.com`) | Required for API calls |
   | `REACT_APP_DEMO_EMAIL` | `demo@nexify.com` | Shows demo button |
   | `REACT_APP_DEMO_PASSWORD` | `demo123` | Demo account password |

4. After adding all variables, go to **Deploys** tab
5. Click **Trigger deploy** → **Clear cache and deploy site**

### Method 2: Using netlify.toml (Already configured)

The `netlify.toml` file I created includes these variables, but you still need to:

1. Update the `REACT_APP_API_URL` with your actual backend URL
2. Commit and push the changes
3. Netlify will auto-deploy with new settings

### Method 3: Using .env files

Create a `.env.production` file in the client directory:

```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_DEMO_EMAIL=demo@nexify.com
REACT_APP_DEMO_PASSWORD=demo123
```

**Note**: This method requires the file to be committed to git, which is not recommended for sensitive data.

## Testing After Setup

### 1. Demo Button
- Visit https://nexify-server.netlify.app/signin
- You should now see the "Try Demo Account" button below the sign-in button

### 2. Admin Page
- Navigate to https://nexify-server.netlify.app/admin
- Should redirect to admin signin page
- Use admin credentials to login

### 3. Sign Up Page
- Direct navigation to https://nexify-server.netlify.app/signup should work
- No more 404 errors

## Troubleshooting

### Still no demo button?
1. Check browser console for errors
2. Open DevTools → Network tab → Refresh page
3. Look for the main JavaScript file and check if variables are included

### Admin page shows 404?
1. Ensure `_redirects` file exists in `public` folder
2. Check if latest deployment includes the redirect rules

### API calls failing?
1. Verify `REACT_APP_API_URL` is set correctly
2. Check CORS settings in your backend
3. Ensure backend is deployed and running

## Important Notes

1. **Environment variables in React are embedded during build time**
   - Changing them in Netlify requires a new build
   - They become part of your JavaScript bundle

2. **Security considerations**
   - Never put sensitive secrets in React environment variables
   - They are visible to anyone who views your site's source code
   - Only use them for public configuration like API URLs

3. **Backend requirements**
   - Your backend must be deployed first
   - Update CORS to allow your Netlify URL
   - Ensure all backend environment variables are set

## Quick Checklist

- [ ] Backend is deployed and accessible
- [ ] Backend URL is set in `REACT_APP_API_URL`
- [ ] Demo credentials are set in Netlify environment variables
- [ ] Triggered a fresh deploy with "Clear cache and deploy site"
- [ ] `_redirects` file exists in `public` folder
- [ ] CORS is configured in backend to allow Netlify URL

## Commands to Run Locally

To test environment variables locally:

```bash
# In client directory
REACT_APP_API_URL=http://localhost:4000 \
REACT_APP_DEMO_EMAIL=demo@nexify.com \
REACT_APP_DEMO_PASSWORD=demo123 \
npm start
```

This will show you exactly how it should look when properly configured.