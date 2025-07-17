# Environment Setup Guide for Nexify

This guide will help you set up the environment variables needed to run Nexify server and client.

## Server Environment Variables

1. **Copy the example file:**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Edit the .env file and configure the following:**

### Required Variables

- **MONGODB_URI**: Your MongoDB connection string
  - Sign up for free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - Create a cluster and get your connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

- **SECRET & REFRESH_SECRET**: JWT tokens for authentication
  - Generate secure secrets using:
    ```bash
    openssl rand -base64 32
    ```
  - Use different values for each

- **CRYPTO_KEY**: For encrypting sensitive data
  - Generate using:
    ```bash
    openssl rand -hex 32
    ```

- **EMAIL CONFIGURATION**: For sending verification emails
  - **EMAIL**: Your Gmail address
  - **PASSWORD**: App-specific password (NOT your regular password)
  - **EMAIL_SERVICE**: Keep as "Gmail"
  
  To get an app-specific password:
  1. Enable 2-factor authentication on your Google account
  2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
  3. Generate a new app password for "Mail"

### Optional Variables (for content moderation)

These are optional and can be left as placeholders if you're not using content moderation:

- **PERSPECTIVE_API_KEY**: Google's API for toxicity detection
  - Get it from [Google Cloud Console](https://console.cloud.google.com/)
  - Enable the Perspective API

- **TEXTRAZOR_API_KEY**: For advanced text analysis
  - Sign up at [TextRazor](https://www.textrazor.com/)

- **INTERFACE_API_KEY**: Hugging Face API key
  - Get it from [Hugging Face](https://huggingface.co/settings/tokens)

## Client Environment Variables

1. **Copy the example file:**
   ```bash
   cd client
   cp .env.example .env
   ```

2. **Configure the API URL:**
   - Default: `REACT_APP_API_URL=http://localhost:4000`
   - Change this if your server runs on a different port or domain

## Important Security Notes

- **NEVER commit .env files to version control**
- The .env files are already in .gitignore
- Keep your .env.example files with placeholder values only
- Store production secrets securely (use services like AWS Secrets Manager, Vault, etc.)

## Generating Secure Keys

Here's a quick script to generate all required keys:

```bash
#!/bin/bash
echo "Generating secure keys for Nexify..."
echo ""
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "REFRESH_SECRET=$(openssl rand -base64 32)"
echo "CRYPTO_KEY=$(openssl rand -hex 32)"
```

Save this as `generate-keys.sh` and run with `bash generate-keys.sh`

## Troubleshooting

1. **Email verification not working:**
   - Make sure you're using an app-specific password, not your regular Gmail password
   - Check if "Less secure app access" is needed (though app passwords are preferred)

2. **MongoDB connection issues:**
   - Whitelist your IP address in MongoDB Atlas
   - Check if the connection string is properly formatted

3. **Client can't connect to server:**
   - Ensure both are running (server on port 4000, client on port 3000)
   - Check CORS settings if deploying to different domains