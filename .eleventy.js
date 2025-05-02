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
  eleventyConfig.addFilter("keys", obj => Object.keys(obj));

// check if date is today
eleventyConfig.addFilter("isToday", (dateString) => {
  // use german time zone
  const nextDate = new Date();
  const today = new Date(nextDate.getTime());
  const date = new Date(dateString);
  // console.log(now);
  const versuchISO = today.toLocaleString("sv-SE", {
    timeZone: "Europe/Berlin",
    hourCycle: "h23",
  });
  const versuchISO_DE = today.toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    hourCycle: "h23",
  });
  // console.log(today);
  // console.log(versuchISO);
  // console.log(versuchISO_DE);
  // console.log(new Date(versuchISO_DE));
  // console.log(new Date(versuchISO).getHours());
  // console.log(new Date(versuchISO_DE).getHours());
  // console.log('-------');

  // const offset = 0;
  // const versuch1 = new Date(new Date(versuchISO_DE).getTime() + offset * 60 * 60 * 1000);
  // const versuch2 = new Date(new Date(versuchISO).getTime() + offset * 60 * 60 * 1000);
  //     const versuchISO1 = versuch1.toLocaleString("sv-SE", { // needs for ISO format
  //       timeZone: "Europe/Berlin",
  //       hourCycle: "h23",
  //     }).replace(" ", "T").slice(0, 16);
  // console.log(versuch1);
  // console.log(versuch2);

  // // wenn nach 14 uhr nächster tag
  // console.log('today.getHours()');
  // console.log(today.getHours());
  // console.log(today.getHours());
  // console.log(today.getHours() >= 14)
  // console.log('today.getHours()');
  // console.log(today.getHours());
  // console.log(today.getHours() >= 14)
  let next = today
  if (today.getHours() >= 14) {
    next = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    nextDate.setDate(nextDate.getDate() + 1);
    // nextDate.setDate(nextDate.getDate() + 1);
  }
  // console.log(`nextDate: ${nextDate}`);
  // console.log(`today: ${today}`);
  // console.log(`date: ${date}`); 
  console.log(`date.toDateString(): ${date.toDateString()} - nextDate.toDateString(): ${nextDate.toDateString()} ==> ${date.toDateString() === nextDate.toDateString()}`); 
  // console.log(next);  
  return date.toDateString() === nextDate.toDateString();
});
eleventyConfig.addFilter("nextMittag", (dateString) => {

  // same logic as isToday but get the day after and check if date is after the isToday
  const date = new Date(dateString);
  const nextDate = new Date();
  const today = new Date(nextDate.getTime());
  // const now = new Date();
   // wenn nach 14 uhr nächster tag
   if (today.getHours() >= 14) {
    // nextDate.setDate(nextDate.getDate() + 2);
    nextDate.setDate(nextDate.getDate() + 1);
  } else {
    nextDate.setDate(nextDate.getDate() + 0);
    // nextDate.setDate(nextDate.getDate() + 1);
  }
  const dateInt = getDateInt(date);
  const nowInt = getDateInt(nextDate);
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
eleventyConfig.addFilter("parseDateLocal", (dateString) => {
  if (dateString === undefined) return "Invalid Date";
  const matches = dateString.match(/\d+/g);
  if (!matches) return "Invalid Date";

  const [year, month, day] = matches.map(Number);
  const date = new Date(year, month - 1, day); // ✅ fix: month - 1
  const dateItem = date.toISOString().split("T");

  // console.log(dateItem[0]);
  // console.log(dateItem[0].toLocaleString("de-DE", {}));
  // console.log(dateItem[0].toLocaleString("de-DE", {
  //   timeZone: "Europe/Berlin",
  //   hourCycle: "h23",
  // }));
  const currentDate = new Date(dateItem[0]);
  console.log(currentDate.toLocaleDateString("de-DE", {}));
  console.log(currentDate.toLocaleString("de-DE", { // needs for ISO format
    timeZone: "Europe/Berlin",
    hourCycle: "h23",
  }));
  return dateItem[0].toLocaleString("de-DE", { // needs for ISO format
    timeZone: "Europe/Berlin",
    hourCycle: "h23",
  }).replace(" ", "T").slice(0, 16); // YYYY-MM-DD
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
  