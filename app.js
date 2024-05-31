const express = require('express')
const cidrMatcher = require('cidr-matcher')
const app = express()

const whitelist = ['192.168.1.0/24', '10.0.0.0/8'] // Allowed IPs in CIDR notation
const matcher = new cidrMatcher(whitelist)

app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress
  console.log(`Client IP: ${clientIP}`) // Log client IP for debugging
  if (matcher.contains(clientIP)) {
    next()
  } else {
    res.status(401).json({ 
      status: "401",
      developer: "@Renkie",
      ip: clientIP,
      message: 'Not authorized'
    })
  }
})

app.get('/api/ip', (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress
    res.json({ 
      status: "200",
      developer: "@renkie",
      ip: clientIP,
      message: 'Authorized'
    })
  } catch (error) {
    console.error('Error in /api/ip:', error)
    res.status(500).json({
      ip: null,
      message: 'Internal Server Error'
    })
  }
})


module.exports = app
