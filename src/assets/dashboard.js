const stopId = "900222106"; // Klein Glien laut deinen Beispieldaten
const updateInterval = 60; // Sekunden
let countdown = updateInterval;

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('clock').textContent = `🕒 Uhrzeit: ${time}`;
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
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
    const todayDeps = await fetchDeparturesForDay(getTodayISO());
    const tomorrowDeps = await fetchDeparturesForDay(getTomorrowISO());
    const departures = [...todayDeps, ...(tomorrowDeps[0] ? [tomorrowDeps[0]] : [])];

    if (!departures.length) {
      monitor.innerHTML = '<em>Keine Abfahrten gefunden.</em>';
      return;
    }

    monitor.innerHTML = '';
    const current = new Date();

    departures.forEach(dep => {
      const line = dep.line?.name ?? "??";
      const dir = dep.direction ?? "Ziel unbekannt";
      const planned = new Date(dep.plannedWhen);
      const actual = dep.when;
      const delay = dep.delay || 0;
      const remarksText = dep.remarks?.map(r => r.text).join(" ") ?? "";
      const isBuergerbus = /bürgerbus|telefonische anmeldung/i.test(remarksText);

      const div = document.createElement('div');
      div.className = 'departure' + (isBuergerbus ? ' buergerbus' : '');

      const icon = document.createElement('img');
      icon.className = 'icon';
      icon.src = isBuergerbus ? '/assets/bus-bürger.svg' : '/assets/bus-standard.svg';
      icon.alt = isBuergerbus ? 'Bürgerbus' : 'Bus';

      const info = document.createElement('div');
      info.className = 'info';

      // Zeitberechnung für Reservierung
      const deadline = planned.getTime() - 60 * 60 * 1000; // 60 Minuten vor Abfahrt
      const minutesLeft = Math.floor((deadline - current) / 1000 / 60);
      const hoursLeft = Math.floor(minutesLeft / 60);
      const timeLeftDisplay = minutesLeft > 60
        ? `noch <strong>${hoursLeft}h ${minutesLeft - hoursLeft * 60} Min</strong> Zeit für Reservierung`
        : minutesLeft > 0
        ? `noch <strong>${minutesLeft} Min</strong> Zeit für Reservierung`
        : "keine Reservierung mehr möglich";

      const colorTimeLeft = minutesLeft > 120
        ? "green"
        : minutesLeft > 60
        ? "orange"
        : "red";

      const hotlineText = minutesLeft > 60
        ? `: bitte anmelden unter Tel. (033841) 99 400`
        : ``;

      const finalRemarks = `
        ${isBuergerbus ? `
          <br>❤️ Bürgerbus;
          <br />📞 Reservierungspflicht${hotlineText}
          <br />⌛ <em style="color:${colorTimeLeft};">${timeLeftDisplay}</em>
        ` : ""}
      `;
      const delayTime = delay > 0 ? `(+${delay / 60} Min)` : "";
      const delayInfo = delay > 0 ? `<span style="color:red;">${delayTime}</span>` : delay == 0 ? `<span style="color:green;"> </span>` :  `<span style="color:red;">${delayTime}</span>`;

      info.innerHTML = `
        <strong>Linie ${line}</strong> nach <strong>${dir}</strong><br>
        🕒 Plan: ${formatTime(planned)} | Echt: ${formatTime(actual)} <small>${delayInfo}</small>
        <section class="remarks">${finalRemarks}</section>
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

// Alternative zu DOMContentLoaded
document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    console.log("Dashboard is ready");
    updateClock();
    startCountdown();
    loadDepartures();
  }
};
