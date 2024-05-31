const express = require('express');
const ip = require('ip');
const whitelist = ['192.168.1.0/24', '10.0.0.0/8']; // Add allowed IPs here
const app = express();

app.use((req, res, next) => {
  const clientIP = ip.address(req.ip);
  if (whitelist.includes(clientIP)) {
    next();
  } else {
    res.status(401).send('Not authorized');
  }
});

app.get('/api/ip', (req, res) => {
  const clientIP = ip.address(req.ip);
  res.send(`Your IP is: ${clientIP}`);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});￼Enter
