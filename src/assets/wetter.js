async function ladeWetter() {
    const lat = 53.0518;
    const lon = 11.7682;
  
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&timezone=auto`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    const zeiten = data.hourly.time;
    const temps = data.hourly.temperature_2m;
    const codes = data.hourly.weathercode;
  
    const wetterCodes = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
      51: "🌦️", 53: "🌧️", 55: "🌧️", 61: "🌦️", 63: "🌧️", 65: "🌧️",
      71: "🌨️", 73: "🌨️", 75: "❄️", 80: "🌦️", 81: "🌧️", 82: "🌧️",
      95: "⛈️", 96: "⛈️", 99: "⛈️"
    };
  
    const zielStunden = ["04:00", "10:00", "16:00"];
    const tbody = document.querySelector("#wetter tbody");
    tbody.innerHTML = "";
  
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
  
    // Hilfsfunktion: Suche nach erstem passenden Zeitwert
    function findeWertFuerUhrzeit(datumISO, zielzeit) {
      const [zielStunde, zielMinute] = zielzeit.split(":").map(Number);
      const startZeit = new Date(`${datumISO}T${zielzeit}`);
  
      for (let offset = 0; offset <= 3; offset++) {
        const versuch = new Date(startZeit.getTime() + offset * 60 * 60 * 1000); // +1h Schritte
        const versuchISO = versuch.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  
        const index = zeiten.findIndex(z => z.startsWith(versuchISO));
        if (index !== -1) {
          const emoji = wetterCodes[codes[index]] || "❓";
          const temp = Math.round(temps[index]);
          return `${emoji} ${temp}°C`;
        }
      }
      return "<span class='text-muted'>–</span>";
    }
  
    for (let tagOffset = 0; tagOffset < 3; tagOffset++) {
      const datum = new Date(heute);
      datum.setDate(heute.getDate() + tagOffset);
      const isoDate = datum.toISOString().split("T")[0];
      const tagName = datum.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
  
      const tagesWerte = zielStunden.map(zeit => findeWertFuerUhrzeit(isoDate, zeit));
  
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-start"><strong>${tagName}</strong></td>
        <td>${tagesWerte[0]}</td>
        <td>${tagesWerte[1]}</td>
        <td>${tagesWerte[2]}</td>
      `;
      tbody.appendChild(tr);
    }
  
    const stand = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    document.getElementById("stand").innerText = `Stand: ${stand}`;
  }
  
  ladeWetter();
  setInterval(ladeWetter, 5 * 60 * 1000);