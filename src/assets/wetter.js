// Flag zum Ein-/Ausschalten der Sonnenzeitenanzeige oben
const SHOW_SUNRISE = false;

async function loadWeather(showSunrises) {
  const lat = 53.0518;
  const lon = 11.7682;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,cloudcover,precipitation,snowfall,windspeed_10m&daily=sunrise,sunset&timezone=Europe%2FBerlin`;

  const res = await fetch(url);
  const data = await res.json();

  const times = data.hourly.time;
  const temps = data.hourly.temperature_2m;
  const codes = data.hourly.weathercode || [];
  const clouds = data.hourly.cloudcover;
  const rain = data.hourly.precipitation;
  const snow = data.hourly.snowfall;
  const wind = data.hourly.windspeed_10m;

  const sunrises = data.daily.sunrise;
  const sunsets = data.daily.sunset;

  const weatherCodes = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌧️", 55: "🌧️", 61: "🌦️", 63: "🌧️", 65: "🌧️",
    71: "🌨️", 73: "🌨️", 75: "❄️", 80: "🌦️", 81: "🌧️", 82: "🌧️",
    95: "⛈️", 96: "⛈️", 99: "⛈️"
  };

  function getAlternativeEmoji(cloud, rain, snow, wind) {
    if (snow > 0.2) return "🌨️";
    if (rain > 4) return "🌧️";
    if (rain > 0.1) return "🌦️";
    if (wind > 60) return "🌬️";
    if (wind > 30) return "💨";
    if (cloud > 75) return "☁️";
    if (cloud > 40) return "⛅";
    if (cloud > 10) return "🌤️";
    return "☀️";
  }

  function isNight(timeISO, sunrise, sunset) {
    const time = new Date(timeISO);
    const sun_rise = new Date(sunrise);
    const sun_down = new Date(sunset);
    return time < sun_rise || time > sun_down;
  }

  const targetHours = ["06:00", "12:00", "18:00"];
  const tbody = document.querySelector("#wetter tbody");
  tbody.innerHTML = "";

  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  for (let tagOffset = 0; tagOffset < 3; tagOffset++) {
    const datum = new Date(heute);
    datum.setDate(heute.getDate() + tagOffset);
    const isoDate = datum.toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });

    const tagName = datum.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit"
    });

    const sunriseTime = new Date(sunrises[tagOffset]).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin"
    });
    const sunsetTime = new Date(sunsets[tagOffset]).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin"
    });

    const tagesWerte = targetHours.map((zeit, index) => {
      const zeitWert = getValuesForTime(isoDate, zeit, sunrises[tagOffset], sunsets[tagOffset]);

      if(showSunrises){
        if (index === 0) {
          return `${zeitWert}<br><span class="small text-body-secondary fw-light">↑ ${sunriseTime}</span>`;
        }
        if (index === 1) {
          return `${zeitWert}<br><span class="small text-body-secondary fw-light">&nbsp;</span>`;
        }
        if (index === 2) {
          return `${zeitWert}<br><span class="small text-body-secondary fw-light">↓ ${sunsetTime}</span>`;
        }
      }
      return zeitWert;
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-start"><strong>${tagName}</strong></td>
      <td>${tagesWerte[0]}</td>
      <td>${tagesWerte[1]}</td>
      <td>${tagesWerte[2]}</td>
    `;
    tbody.appendChild(tr);
  }

  // Standzeit anzeigen
  const stand = new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin"
  });
  document.getElementById("stand").innerText = `Stand: ${stand}`;

  // Aktuelles Wetter (auf volle Stunde gerundet)
  const jetzt = new Date();
  const aktuelleStunde = new Date(jetzt);
  aktuelleStunde.setMinutes(0, 0, 0);

  const aktuelleISO = aktuelleStunde.toLocaleString("sv-SE", {
    timeZone: "Europe/Berlin",
    hourCycle: "h23"
  }).replace(" ", "T").slice(0, 16);

  const indexNow = times.findIndex(z => z === aktuelleISO);
  let currentHTML = "";

  if (indexNow !== -1) {
    const istNachtJetzt = isNight(aktuelleISO, sunrises[0], sunsets[0]);
    let emoji = "❓";

    if (codes.length > 0 && codes[indexNow] !== undefined) {
      emoji = weatherCodes[codes[indexNow]] || "❓";
    } else {
      emoji = getAlternativeEmoji(
        clouds[indexNow],
        rain[indexNow],
        snow[indexNow],
        wind[indexNow]
      );
      if (istNachtJetzt) {
        if (emoji === "☀️") emoji = "🌕";
        if (emoji === "🌤️" || emoji === "⛅") emoji = "🌥️";
      }
    }

    const temp = Math.round(temps[indexNow]);
    currentHTML = `${emoji} ${temp}°C`;
  } else {
    currentHTML = "–";
  }

  document.getElementById("aktuell").innerText = currentHTML;

  // Sonnenauf-/untergang oben anzeigen (optional per Flag)
  const sunriseTimeHeute = new Date(sunrises[0]).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin"
  });
  const sunsetTimeHeute = new Date(sunsets[0]).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin"
  });
  
  if (showSunrises) {
    document.getElementById("sonnenzeiten").innerText = `☀️ Heute: ↑ ${sunriseTimeHeute} ↓ ${sunsetTimeHeute}`;
  } else {
    document.getElementById("sonnenzeiten").innerText = "";
  }

  function getValuesForTime(datumISO, zielzeit, sunrise, sunset) {
    const [zielStunde, zielMinute] = zielzeit.split(":").map(Number);
    const startZeit = new Date(`${datumISO}T${zielzeit}`);

    for (let offset = 0; offset <= 3; offset++) {
      const versuch = new Date(startZeit.getTime() + offset * 60 * 60 * 1000);
      const versuchISO = versuch.toLocaleString("sv-SE", { // needs for ISO format
        timeZone: "Europe/Berlin",
        hourCycle: "h23",
      }).replace(" ", "T").slice(0, 16);

      const index = times.findIndex(z => z === versuchISO);
      if (index !== -1) {
        let emoji = "❓";
        const istNachtJetzt = isNight(versuchISO, sunrise, sunset);

        if (codes.length > 0 && codes[index] !== undefined) {
          emoji = weatherCodes[codes[index]] || "❓";
        } else {
          emoji = getAlternativeEmoji(clouds[index], rain[index], snow[index], wind[index]);
          if (istNachtJetzt) {
            if (emoji === "☀️") emoji = "🌕";
            if (emoji === "🌤️" || emoji === "⛅") emoji = "🌥️";
          }
        }

        const temp = Math.round(temps[index]);
        return `${emoji} ${temp}°C`;
      }
    }

    return "<span class='text-muted'>–</span>";
  }
}

loadWeather(SHOW_SUNRISE);
setInterval(loadWeather, 5 * 60 * 1000);
