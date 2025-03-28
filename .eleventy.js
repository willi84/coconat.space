const getDateInt = (d) =>
  d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();



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
// check if date is today
eleventyConfig.addFilter("isToday", (dateString) => {
  // use german time zone

  const date = new Date(dateString);
  const now = new Date();

  // wenn nach 14 uhr nächster tag
  if (now.getHours() >= 14) {
    now.setDate(now.getDate() + 1);
  }
  return date.toDateString() === now.toDateString();
});
eleventyConfig.addFilter("nextMittag", (dateString) => {

  // same logic as isToday but get the day after and check if date is after the isToday
  const date = new Date(dateString);
  const now = new Date();
   // wenn nach 14 uhr nächster tag
   if (now.getHours() >= 14) {
    now.setDate(now.getDate() + 2);
  } else {
    now.setDate(now.getDate() + 1);
  }
  const dateInt = getDateInt(date);
const nowInt = getDateInt(now);
return dateInt > nowInt;
  
}
);
eleventyConfig.addFilter("parseDate", (dateString) => {
  if (dateString === undefined) return "Invalid Date";
  const matches = dateString.match(/\d+/g);
  if (!matches) return "Invalid Date";

  const [year, month, day] = matches.map(Number);
  const date = new Date(year, month - 1, day); // ✅ fix: month - 1
  const dateItem = date.toISOString().split("T");

  return dateItem[0]; // YYYY-MM-DD
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
  