const CidrMatcher = require('cidr-matcher');

const whitelist = ['192.168.1.0/24', '10.0.0.0/8']; // Allowed IPs in CIDR notation
const matcher = new CidrMatcher(whitelist);

module.exports = (req, res) => {
  try {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Client IP: ${clientIP}`); // Log client IP for debugging

    if (matcher.contains(clientIP)) {
      res.status(200).json({
        ip: clientIP,
        message: 'Authorized'
      });
    } else {
      res.status(403).json({
        developer: "@Renkie",
        ip: clientIP,
        message: 'Not authorized'
      });
    }
  } catch (error) {
    console.error('Error in /api/ip:', error);
    res.status(500).json({
      ip: null,
      message: 'Internal Server Error'
    });
  }
};
