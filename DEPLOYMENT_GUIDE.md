# Nexify Server Deployment Guide

## Common Deployment Issues and Solutions

### 1. Email/OTP Not Working

**Problem**: Users don't receive verification emails or OTPs.

**Solutions**:

#### For Gmail:
1. **Use App-Specific Password** (NOT your regular Gmail password):
   - Go to https://myaccount.google.com/security
   - Enable 2-Factor Authentication
   - Generate an app-specific password
   - Use this 16-character password in your `.env` file

2. **Check Environment Variables**:
   ```bash
   EMAIL=your-email@gmail.com
   PASSWORD=your-16-char-app-password  # App-specific password!
   EMAIL_SERVICE=Gmail
   ```

3. **Gmail Security**:
   - Ensure "Less secure app access" is OFF (we use app passwords instead)
   - Check if Gmail is blocking sign-in attempts

#### For Production (Recommended):
Use a dedicated email service like SendGrid, Mailgun, or AWS SES:

```bash
# SendGrid example
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
EMAIL=apikey
PASSWORD=your-sendgrid-api-key
```

#### Fallback Solution:
If email service is not configured, the server will show verification codes in the response (development mode only).

### 2. Demo/Admin Users Not Working

**Problem**: Demo and admin users are not created automatically.

**Solutions**:

1. **Check Environment Variables**:
   ```bash
   # These should be set in .env
   DEMO_EMAIL=demo@nexify.com
   DEMO_PASSWORD=demo123
   DEMO_NAME=Demo User
   
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

2. **Check Server Logs**:
   Look for these messages on startup:
   - "✓ Demo user created successfully" or "✓ Demo user updated"
   - "✓ Default admin user created" or "✓ Default admin user updated"

3. **Manual Creation**:
   For production, it's recommended to create admin users manually via database.

### 3. CORS Issues

**Problem**: Frontend can't connect to backend.

**Solutions**:

1. **Update CLIENT_URL**:
   ```bash
   CLIENT_URL=https://your-frontend-domain.com
   ```

2. **Check Multiple Origins**:
   The server automatically allows:
   - The URL in `CLIENT_URL`
   - `http://localhost:3000` and `http://localhost:3001`
   - Any URL in `PRODUCTION_URL` or `RENDER_EXTERNAL_URL`

3. **Verify Headers**:
   Ensure your frontend sends credentials:
   ```javascript
   fetch(url, {
     credentials: 'include',
     // ... other options
   })
   ```

### 4. Environment Variables Not Loading

**Problem**: Server crashes with "JwtStrategy requires a secret or key" or similar.

**Solutions**:

1. **File Location**:
   - For local development: `.env` file in project root
   - For production: Set variables in your hosting platform's dashboard

2. **Required Variables**:
   ```bash
   MONGODB_URI=your-mongodb-connection-string
   SECRET=min-32-character-random-string
   REFRESH_SECRET=min-32-character-random-string
   CRYPTO_KEY=64-character-hex-string
   ```

3. **Generate Secure Keys**:
   ```bash
   # Generate JWT secrets
   openssl rand -base64 32
   
   # Generate crypto key
   openssl rand -hex 32
   ```

### 5. MongoDB Connection Issues

**Problem**: "MongooseServerSelectionError" or connection timeouts.

**Solutions**:

1. **Whitelist IP Addresses**:
   - In MongoDB Atlas, go to Network Access
   - Add `0.0.0.0/0` to allow all IPs (for production)
   - Or add your hosting provider's IP ranges

2. **Check Connection String**:
   - Ensure username/password are URL-encoded
   - Include `retryWrites=true&w=majority`
   - Use the correct database name

3. **Example Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/nexify?retryWrites=true&w=majority
   ```

## Deployment Platforms

### Render.com
1. Set all environment variables in the dashboard
2. Use `npm start` as the start command
3. Set `NODE_ENV=production` or `RENDER=true`

### Railway
1. Add environment variables in settings
2. Railway auto-detects Node.js apps
3. Set `RAILWAY_ENVIRONMENT=production`

### Heroku
1. Use Heroku Config Vars for environment variables
2. Ensure `PORT` is not hardcoded (Heroku provides it)
3. Add `Procfile` with: `web: npm start`

### Vercel
1. Better suited for frontend; use Vercel Functions for API
2. Set environment variables in project settings
3. May require serverless adaptations

## Testing Deployment

After deployment, test these endpoints:

1. **Server Status**:
   ```
   GET https://your-api-domain.com/server-status
   ```

2. **Sign Up** (if email not configured):
   ```
   POST https://your-api-domain.com/users/signup
   ```
   Check response for `requiresManualVerification: true`

3. **Demo Login**:
   ```
   POST https://your-api-domain.com/users/signin
   {
     "email": "demo@nexify.com",
     "password": "demo123"
   }
   ```

## Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] MongoDB connection uses SSL
- [ ] CORS configured for production domains only
- [ ] Email service uses app-specific passwords
- [ ] Demo/admin users disabled in production
- [ ] Environment variables not exposed in logs
- [ ] HTTPS enabled on all domains

## Need Help?

1. Check server logs for specific error messages
2. Verify all required environment variables are set
3. Test endpoints with Postman or curl
4. Check MongoDB Atlas logs for connection issues
5. Review CORS settings if frontend can't connect