const stopId = "900222106"; // Klein Glien laut deinen Beispieldaten
    const updateInterval = 60; // Sekunden
    let countdown = updateInterval;

    function updateClock() {
      const now = new Date();
      const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      document.getElementById('clock').textContent = `🕒 Uhrzeit: ${time}`;
    }

    function formatTime(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    }

    function getTodayISO() {
      return new Date().toISOString().split("T")[0];
    }

    function getTomorrowISO() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }

    async function fetchDeparturesForDay(dateISO) {
      const url = `https://v6.vbb.transport.rest/stops/${stopId}/departures?duration=1440&date=${dateISO}&results=100`;
      const res = await fetch(url);
      const data = await res.json();
      return data.departures || [];
    }

    async function loadDepartures() {
      const monitor = document.getElementById('monitor');
      monitor.innerHTML = '⏳ Lade Abfahrten...';

      try {
        const today = getTodayISO();
        const tomorrow = getTomorrowISO();

        const todayDeps = await fetchDeparturesForDay(today);
        const tomorrowDeps = await fetchDeparturesForDay(tomorrow);

        const firstTomorrow = tomorrowDeps.length ? [tomorrowDeps[0]] : [];

        const departures = [...todayDeps, ...firstTomorrow];

        if (!departures.length) {
          monitor.innerHTML = '<em>Keine Abfahrten gefunden.</em>';
          return;
        }

        monitor.innerHTML = '';
        departures.forEach(dep => {
          const line = dep.line?.name ?? "??";
          const dir = dep.direction ?? "Ziel unbekannt";
          const planned = dep.plannedWhen;
          const actual = dep.when;
          const delay = dep.delay || 0;
          const remarks = dep.remarks?.map(r => r.text).join(" ") ?? "";
          const isBuergerbus = remarks.toLowerCase().includes("bürgerbus") || remarks.toLowerCase().includes("telefonische anmeldung");

          const div = document.createElement('div');
          div.className = 'departure' + (isBuergerbus ? ' buergerbus' : '');

          const icon = document.createElement('img');
          icon.className = 'icon';
          icon.src = isBuergerbus ? '/assets/bus-bürger.svg' : '/assets/bus-standard.svg';
          icon.alt = isBuergerbus ? 'Bürgerbus' : 'Bus';

          const info = document.createElement('div');
          info.className = 'info';
          info.innerHTML = `
            <strong>Linie ${line}</strong> nach <strong>${dir}</strong><br>
            🕒 Plan: ${formatTime(planned)} | Echt: ${formatTime(actual)} 
            ${delay > 0 ? `<span style="color:red;">(+${delay/60} Min)</span>` : ""}
            ${isBuergerbus ? '<br><em>📞 Bürgerbus – bitte anmelden</em>' : ''}
          `;

          div.appendChild(icon);
          div.appendChild(info);
          monitor.appendChild(div);
        });

      } catch (error) {
        monitor.innerHTML = `<strong>❌ Fehler:</strong> ${error.message}`;
        console.error(error);
      }
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

   

   // alternative to DOMContentLoaded
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
      // Initialize your application or run some code.
       // Start
       console.log("Dashboard is ready");
    updateClock();
    startCountdown();
    loadDepartures();
  }
}