#!/usr/bin/env node

/**
 * Script to help set up environment variables for deployment platforms
 * Run: node scripts/setup-deployment-env.js
 */

const envConfig = {
  production: {
    REACT_APP_API_URL: 'https://your-production-api.com', // UPDATE THIS
    REACT_APP_DEMO_EMAIL: '',
    REACT_APP_DEMO_PASSWORD: ''
  },
  preview: {
    REACT_APP_API_URL: 'https://your-staging-api.com', // UPDATE THIS
    REACT_APP_DEMO_EMAIL: 'demo@nexify.com',
    REACT_APP_DEMO_PASSWORD: 'demo123'
  },
  development: {
    REACT_APP_API_URL: 'http://localhost:4000',
    REACT_APP_DEMO_EMAIL: 'demo@nexify.com',
    REACT_APP_DEMO_PASSWORD: 'demo123'
  }
};

console.log('Environment Variables Configuration for Nexify\n');
console.log('Copy and paste these into your deployment platform:\n');

Object.entries(envConfig).forEach(([env, vars]) => {
  console.log(`\n=== ${env.toUpperCase()} ENVIRONMENT ===`);
  Object.entries(vars).forEach(([key, value]) => {
    console.log(`${key}=${value || '(leave empty)'}`);
  });
});

console.log('\n\nFor Vercel CLI:');
console.log('------------------------');
Object.entries(envConfig.production).forEach(([key, value]) => {
  console.log(`vercel env add ${key} production`);
});

console.log('\n\nFor Netlify CLI:');
console.log('------------------------');
console.log('netlify env:set REACT_APP_API_URL "https://your-production-api.com" --context production');
console.log('netlify env:set REACT_APP_DEMO_EMAIL "" --context production');
console.log('netlify env:set REACT_APP_DEMO_PASSWORD "" --context production');

console.log('\n\nIMPORTANT REMINDERS:');
console.log('1. Update the API URLs with your actual endpoints');
console.log('2. Never set demo credentials in production');
console.log('3. If you get "variable already exists" error, update the existing variable in your platform dashboard');
console.log('4. After setting variables, redeploy your application');