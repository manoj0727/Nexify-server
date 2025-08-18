# 🌟 Nexify

Social networking platform with AI content moderation and secure authentication.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node](https://img.shields.io/badge/Node.js-v16+-brightgreen)

## Features

- **🤖 Smart Moderation** - Perspective API, TextRazor, Hugging Face BART
- **🔐 Secure Auth** - Context-based authentication (location, IP, device)
- **👥 Role System** - Admin, Moderator, User roles
- **📱 Social Features** - Posts, comments, likes, communities

## Tech Stack

**Frontend:** React.js, Redux, Tailwind CSS  
**Backend:** Node.js, Express.js, MongoDB  
**Services:** Flask, Azure Blob, Nodemailer

## Quick Start

```bash
# Clone and install
git clone https://github.com/manoj0727/Nexify-server.git
cd Nexify-server

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up .env files (see .env.example)
cp .env.example .env

# Run
cd server && npm start  # Server: localhost:5000
cd client && npm start  # Client: localhost:3000
```

## Environment Variables

```bash
# Required
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

# Optional (for advanced features)
EMAIL=your_email@gmail.com
PASSWORD=your_app_password
PERSPECTIVE_API_KEY=your_perspective_key
TEXTRAZOR_API_KEY=your_textrazor_key
```

## Usage

- **Admin:** Access `/admin` for system management
- **Moderators:** Register with `@mod.nexify.com` domain
- **Users:** Standard social networking features

> **Note:** App works without optional API configs, but advanced features will be disabled.

---
Made with ❤️ by [Manoj](https://github.com/manoj0727)


