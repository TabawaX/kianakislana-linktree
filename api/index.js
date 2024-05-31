const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const indexFile = path.resolve(__dirname, '../public/index.html');
  const cssFile = path.resolve(__dirname, '../public/style.css');

  try {
    // Read index.html and style.css concurrently
    const [indexData, cssData] = await Promise.all([
      fs.promises.readFile(indexFile, 'utf8'),
      fs.promises.readFile(cssFile, 'utf8')
    ]);

    console.log('Successfully read index.html and style.css');

    // Inject the CSS content into the index.html
    let modifiedIndexData = indexData.replace(/<head>/, `<head><style>${cssData}</style>`);

    // Send the modified response with injected styles
    res.setHeader('Content-Type', 'text/html');
    res.send(modifiedIndexData);
  } catch (err) {
    console.error('Error processing files:', err);
    res.status(500).send('Error processing files');
  }
};
