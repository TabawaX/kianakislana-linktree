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

    // ...
// Handle image references
const imageTags = modifiedIndexData.match(/<img[^>]+(src|rel)="([^"]+)"/g); // Regex to find image tags with src or rel
if (imageTags) {
  for (const imageTag of imageTags) {
    // Match both src and rel attributes and capture the values
    const srcMatch = imageTag.match(/src="([^"]+)"/);
    const relMatch = imageTag.match(/rel="([^"]+)"/);

    let relativeImagePaths = [];
    if (srcMatch) {
      relativeImagePaths.push(srcMatch[1]);
    }
    if (relMatch) {
      relativeImagePaths.push(relMatch[1]);
    }

    for (const relativeImagePath of relativeImagePaths) {
      const imagePath = path.join(fotoDir, relativeImagePath.replace(/^\/foto/, '')); // Remove leading /foto
      console.log('Relative image path:', relativeImagePath);
      console.log('Resolved image path:', imagePath);

      try {
        await fs.promises.readFile(imagePath);
        console.log('Image accessible:', imagePath);
      } catch (readErr) {
        console.error('Error accessing image:', imagePath, readErr);
        // **Removed placeholder logic**
      }
    }
  }
}



// ...

    // Send the modified response with injected styles
    res.setHeader('Content-Type', 'text/html');
    res.send(modifiedIndexData);
  } catch (err) {
    console.error('Error processing files:', err);
    res.status(500).send('Error processing files');
  }
};
