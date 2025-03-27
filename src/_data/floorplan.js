const { getHorizontalData } = require("../_shared/google_sheets");

const DOCUMENT_ID = "1xngyX8eMkNuapsNlljPAwtysyDYMPguEU38wz2YyE6g";

module.exports = async function () {
    console.log("generate floorplan");
    const i18n = await getHorizontalData(DOCUMENT_ID, "translations");
    const bookings = await getHorizontalData(DOCUMENT_ID, "bookings", true, true);
    // console.log(bookings)
    return {
        i18n: i18n,
        bookings: bookings,
        generatedAt: new Date().toISOString()
    }

};