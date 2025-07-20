# Deployment Guide

This guide will help you deploy the Nexify application securely.

## Pre-deployment Checklist

### 1. Environment Variables

#### Server (.env)
1. Copy `.env.example` to `.env` in the server directory
2. Update all values:
   - `MONGODB_URI`: Your production MongoDB connection string
   - `SECRET` & `REFRESH_SECRET`: Generate secure random strings using:
     ```bash
     openssl rand -base64 32
     ```
   - `CRYPTO_KEY`: Generate using:
     ```bash
     openssl rand -hex 32
     ```
   - Email configuration for verification emails
   - API keys for content moderation (optional)
   - Leave `DEMO_EMAIL`, `DEMO_PASSWORD`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` empty for production

#### Client (.env)
1. Copy `.env.example` to `.env` in the client directory
2. Update:
   - `REACT_APP_API_URL`: Your production backend URL
   - Leave demo credentials empty for production

### 2. Security Considerations

- **Never commit .env files** to version control
- Use strong, unique passwords for all services
- Enable HTTPS in production
- Use environment-specific MongoDB databases
- Regularly update dependencies

### 3. Database Setup

1. Create a production MongoDB database
2. Ensure proper authentication is configured
3. Set up regular backups

### 4. Admin User Creation

For production, create admin users manually using the script:
```bash
cd server
npm run create-admin
```

### 5. Build for Production

#### Server
```bash
cd server
npm install --production
```

#### Client
```bash
cd client
npm run build
```

### 6. Deployment Options

#### Option 1: Traditional Hosting
- Deploy server to services like Heroku, DigitalOcean, AWS EC2
- Deploy client build to services like Netlify, Vercel, AWS S3

#### Option 2: Docker
- Use provided Dockerfile (if available)
- Set environment variables through Docker

#### Option 3: Platform-as-a-Service
- Railway, Render, or similar services
- Configure environment variables in platform dashboard

### 7. Post-deployment

1. Test all critical flows:
   - User registration and email verification
   - Login/logout
   - Admin panel access
   - Content creation and moderation

2. Monitor logs for errors
3. Set up error tracking (e.g., Sentry)
4. Configure SSL certificates
5. Set up monitoring and alerts

## Important Notes

- The demo user feature is disabled by default in production
- Admin users must be created manually for security
- All sensitive credentials are managed through environment variables
- Email verification is required for all users