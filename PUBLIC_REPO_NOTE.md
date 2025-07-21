# Note on Public Repository Security

## Current Setup
This repository contains some non-sensitive configuration that allows the demo to work:
- Backend URL (public API endpoint)
- Demo account credentials (limited permissions)

## What's Safe
- ✅ Backend URL is a public endpoint
- ✅ Demo credentials are meant to be public
- ✅ No production secrets exposed
- ✅ All sensitive data in .env (gitignored)

## What's Protected
- ❌ MongoDB credentials (in environment variables)
- ❌ JWT secrets (in environment variables)
- ❌ Email passwords (in environment variables)
- ❌ Admin credentials (in environment variables)

## For Better Security
If you want to hide even the demo credentials:
1. Remove them from netlify.toml
2. Set them in Netlify dashboard instead
3. The app will still work perfectly

## Important
- The demo account has LIMITED permissions
- Cannot delete data or modify other users
- Rate limited to prevent abuse
- Safe for public access