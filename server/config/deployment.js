const nodemailer = require("nodemailer");

// Production-ready email configuration
const createEmailTransporter = () => {
  const USER = process.env.EMAIL;
  const PASS = process.env.PASSWORD;
  const SERVICE = process.env.EMAIL_SERVICE;

  if (!USER || !PASS) {
    console.error("❌ Email credentials not configured (EMAIL/PASSWORD env vars missing)");
    return null;
  }

  const config = {
    auth: {
      user: USER,
      pass: PASS,
    },
  };

  // Gmail-specific configuration
  if (SERVICE?.toLowerCase() === 'gmail') {
    config.service = 'gmail';
    config.host = 'smtp.gmail.com';
    config.port = 587;
    config.secure = false;
    config.tls = {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    };
  } else if (SERVICE) {
    // Generic service configuration
    config.service = SERVICE;
    config.tls = {
      rejectUnauthorized: false
    };
  } else {
    // Default SMTP configuration for production
    config.host = process.env.SMTP_HOST || 'smtp.gmail.com';
    config.port = process.env.SMTP_PORT || 587;
    config.secure = process.env.SMTP_SECURE === 'true';
    config.tls = {
      rejectUnauthorized: false
    };
  }

  try {
    const transporter = nodemailer.createTransport(config);
    
    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email transporter verification failed:", error.message);
      } else {
        console.log("✅ Email service ready to send messages");
      }
    });

    return transporter;
  } catch (error) {
    console.error("❌ Failed to create email transporter:", error.message);
    return null;
  }
};

// Check if we're in production environment
const isProduction = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.RAILWAY_ENVIRONMENT === 'production' ||
         process.env.RENDER === 'true' ||
         process.env.VERCEL === '1' ||
         process.env.NETLIFY === 'true';
};

// Get the correct base URL for the environment
const getBaseUrl = () => {
  if (isProduction()) {
    return process.env.CLIENT_URL || process.env.RENDER_EXTERNAL_URL || 'https://nexify.com';
  }
  return process.env.CLIENT_URL || 'http://localhost:3000';
};

// Environment validation
const validateEnvironment = () => {
  const required = [
    'MONGODB_URI',
    'SECRET',
    'REFRESH_SECRET',
    'CRYPTO_KEY'
  ];

  const emailRequired = [
    'EMAIL',
    'PASSWORD',
    'EMAIL_SERVICE'
  ];

  const missing = [];

  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check email variables
  const emailMissing = emailRequired.filter(varName => !process.env[varName]);
  if (emailMissing.length > 0) {
    console.warn("⚠️  Email service not fully configured. Missing:", emailMissing.join(', '));
    console.warn("   Users won't receive verification emails. Consider using alternative verification methods.");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate JWT secrets are secure
  if (process.env.SECRET && process.env.SECRET.length < 32) {
    console.warn("⚠️  JWT SECRET is too short. Use at least 32 characters for production.");
  }

  console.log("✅ Environment variables validated");
};

// CORS configuration for production
const getCorsOptions = () => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://nexify-server.netlify.app', // Explicitly allow Netlify URL
    'https://nexify-client.netlify.app', // Alternative naming
  ];

  // Add production URLs
  if (process.env.PRODUCTION_URL) {
    allowedOrigins.push(process.env.PRODUCTION_URL);
  }

  // Add render.com URLs
  if (process.env.RENDER_EXTERNAL_URL) {
    allowedOrigins.push(process.env.RENDER_EXTERNAL_URL);
    allowedOrigins.push(process.env.RENDER_EXTERNAL_URL.replace('https://', 'http://'));
  }

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else if (isProduction()) {
        // In production, log the attempt but don't allow
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      } else {
        // In development, be more permissive
        callback(null, true);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };
};

module.exports = {
  createEmailTransporter,
  isProduction,
  getBaseUrl,
  validateEnvironment,
  getCorsOptions
};