const getDataBySheetName = async (DOCUMENT_ID, sheetName) => {
    const url = `https://docs.google.com/spreadsheets/d/${DOCUMENT_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    const text = await response.text();
    const jsonText = text.match(/\{.*\}/s)[0];
    const data = JSON.parse(jsonText);
    return data;
}
const getValue = (item) => {
    return item.f || item.v; // formatted value or raw value
}
const getHorizontalKeys = async (data ) => {
    const columnNames = data.table.cols.map(col => col.label).filter(col => col);
    if(columnNames.length > 0) {
        return columnNames;
    } else { // no idea why they sometimes empty
        const colNames = [];
        const firstRow = data.table.rows[0];
        for(const col of firstRow.c) {
            colNames.push(getValue(col));
        }
        return colNames;
    }
}

const getHorizontalData = async (DOCUMENT_ID, sheetName, resultIsArray = false, includeFirstRow = false ) => {
    const data = await getDataBySheetName(DOCUMENT_ID, sheetName);
    const colNames = await getHorizontalKeys(data);
    const result = {}
    for (const [index, row] of data.table.rows.entries()) {
        if(!includeFirstRow && index === 0) continue;
        const key = getValue(row.c[0]);
        if(!result[key]) {
            result[key] = {};
        }
        for(const i in colNames) {
            const colName = colNames[i];
            const valueItem = row.c[i];
            if(valueItem){
                const value = getValue(valueItem);
                if(!result[key][colName]) {
                    result[key][colName] = resultIsArray ?  [] : {};
                }
                if(resultIsArray === true) {
                    result[key][colName].push(value);
                } else {
                    result[key][colName] = value;
                }
            }
        }
    }
    return result;
}
exports.getDataBySheetName = getDataBySheetName;
exports.getHorizontalData = getHorizontalData;
exports.getHorizontalKeys = getHorizontalKeys;