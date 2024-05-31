const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const indexFile = path.resolve(__dirname, '../public/index.html');

  // Create the "foto" directory if it doesn't exist
  const fotoDir = path.resolve(__dirname, '../foto');
  try {
    if (!fs.existsSync(fotoDir)) {
      fs.mkdirSync(fotoDir);
      console.log('Created directory: ' + fotoDir);
    }
  } catch (err) {
    console.error('Error creating directory:', err);
  }

  // Read index.html and inject styles and image references
  fs.readFile(indexFile, 'utf8', (err, indexData) => {
    if (err) {
      res.status(500).send('Error reading index.html');
      return; // Exit early on error
    }

    // Read style.css asynchronously (recommended)
    const cssFile = path.resolve(__dirname, '../public/style.css');
    fs.readFile(cssFile, 'utf8', (cssErr, cssData) => {
      if (cssErr) {
        console.error('Error reading style.css:', cssErr);
      } else {
        // Inject the CSS content into the index.html
        indexData = indexData.replace(/<head>/, `<head><style>${cssData}</style>`);
      }

      // Handle image references (assuming they use relative paths)
      const imageRefs = indexData.match(/<img[^>]+src="([^"]+)"/g); // Regex to find image tags
      if (imageRefs) {
        imageRefs.forEach((imageRef) => {
          const imagePath = path.resolve(__dirname, '../foto', imageRef.match(/src="([^"]+)"/)[1]);
          fs.access(imagePath, fs.constants.R_OK, (accessErr) => {
            if (accessErr) {
              console.error('Error accessing image:', imagePath, accessErr);
              // Handle missing or inaccessible images (e.g., display a placeholder)
            } else {
              // Image is accessible, no further action needed
            }
          });
        });
      }

      // Send the modified response with injected styles
      res.setHeader('Content-Type', 'text/html');
      res.send(indexData);
    });
  });
};
