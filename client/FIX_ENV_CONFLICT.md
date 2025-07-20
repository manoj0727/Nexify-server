# Fix Environment Variable Conflict

## Problem
You're getting: "A variable with the name `REACT_APP_DEMO_EMAIL` for the target `production,preview,development` already exists"

## Solution

### Option 1: Update Existing Variables (Recommended)

1. **Go to your deployment platform** (Vercel/Netlify/etc.)
2. **Find Environment Variables section**
3. **Update the existing variables**:

   For `REACT_APP_DEMO_EMAIL` and `REACT_APP_DEMO_PASSWORD`:
   - Production: Set to empty string `""`
   - Preview/Development: Set to `demo@nexify.com` and `demo123`

### Option 2: Remove and Re-add Variables

1. **Delete existing variables** from platform dashboard
2. **Re-add with correct values**:

```bash
# For Production
REACT_APP_API_URL=https://your-api.com
REACT_APP_DEMO_EMAIL=
REACT_APP_DEMO_PASSWORD=

# For Preview/Development
REACT_APP_API_URL=https://staging-api.com
REACT_APP_DEMO_EMAIL=demo@nexify.com
REACT_APP_DEMO_PASSWORD=demo123
```

### Option 3: Use Platform CLI

#### Vercel:
```bash
# Remove existing
vercel env rm REACT_APP_DEMO_EMAIL
vercel env rm REACT_APP_DEMO_PASSWORD

# Add new
vercel env add REACT_APP_DEMO_EMAIL production < /dev/null
vercel env add REACT_APP_DEMO_PASSWORD production < /dev/null
```

#### Netlify:
```bash
# Update existing
netlify env:set REACT_APP_DEMO_EMAIL "" --context production
netlify env:set REACT_APP_DEMO_PASSWORD "" --context production
```

## Quick Checklist

- [ ] Production API URL is HTTPS
- [ ] Demo credentials are empty in production
- [ ] Different API URLs for different environments
- [ ] Variables are scoped to correct environments
- [ ] Redeploy after changes

## Need Different Behavior?

If you want the demo button in production (NOT recommended):
1. Set the demo credentials in production environment
2. Ensure demo user exists in production database
3. Consider the security implications

## Still Having Issues?

1. Clear build cache on your platform
2. Check for typos in variable names
3. Ensure no spaces in values
4. Try deploying a fresh branch