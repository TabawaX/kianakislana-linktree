const express = require('express');
const path = require('path');
const CidrMatcher = require('cidr-matcher');
const app = express();

const whitelist = ['192.168.1.0/24', '10.0.0.0/8']; // Allowed IPs in CIDR notation
const matcher = new CidrMatcher(whitelist);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'foto' directory
app.use('/foto', express.static(path.join(__dirname, 'foto')));

app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  console.log(`Client IP: ${clientIP}`); // Log client IP for debugging
  if (matcher.contains(clientIP)) {
    next();
  } else {
    res.status(403).json({
      developer: "@Renkie",
      ip: clientIP,
      message: 'Not authorized'
    });
  }
});

app.get('/api/ip', (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress;
    res.status(200).json({
      ip: clientIP,
      message: 'Authorized'
    });
  } catch (error) {
    console.error('Error in /api/ip:', error);
    res.status(500).json({
      ip: null,
      message: 'Internal Server Error'
    });
  }
});

// No app.listen() needed for Vercel serverless functions

module.exports = app; // Ensure app is exported I'm
