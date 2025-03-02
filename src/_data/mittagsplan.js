const fetch = require("node-fetch");
// import fetch from 'node-fetch';


module.exports = async function () {
    const url = "https://docs.google.com/spreadsheets/d/1aaWX3myl0WQzZuqwObUXpngXVHvq5awCiKhx8PKrSzs/gviz/tq?tqx=out:json";
    // const url = "https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/gviz/tq?tqx=out:json";
    const response = await fetch(url);
    const text = await response.text();

    // Extrahiere JSON-Daten
    const jsonText = text.match(/\{.*\}/s)[0];
    const data = JSON.parse(jsonText);

    // Daten umwandeln
    return data.table.rows.map(row => {
        return {
            tag: row.c[0]?.v,
            gericht: row.c[1]?.v,
            sauce: row.c[2]?.v,
            beilage: row.c[3]?.v,
            dessert: row.c[4]?.v
        };
    });
};
