#!/usr/bin/env node

// This file exists for compatibility with deployment platforms
// that expect an index.js file in the root directory

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Nexify server...');

// Change to server directory and start the app
const serverDir = path.join(__dirname, 'server');
process.chdir(serverDir);

// Start the server
require('./app.js');