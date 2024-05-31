const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const indexFile = path.resolve(__dirname, '../public/index.html');
  const fotoDir = path.resolve(__dirname, '../foto');
  const cssFile = path.resolve(__dirname, '../public/style.css');

  // Create the "foto" directory if it doesn't exist
  try {
    if (!fs.existsSync(fotoDir)) {
      fs.mkdirSync(fotoDir, { recursive: true });
      console.log('Created directory:', fotoDir);
    }
  } catch (err) {
    console.error('Error creating directory:', err);
  }

  // Read files with async/await
  try {
    let indexData = await fs.promises.readFile(indexFile, 'utf8');
    console.log('Successfully read index.html');

    try {
      const cssData = await fs.promises.readFile(cssFile, 'utf8');
      console.log('Successfully read style.css');

      // Inject the CSS content into the index.html
      indexData = indexData.replace(/<head>/, `<head><style>${cssData}</style>`);
    } catch (cssErr) {
      console.error('Error reading style.css:', cssErr);
    }

    // Handle image references
    const imageRefs = indexData.match(/<img[^>]+src="([^"]+)"/g); // Regex to find image tags
    if (imageRefs) {
      for (const imageRef of imageRefs) {
        const relativeImagePath = imageRef.match(/src="([^"]+)"/)[1];
        const imagePath = path.resolve(fotoDir, relativeImagePath);
        console.log('Checking image path:', imagePath);

        try {
          await fs.promises.access(imagePath, fs.constants.R_OK);
          console.log('Image accessible:', imagePath);
        } catch (accessErr) {
          console.error('Error accessing image:', imagePath, accessErr);
          // Optionally modify indexData to use a placeholder image
          indexData = indexData.replace(relativeImagePath, '/path/to/placeholder.jpg');
        }
      }
    }

    // Send the modified response with injected styles
    res.setHeader('Content-Type', 'text/html');
    res.send(indexData);
  } catch (indexErr) {
    console.error('Error reading index.html:', indexErr);
    res.status(500).send('Error reading index.html');
  }
};
