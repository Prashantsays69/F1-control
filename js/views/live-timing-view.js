/* ==========================================================================
   VIEW: LIVE TIMING & RACE CONTROL CONSOLE
   Full race-control telemetry leaderboard, sector analysis & race control ticker
   ========================================================================== */

import { dataService } from '../services/data-service.js';
import { renderTimingTable } from '../components/timing-table.js';
import { liveSimulation } from '../services/live-simulation-service.js';

export async function renderLiveTimingView() {
  const session = await dataService.getLiveSessionState();
  const feed = await dataService.getLiveTimingFeed();
  const messages = await dataService.getRaceControlMessages();

  const isSimulating = liveSimulation.isRunning;

  return `
    <div class="live-timing-page">
      <!-- Race Control Status Bar -->
      <div class="track-status-bar">
        <div class="track-status-left">
          <span class="status-badge-lg ${session.trackStatus === 'GREEN' ? 'green' : (session.trackStatus === 'YELLOW' ? 'yellow' : (session.trackStatus === 'SC' ? 'sc' : 'red'))}" id="live-flag-badge">
            ● TRACK ${session.trackStatus}
          </span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 700; color: var(--text-primary); text-transform: uppercase;">
              ${session.sessionName}
            </span>
            <span class="text-muted">·</span>
            <span class="font-mono text-muted">LAP ${session.currentLap} / ${session.totalLaps}</span>
            <span class="text-muted">·</span>
            <span class="font-mono" style="color: var(--f1-red); font-weight: 700;">REMAINING ${session.remainingTime}</span>
          </div>
        </div>

        <div class="live-control-toggles">
          <!-- Simulation Flag Test Controls -->
          <span class="technical-label" style="margin-right: 4px;">TEST FLAG:</span>
          <button class="topbar-action-btn" id="btn-flag-green" title="Set Green Flag">GREEN</button>
          <button class="topbar-action-btn" id="btn-flag-yellow" title="Set Yellow Flag">YELLOW</button>
          <button class="topbar-action-btn" id="btn-flag-sc" title="Deploy Safety Car">SC</button>
          <button class="topbar-action-btn" id="btn-flag-red" title="Red Flag Session">RED</button>
          
          <div class="topbar-divider"></div>

          <button class="topbar-action-btn ${isSimulating ? 'active' : ''}" id="btn-toggle-simulation">
            <span class="live-pulse-dot ${isSimulating ? 'green' : ''}"></span>
            <span id="sim-btn-label">${isSimulating ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}</span>
          </button>
        </div>
      </div>

      <!-- Race Control Message Feed Ticker -->
      <div class="ticker-box">
        <span class="ticker-time">FIA RACE CONTROL</span>
        <span class="text-muted">|</span>
        <span class="ticker-msg" id="live-ticker-msg">
          ${messages[0] ? `[${messages[0].time}] ${messages[0].text}` : 'NO ACTIVE INCIDENTS'}
        </span>
      </div>

      <!-- Leaderboard Filter Tabs -->
      <div class="filter-bar" style="margin-bottom: var(--space-3);">
        <div class="filter-btn-group" id="live-timing-filter-group">
          <button class="filter-btn active" data-filter="all">ALL CARS (20)</button>
          <button class="filter-btn" data-filter="top10">TOP 10</button>
          <button class="filter-btn" data-filter="purple">PURPLE SECTORS</button>
          <button class="filter-btn" data-filter="pits">PIT LANE</button>
        </div>
        <div class="font-mono text-muted" style="font-size: 11px;">REPLAY / LOCAL SIMULATION FEED · 10 HZ</div>
      </div>

      <!-- Main Telemetry Leaderboard Panel -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="technical-label">LIVE TIMING LEADERBOARD</span>
            <span class="panel-badge">PRACTICE 3 SIMULATION</span>
          </div>
          <div style="display: flex; gap: 16px; font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">
            <span>SECTOR PURPLE: FASTEST OVERALL</span>
            <span>SECTOR GREEN: PERSONAL BEST</span>
            <span>SECTOR YELLOW: NO IMPROVEMENT</span>
          </div>
        </div>

        <div class="panel-body no-padding" id="live-timing-table-wrapper">
          ${renderTimingTable(feed, false)}
        </div>
      </div>
    </div>
  `;
}

// Bind live interactive listeners for live timing view
export function bindLiveTimingEvents() {
  const toggleBtn = document.getElementById('btn-toggle-simulation');
  const simLabel = document.getElementById('sim-btn-label');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const running = liveSimulation.toggle();
      if (running) {
        toggleBtn.classList.add('active');
        if (simLabel) simLabel.textContent = 'SIMULATION RUNNING';
      } else {
        toggleBtn.classList.remove('active');
        if (simLabel) simLabel.textContent = 'SIMULATION PAUSED';
      }
    });
  }

  // Filter tabs
  const filterBtns = document.querySelectorAll('#live-timing-filter-group .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const rows = document.querySelectorAll('#timing-table-body tr');
      rows.forEach((row, idx) => {
        if (filter === 'all') {
          row.style.display = '';
        } else if (filter === 'top10') {
          row.style.display = idx < 10 ? '' : 'none';
        } else if (filter === 'purple') {
          const hasPurple = row.querySelector('.sector-chip.best-overall');
          row.style.display = hasPurple ? '' : 'none';
        } else if (filter === 'pits') {
          const isPit = row.classList.contains('in-pit-row') || row.innerText.includes('PIT');
          row.style.display = isPit ? '' : 'none';
        }
      });
    });
  });

  // Flag switchers
  const flagGreen = document.getElementById('btn-flag-green');
  const flagYellow = document.getElementById('btn-flag-yellow');
  const flagSc = document.getElementById('btn-flag-sc');
  const flagRed = document.getElementById('btn-flag-red');
  const flagBadge = document.getElementById('live-flag-badge');

  const setFlag = (status, badgeClass) => {
    liveSimulation.setTrackStatus(status);
    if (flagBadge) {
      flagBadge.className = `status-badge-lg ${badgeClass}`;
      flagBadge.textContent = `● TRACK ${status}`;
    }
  };

  if (flagGreen) flagGreen.addEventListener('click', () => setFlag('GREEN', 'green'));
  if (flagYellow) flagYellow.addEventListener('click', () => setFlag('YELLOW', 'yellow'));
  if (flagSc) flagSc.addEventListener('click', () => setFlag('SC', 'sc'));
  if (flagRed) flagRed.addEventListener('click', () => setFlag('RED', 'red'));
}
