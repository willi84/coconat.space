const mittagsplan = require('../src/_data/mittagsplan');

(async () => {
  const data = await mittagsplan();
  console.log(JSON.stringify(data, null, 2));
})();
