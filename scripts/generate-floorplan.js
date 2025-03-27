const fs = require('fs');
const floorplan = require('../src/_data/floorplan');

(async () => {
  try {
    const data = await floorplan();
    // console.log(data);

    // Write the formatted data to a JSON file
    fs.writeFileSync('floorplan-latest.json', JSON.stringify(data));

    // Optionally log the formatted data to console for debugging purposes
    console.log('Floorplan data generated successfully.');
  } catch (err) {
    console.error('Failed to generate floorplan:', err);
    process.exit(1);
  }
})();
