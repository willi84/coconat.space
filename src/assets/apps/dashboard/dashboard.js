const stopId = "900222106"; // Klein Glien laut deinen Beispieldaten
const updateInterval = 60; // Sekunden
import { loadWeather, SHOW_SUNRISE } from './weather/weather.js';
import { loadDepartures } from './departures/departures.js';
let countdown = updateInterval;

console.log("Dashboard is ready");

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('clock').textContent = `🕒 Uhrzeit: ${time}`;
}





function startCountdown() {
  const countdownEl = document.getElementById('countdown');

  setInterval(() => {
    countdown--;
    countdownEl.textContent = `⏳ Aktualisierung in: ${countdown}s`;
    updateClock();

    if (countdown <= 0) {
      countdown = updateInterval;
      loadDepartures();
    }
  }, 1000);
}

// Alternative zu DOMContentLoaded
document.onreadystatechange = function () {
  console.log("document.readyState: ", document.readyState);
  // if (document.readyState === "interactive") {
  if (document.readyState === "complete") {
    console.log("Dashboard is ready");
    updateClock();
    startCountdown();
    loadDepartures(stopId);
  }
  // const isRaspberryPi = navigator.userAgent.includes("RaspberryPi");
  
  // document.getElementById('client').textContent = navigator.userAgent;
  // document.getElementById('raspberry').textContent = isRaspberryPi;
  // if (isRaspberryPi) {
  //   document.body.classList.add("client-is-pi");
  // }

};


loadWeather(SHOW_SUNRISE);
setInterval(loadWeather, 5 * 60 * 1000);