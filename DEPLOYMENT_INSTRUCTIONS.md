# Deployment Instructions for Nexify

## ⚠️ Security First - Public Repository

This is a public repository. Follow these rules:
1. **NEVER** commit sensitive data
2. **ALWAYS** use environment variables
3. **CHECK** files before committing

## Setting Environment Variables

### Netlify (Frontend)

1. **Login to Netlify Dashboard**
2. **Go to**: Site settings → Environment variables
3. **Add these variables**:
   ```
   REACT_APP_API_URL = [your-backend-url]
   REACT_APP_DEMO_EMAIL = [optional-demo-email]
   REACT_APP_DEMO_PASSWORD = [optional-demo-password]
   ```
4. **Important**: After adding variables:
   - Click "Trigger deploy"
   - Select "Clear cache and deploy site"

### Render/Railway (Backend)

1. **Login to your hosting platform**
2. **Add ALL variables from `.env.example`**
3. **Use strong values**:
   ```bash
   # Generate secrets
   openssl rand -base64 32  # For JWT secrets
   openssl rand -hex 32     # For crypto key
   ```

## Local Development Setup

1. **Clone the repository**
2. **Create `.env` file** (it's gitignored):
   ```bash
   cp .env.example .env
   ```
3. **Fill in your values** in `.env`
4. **Never commit `.env`**

## Pre-Deployment Checklist

- [ ] No credentials in code files
- [ ] No credentials in config files
- [ ] Environment variables set in hosting platform
- [ ] `.env` is in `.gitignore`
- [ ] Used strong, unique passwords
- [ ] Different secrets for dev/prod

## Common Issues

### "An unexpected error occurred"
- Backend not deployed or URL incorrect
- Check `REACT_APP_API_URL` in Netlify

### "Cannot connect to server"
- Backend is down or not accessible
- Check backend logs in Render/Railway

### Demo button not showing
- `REACT_APP_DEMO_EMAIL` not set in Netlify
- Must redeploy after setting variables

## Quick Commands

```bash
# Check for exposed secrets before committing
git diff --staged | grep -i "password\|secret\|key\|mongodb"

# Generate secure secrets
openssl rand -base64 32

# Test production build locally
cd client && npm run build && serve -s build
```

## Remember

- Public repo = No secrets in code
- Use environment variables for everything sensitive
- Check twice before pushing
- When in doubt, don't commit it