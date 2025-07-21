# Security Guidelines for Nexify

## ⚠️ Important: This is a Public Repository

Since this repository is public, **NEVER commit sensitive information** such as:
- API keys
- Passwords
- JWT secrets
- Database credentials
- Email passwords
- Any production credentials

## Setting Up Environment Variables

### For Local Development

1. Create a `.env` file in the root directory (already in .gitignore)
2. Copy the structure from `.env.example`
3. Fill in your own values
4. Never commit the `.env` file

### For Production (Netlify)

Set environment variables in the Netlify dashboard:

1. Go to Site settings → Environment variables
2. Add these variables:
   - `REACT_APP_API_URL` - Your backend URL
   - `REACT_APP_DEMO_EMAIL` - Demo account email (optional)
   - `REACT_APP_DEMO_PASSWORD` - Demo account password (optional)

### For Backend (Render/Railway)

Set environment variables in your hosting platform:

1. All variables from `.env.example`
2. Use strong, unique passwords
3. Generate secure secrets using:
   ```bash
   openssl rand -base64 32
   ```

## Security Best Practices

### 1. Environment Variables
- ✅ Use `.env` files locally (in .gitignore)
- ✅ Use platform environment variables in production
- ❌ Never hardcode credentials in code
- ❌ Never commit `.env` files

### 2. Secrets Management
- Generate strong secrets for JWT
- Use different secrets for development and production
- Rotate secrets regularly
- Use app-specific passwords for Gmail

### 3. Demo Accounts
- Demo credentials should have minimal permissions
- Don't use real user data for demos
- Consider disabling demo in production

### 4. MongoDB Security
- Use MongoDB Atlas with IP whitelisting
- Create database-specific users
- Use connection strings with SSL
- Regular backups

### 5. API Security
- CORS properly configured
- Rate limiting implemented
- Input validation on all endpoints
- Authentication required for sensitive operations

## If You Accidentally Exposed Credentials

1. **Immediately**:
   - Change all exposed passwords
   - Revoke and regenerate API keys
   - Update all deployments

2. **Check Git History**:
   ```bash
   git log -p | grep -i "password\|secret\|key"
   ```

3. **Clean Git History** (if needed):
   - Use BFG Repo-Cleaner or git filter-branch
   - Force push to all branches
   - Notify all contributors

## Deployment Checklist

- [ ] All sensitive data in environment variables
- [ ] `.env` files are in `.gitignore`
- [ ] No credentials in `netlify.toml`
- [ ] No credentials in any config files
- [ ] Production uses strong, unique secrets
- [ ] Demo account has limited permissions
- [ ] CORS configured for production domains only

## Reporting Security Issues

If you discover a security vulnerability, please email directly instead of creating a public issue.

Remember: **When in doubt, keep it out!** Don't commit anything that looks sensitive.