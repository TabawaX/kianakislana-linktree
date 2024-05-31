const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const indexFile = path.resolve(__dirname, '../public/index.html');
  const cssFile = path.resolve(__dirname, '../public/style.css');
  const fotoDir = path.resolve(__dirname, '../foto');

  // Ensure the "foto" directory exists
  try {
    if (!fs.existsSync(fotoDir)) {
      fs.mkdirSync(fotoDir, { recursive: true });
      console.log('Created directory:', fotoDir);
    }
  } catch (err) {
    console.error('Error creating directory:', err);
    res.status(500).send('Error creating directory');
    return;
  }

  try {
    // Read index.html and style.css concurrently
    const [indexData, cssData] = await Promise.all([
      fs.promises.readFile(indexFile, 'utf8'),
      fs.promises.readFile(cssFile, 'utf8')
    ]);

    console.log('Successfully read index.html and style.css');

    // Inject the CSS content into the index.html
    let modifiedIndexData = indexData.replace(/<head>/, `<head><style>${cssData}</style>`);

    // Handle image references
    const imageTags = modifiedIndexData.match(/<img[^>]+src="([^"]+)"/g); // Regex to find image tags
    if (imageTags) {
      for (const imageTag of imageTags) {
        const relativeImagePath = imageTag.match(/src="([^"]+)"/)[1];
        const imagePath = path.join(fotoDir, relativeImagePath)
        console.log('Relative image path:', relativeImagePath);
        console.log('Resolved image path:', imagePath);

        try {
          await fs.promises.readFile(imagePath);
          console.log('Image accessible:', imagePath);
        } catch (readErr) {
          console.error('Error accessing image:', imagePath, readErr);
          // Optionally modify indexData to use a placeholder image
          modifiedIndexData = modifiedIndexData.replace(relativeImagePath, '/path/to/placeholder.jpg');
        }
      }
    }

    // Send the modified response with injected styles
    res.setHeader('Content-Type', 'text/html');
    res.send(modifiedIndexData);
  } catch (err) {
    console.error('Error processing files:', err);
    res.status(500).send('Error processing files');
  }
};
