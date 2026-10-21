/* ==========================================================================
   COMPONENT: RACE CONTROL HEADER
   Strict adherence to Section 5 of design.txt
   ========================================================================== */

export function renderRaceControlHeader(nextGpData) {
  const round = nextGpData.round;
  const circuit = nextGpData.circuit;

  return `
    <header class="race-control-header" id="race-control-header">
      <div class="rc-event-info">
        <div class="rc-kicker">
          <span class="live-pulse-dot"></span>
          NEXT GRAND PRIX
          <span class="rc-round-badge">· ROUND ${round.round} / 24</span>
        </div>
        <h1 class="rc-grand-prix-name">${round.grandPrix.toUpperCase()}</h1>
        <div class="rc-circuit-location">
          <span>${circuit.name}</span>
          <span class="text-muted">·</span>
          <span>${circuit.country}</span>
          <span class="text-muted">·</span>
          <span class="font-mono text-muted">${circuit.lengthKm}</span>
        </div>
      </div>

      <div class="rc-session-box">
        <div class="rc-session-label">NEXT SESSION</div>
        <div class="rc-session-name">QUALIFYING</div>
        <div class="rc-session-schedule">SAT 10 OCT · 18:00 UTC</div>
      </div>

      <div class="rc-countdown-box">
        <div class="rc-countdown-label">SESSION STARTS IN</div>
        <div class="rc-countdown-digits" id="header-countdown">01 : 42 : 18</div>
        <div class="technical-subtext">LOCAL: 21:00 SGT</div>
      </div>
    </header>
  `;
}

// Countdown timer ticker
export function initHeaderCountdown() {
  let totalSeconds = 1 * 3600 + 42 * 60 + 18;
  const countdownEl = document.getElementById('header-countdown');
  
  if (!countdownEl) return null;

  const interval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(totalSeconds % 60).padStart(2, '0');
      countdownEl.textContent = `${hrs} : ${mins} : ${secs}`;
    }
  }, 1000);

  return interval;
}
