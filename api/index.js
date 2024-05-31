const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const indexFile = path.resolve(__dirname, '../public/index.html');

  
  const fotoDir = path.resolve(__dirname, '../foto');
  try {
    if (!fs.existsSync(fotoDir)) {
      fs.mkdirSync(fotoDir);
      console.log('Created directory: ' + fotoDir);
    }
  } catch (err) {
    console.error('Error creating directory:', err);
  }

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading index.html');
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    }
  });

  // Check read access for style.css (informational, not required for serving)
  const cssFile = path.resolve(__dirname, '../public/style.css');
  fs.access(cssFile, fs.constants.R_OK, (err) => {
    if (err) {
      console.error('Error checking read access for style.css:', err);
    } else {
      console.log('style.css is readable');
    }
  });
};
