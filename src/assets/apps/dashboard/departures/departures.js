
import { formatTime, getTodayISO, getTomorrowISO } from './../../_shared/time/time.js';



async function fetchDeparturesForDay(stopId, dateISO) {
    const url = `https://v6.vbb.transport.rest/stops/${stopId}/departures?duration=1440&date=${dateISO}&results=100`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data)
    return data.departures || [];
  }
export async function loadDepartures(stopId) {
    console.log('load deps');
    const monitor = document.getElementById('monitor');
    monitor.innerHTML = '⏳ Lade Abfahrten...';
    const apiResponse = await fetch('/api/dashboard.json')
    console.log(apiResponse)
    console.log(await apiResponse.json())
  
    try {
      const todayDeps = await fetchDeparturesForDay(stopId, getTodayISO());
      const tomorrowDeps = await fetchDeparturesForDay(stopId, getTomorrowISO());
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
  
        // Zeitberechnung für Anmeldung
        const deadline = planned.getTime() - 60 * 60 * 1000; // 60 Minuten vor Abfahrt
        const minutesLeft = Math.floor((deadline - current) / 1000 / 60);
        const hoursLeft = Math.floor(minutesLeft / 60);
        const timeLeftDisplay = minutesLeft > 60
          ? `noch <strong>${hoursLeft}h ${minutesLeft - hoursLeft * 60} Min</strong> Zeit für Anmeldung`
          : minutesLeft > 0
          ? `noch <strong>${minutesLeft} Min</strong> Zeit für Anmeldung`
          : "keine Anmeldung mehr möglich";
  
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
            <br />📞 Anmeldungspflicht${hotlineText}
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