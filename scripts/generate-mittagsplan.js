const fs = require('fs');
const mittagsplan = require('../src/_data/mittagsplan');

(async () => {
  try {
    const data = await mittagsplan();

    // Properly format the data as JSON with indentation
    const formattedData = JSON.stringify(data, null, 2);

    // Write the formatted data to a JSON file
    fs.writeFileSync('mittagsplan-latest.json', formattedData);

    // Optionally log the formatted data to console for debugging purposes
    console.log('Mittagsplan data generated successfully.');
  } catch (err) {
    console.error('Failed to generate mittagsplan:', err);
    process.exit(1);
  }
})();
