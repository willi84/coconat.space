export const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    }) 
  }
  
export const formatISODate = (date) => {
  return date.toISOString().split("T")[0];
}

export const getTodayISO = () => {
  const day = new Date();
  return formatISODate(day);
}

export const getTomorrowISO = () => {
  const day = new Date();
  day.setDate(day.getDate() + 1); // get tomorrow
  return formatISODate(day);
}
  
 