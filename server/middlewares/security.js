const rateLimit = require('express-rate-limit');

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiting for demo account
const demoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit demo account to 20 logins per hour
  message: 'Demo account rate limit exceeded. Please try again later.',
  keyGenerator: (req) => {
    // Rate limit by email for demo account
    return req.body.email || req.ip;
  },
  skip: (req) => {
    // Only apply to demo account
    return req.body.email !== 'demo@nexify.com';
  }
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  demoLimiter,
  securityHeaders
};