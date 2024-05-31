const express = require('express');
const cidrMatcher = require('cidr-matcher');
const app = express();

const whitelist = ['192.168.1.0/24', '10.0.0.0/8']; // Allowed IPs in CIDR notation
const matcher = new cidrMatcher(whitelist);

app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  console.log(`Client IP: ${clientIP}`); // Log client IP for debugging
  if (matcher.contains(clientIP)) {
    next();
  } else {
    res.status(401).send('Not authorized');
  }
});

app.get('/api/ip', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  res.send(`Your IP is: ${clientIP}`);
});

// Remove app.listen() since Vercel handles this automatically
