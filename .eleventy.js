module.exports = function (eleventyConfig) {
    // Set input and output directories
// Copy static files
eleventyConfig.addPassthroughCopy("src/assets");
eleventyConfig.addPassthroughCopy("src/styles.css");
eleventyConfig.addPassthroughCopy("src/icons"); // If you have icons
eleventyConfig.addPassthroughCopy("src/manifest.json"); // PWA support
eleventyConfig.addFilter("typeOf", value => typeof value);
eleventyConfig.addFilter("parseDate", (dateString) => {
  if(dateString === undefined) return "Invalid   Date";
  const matches = dateString.match(/\d+/g);
  if (!matches) return "Invalid Date";

  const [year, month, day] = matches.map(Number);
  const date = new Date(year, month -1, day);

  // German date
  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
});
eleventyConfig.addFilter("parseDateFull", (dateString) => {
  if (dateString === undefined) return "Invalid Date";
  const matches = dateString.match(/\d+/g);
  if (!matches) return "Invalid Date";

  const [year, month, day] = matches.map(Number);
  const date = new Date(year, month - 1, day); // ✅ fix: month - 1
  const dateItem = date.toISOString().split("T");

  return dateItem[0]; // YYYY-MM-DD
});


    return {
      dir: {
        input: "src",
        output: "_site"
      }
    };
  };
  