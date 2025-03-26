const fetch = require("node-fetch");
// import fetch from 'node-fetch';

const getDataBySheetName = async (sheetName) => {
    const url = `https://docs.google.com/spreadsheets/d/1ckZeIuqh3ht5XtrcQpalNmYtXwPFoVQb9uXbAw5Mimc/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    const text = await response.text();
    const jsonText = text.match(/\{.*\}/s)[0];
    const data = JSON.parse(jsonText);
    return data;
}
const normalizeMenuData = (menu) => {
    const input = menu.replace(/\s+/g, ' ').trim();
    let data = input; 
    data = data.replace(/\.pdf/ig, ' ')
    data = data.replace(/\.docx/g, ', ')
    data = data.replace(/\.doc/g, ', ')
    data = data.replace(/,\s,/g, ',');
    data = data.replace(/,\s*$/, '')
    data = data.replace(/_/g, ' ');
    // detect camelcase words and split them
    data = data.replace(/([a-z])([A-Z])/g, '$1 $2');

    // avoid such kombis Suppe,Frisches Baguette
    data = data.replace(/,([a-z])/g, ', $1');

    return data;
}

const getDataBySheet = async (sheetName, allData, offset) => {
    const monthData = {};
    // const sheetName = "data"; // 👈 use the actual tab name of the 2nd sheet
    const globalData = await getGlobalData();
    const monthValue = parseInt(globalData.monthValue, 10);
    const month = offset? monthValue +offset :  monthValue;
    const year = globalData.year;
    const url = `https://docs.google.com/spreadsheets/d/1ckZeIuqh3ht5XtrcQpalNmYtXwPFoVQb9uXbAw5Mimc/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    const text = await response.text();

    // Extrahiere JSON-Daten
    const jsonText = text.match(/\{.*\}/s)[0];
    const data = JSON.parse(jsonText);

    const columnNames = data.table.cols.map(col => col.label);

    // Daten umwandeln
    let previousDay = null
    data.table.rows.map((row, index) => {
        const firstCell = row.c[0]?.v;
        
        const isEmpty = firstCell === undefined || firstCell === null || firstCell === "";
        const isNumber = typeof firstCell === 'number';
        const isString = typeof firstCell === 'string';
        // match 1-31
        const isDay = !isEmpty && (isNumber &&  firstCell >= 1 && firstCell <= 31) || (isString && firstCell.match(/^\s*\d{,2}\s*/));
        if(isDay) {
            previousDay = firstCell;
        }
        const indexMenu = columnNames.indexOf("menu");
        const indexType = columnNames.indexOf("type");
        const indexChef = columnNames.indexOf("chef");

        const hasMenu = row.c[indexMenu]?.v;
        const day = isDay ? firstCell : previousDay;
        const type = row.c[indexType]?.v.trim().toLowerCase();
        const chef = row.c[indexChef]?.v;
        const isLunchType = ["mittag", "mittagessen", "lunch", "dinner", "abendbrot", "abend", "morgen"].includes(type);
        if(day && isLunchType && hasMenu) {
            const dayDoubleDigit = day < 10 ? `0${day}` : day;
            const date = `${year}-${month}-${dayDoubleDigit}`;
            const menu = normalizeMenuData(row.c[indexMenu]?.v);

                const item = {
                    // index: `${index}-${day}-${month}-${year}-${type}`,
                    // day: day,
                    type: type,
                    chef: chef,
                    menu: menu,
                }
                if(!allData[date]) {
                    allData[date] = {};

                }
                allData[date][type] = item;

        }
    });
    return monthData;
}
const getGlobalData = async () => {
    const sheetNameGlobal = "global"; // 👈 use the actual tab name of the 2nd shee
    const globalData = await getDataBySheetName(sheetNameGlobal);
    const data = {};
    for(const col of globalData.table.rows) {
        data[col.c[0].v] = col.c[1].v;
    }
    return data;
}

module.exports = async function () {
    console.log("generate Mittagsdata");
    const allData = {};
    const warnings = [];
    const globalData = await getGlobalData();
    if(globalData.year != globalData.yearNext) {
        warnings.push("new year is coming, dont forget to update the sheet");
    }
    await getDataBySheet("data", allData);
    await getDataBySheet("dataNextMonth", allData, 1);
    await console.log(`generate Mittagsdata done (${Object.keys(allData).length} entries)`);
    return {
        items: allData,
        generatedAt: new Date().toISOString(),
        warnings: warnings
    }
};
