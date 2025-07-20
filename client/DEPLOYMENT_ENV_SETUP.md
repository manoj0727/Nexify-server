# Environment Variables Setup for Deployment

## Overview
This guide helps you configure environment variables for different deployment environments.

## Environment Files

1. **`.env`** - Local development (git ignored)
2. **`.env.development`** - Development/staging builds
3. **`.env.production`** - Production builds

## Deployment Platform Configuration

### For Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

#### Production Environment:
```
REACT_APP_API_URL = https://your-production-api.com
REACT_APP_DEMO_EMAIL = (leave empty)
REACT_APP_DEMO_PASSWORD = (leave empty)
```

#### Preview/Development Environment:
```
REACT_APP_API_URL = https://your-staging-api.com
REACT_APP_DEMO_EMAIL = demo@nexify.com
REACT_APP_DEMO_PASSWORD = demo123
```

### For Netlify

1. Go to Site settings → Environment variables
2. Add variables with these scopes:

#### Production:
- Key: `REACT_APP_API_URL`, Value: `https://your-production-api.com`, Deploy contexts: `Production`
- Key: `REACT_APP_DEMO_EMAIL`, Value: (empty), Deploy contexts: `Production`
- Key: `REACT_APP_DEMO_PASSWORD`, Value: (empty), Deploy contexts: `Production`

#### Preview/Branch deploys:
- Key: `REACT_APP_API_URL`, Value: `https://your-staging-api.com`, Deploy contexts: `Deploy previews, Branch deploys`
- Key: `REACT_APP_DEMO_EMAIL`, Value: `demo@nexify.com`, Deploy contexts: `Deploy previews, Branch deploys`
- Key: `REACT_APP_DEMO_PASSWORD`, Value: `demo123`, Deploy contexts: `Deploy previews, Branch deploys`

### For Other Platforms

Most platforms support environment-specific variables. Set:
- **Production**: Empty demo credentials
- **Development/Preview**: Demo credentials for testing

## Important Security Notes

1. **NEVER** set demo credentials in production environment
2. **ALWAYS** use HTTPS URLs for production API
3. **DO NOT** commit `.env` files with real credentials to git
4. **REGULARLY** rotate demo passwords even in development

## Troubleshooting

### "Variable already exists" error
- This means the variable is already configured in your deployment platform
- Go to your platform's environment variables settings
- Update or remove the existing variable
- Redeploy your application

### Demo button not showing in production
- This is intentional for security
- Demo credentials should be empty in production
- The demo button only appears when both `REACT_APP_DEMO_EMAIL` and `REACT_APP_DEMO_PASSWORD` are set

## Build Commands

```bash
# Local development
npm start

# Production build
npm run build

# Test production build locally
serve -s build
```