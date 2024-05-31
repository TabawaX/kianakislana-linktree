const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const indexFile = path.resolve(__dirname, '../public/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading index.html');
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    }
  });
};
