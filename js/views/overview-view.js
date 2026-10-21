/* ==========================================================================
   VIEW: OVERVIEW - F1 SEASON COMMAND DASHBOARD
   Matches reference visual direction:
   Row 1: Next GP Hero banner (Singapore night background + Next session box)
   Row 2 (3 Columns): Driver Championship (Top 5) | Constructor Championship (Top 5) | Circuit Info (3 sectors SVG + stats)
   Row 3 (2 Columns): Left (Live Timing + Recent Race) | Right (Weather + Session Schedule + Progression)
   ========================================================================== */

import { dataService } from '../services/data-service.js';
import { initHeaderCountdown } from '../components/race-control-header.js';

function getTeamIconSvg(teamName) {
  const t = (teamName || '').toLowerCase();
  if (t.includes('red bull')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1e41ff"/><circle cx="12" cy="12" r="6" fill="#e10600"/><circle cx="12" cy="12" r="3" fill="#fadb14"/></svg>`;
  } else if (t.includes('mclaren')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24"><path d="M4 17C10 7 19 6 20 6C18 10 13 14 4 17Z" fill="#ff8000"/></svg>`;
  } else if (t.includes('ferrari')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24"><path d="M12 2L5 5v7c0 5 4 8 7 10 3-2 7-5 7-10V5l-7-3z" fill="#fadb14"/><circle cx="12" cy="11" r="3" fill="#000"/></svg>`;
  } else if (t.includes('mercedes')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#00d2be" stroke-width="1.8" fill="none"/><line x1="12" y1="3" x2="12" y2="12" stroke="#00d2be" stroke-width="1.8"/><line x1="12" y1="12" x2="4.2" y2="16.5" stroke="#00d2be" stroke-width="1.8"/><line x1="12" y1="12" x2="19.8" y2="16.5" stroke="#00d2be" stroke-width="1.8"/></svg>`;
  } else if (t.includes('aston')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24"><path d="M2 13c5-3 15-3 20 0-4-3-16-3-20 0z" fill="#229971"/><path d="M6 15c4-2 8-2 12 0-3-2-9-2-12 0z" fill="#cedc00"/></svg>`;
  }
  return `<span class="team-stripe" style="background-color: var(--f1-red);"></span>`;
}

const singaporeFlagSvg = `<svg width="16" height="11" viewBox="0 0 30 20" style="border-radius: 1px; display: inline-block; vertical-align: middle;"><rect width="30" height="10" fill="#ed2939"/><rect y="10" width="30" height="10" fill="#ffffff"/><circle cx="6" cy="5" r="3.2" fill="#ffffff"/><circle cx="7.2" cy="5" r="3" fill="#ed2939"/></svg>`;

export async function renderOverviewView() {
  const nextGp = await dataService.getNextGrandPrix();
  const drivers = await dataService.getDrivers();
  const constructors = await dataService.getConstructors();
  const liveSession = await dataService.getLiveSessionState();
  const liveFeed = await dataService.getLiveTimingFeed();
  const recentRace = await dataService.getRecentRace();

  // 1. DRIVER CHAMPIONSHIP ROWS (Top 5)
  const driverRows = [
    { pos: '01', name: 'Max Verstappen', team: 'Red Bull', pts: 312, w: 8, pod: 14, delta: '-' },
    { pos: '02', name: 'Lando Norris', team: 'McLaren', pts: 298, w: 6, pod: 12, delta: '<span class="delta-green">▲ +1</span>' },
    { pos: '03', name: 'Charles Leclerc', team: 'Ferrari', pts: 275, w: 5, pod: 11, delta: '<span class="delta-red">▼ -1</span>' },
    { pos: '04', name: 'Oscar Piastri', team: 'McLaren', pts: 248, w: 4, pod: 9, delta: '-' },
    { pos: '05', name: 'Lewis Hamilton', team: 'Mercedes', pts: 232, w: 4, pod: 10, delta: '<span class="delta-green">▲ +2</span>' },
  ];

  const driverRowsHtml = driverRows.map(d => `
    <tr>
      <td class="pos-cell"><span class="pos-num-text">${d.pos}</span></td>
      <td style="font-weight: 600; color: var(--text-primary);">${d.name}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 5px;">
          ${getTeamIconSvg(d.team)}
          <span class="text-secondary" style="font-size: 11px;">${d.team}</span>
        </div>
      </td>
      <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${d.pts}</td>
      <td class="text-center font-mono text-muted">${d.w}</td>
      <td class="text-center font-mono text-muted">${d.pod}</td>
      <td class="text-center">${d.delta}</td>
    </tr>
  `).join('');

  // 2. CONSTRUCTOR CHAMPIONSHIP ROWS (Top 5)
  const constructorRows = [
    { pos: '01', team: 'Red Bull', pts: 498, w: 9, pod: 18, last: '1st', delta: '-' },
    { pos: '02', team: 'McLaren', pts: 452, w: 10, pod: 16, last: '2nd', delta: '-' },
    { pos: '03', team: 'Ferrari', pts: 420, w: 6, pod: 14, last: '3rd', delta: '-' },
    { pos: '04', team: 'Mercedes', pts: 356, w: 4, pod: 13, last: '5th', delta: '<span class="delta-green">▲ +1</span>' },
    { pos: '05', team: 'Aston Martin', pts: 198, w: 1, pod: 6, last: '7th', delta: '<span class="delta-red">▼ -1</span>' },
  ];

  const constructorRowsHtml = constructorRows.map(c => `
    <tr>
      <td class="pos-cell"><span class="pos-num-text">${c.pos}</span></td>
      <td>
        <div style="display: flex; align-items: center; gap: 5px;">
          ${getTeamIconSvg(c.team)}
          <span style="font-weight: 600; color: var(--text-primary);">${c.team}</span>
        </div>
      </td>
      <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${c.pts}</td>
      <td class="text-center font-mono text-muted">${c.w}</td>
      <td class="text-center font-mono text-muted">${c.pod}</td>
      <td class="text-center font-mono" style="font-size: 11px; color: var(--text-secondary);">${c.last}</td>
      <td class="text-center">${c.delta}</td>
    </tr>
  `).join('');

  // 3. LIVE TIMING ROWS (Top 5)
  const timingFeed = [
    { pos: 1, code: 'VER', team: 'Red Bull', lap: 28, time: '1:31.204', gap: '—', s1: '27.1', s1Status: 'best-personal', s2: '33.4', s2Status: 'best-personal', s3: '30.6', s3Status: 'best-personal', tyre: 'M', tyreColor: '#facc15' },
    { pos: 2, code: 'NOR', team: 'McLaren', lap: 28, time: '1:31.482', gap: '+0.278', s1: '27.2', s1Status: 'best-sector', s2: '33.5', s2Status: 'best-personal', s3: '30.7', s3Status: 'best-sector', tyre: 'M', tyreColor: '#facc15' },
    { pos: 3, code: 'LEC', team: 'Ferrari', lap: 28, time: '1:31.621', gap: '+0.417', s1: '27.3', s1Status: 'normal', s2: '33.6', s2Status: 'normal', s3: '30.6', s3Status: 'best-personal', tyre: 'S', tyreColor: '#f87171' },
    { pos: 4, code: 'PIA', team: 'McLaren', lap: 28, time: '1:31.703', gap: '+0.499', s1: '27.4', s1Status: 'normal', s2: '33.6', s2Status: 'normal', s3: '30.7', s3Status: 'normal', tyre: 'M', tyreColor: '#facc15' },
    { pos: 5, code: 'HAM', team: 'Mercedes', lap: 28, time: '1:31.921', gap: '+0.717', s1: '27.5', s1Status: 'normal', s2: '33.8', s2Status: 'normal', s3: '30.9', s3Status: 'normal', tyre: 'S', tyreColor: '#f87171' },
  ];

  const timingRowsHtml = timingFeed.map(t => `
    <tr>
      <td class="pos-cell font-mono text-center" style="font-weight: 700;">${t.pos}</td>
      <td style="font-weight: 700; color: var(--text-primary); font-family: var(--font-mono);">${t.code}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 5px;">
          ${getTeamIconSvg(t.team)}
          <span class="text-secondary" style="font-size: 11px;">${t.team}</span>
        </div>
      </td>
      <td class="font-mono text-center text-muted">${t.lap}</td>
      <td class="font-mono" style="font-weight: 700; color: var(--text-primary);">${t.time}</td>
      <td class="font-mono text-muted">${t.gap}</td>
      <td class="font-mono text-center"><span class="sector-chip ${t.s1Status}">${t.s1}</span></td>
      <td class="font-mono text-center"><span class="sector-chip ${t.s2Status}">${t.s2}</span></td>
      <td class="font-mono text-center"><span class="sector-chip ${t.s3Status}">${t.s3}</span></td>
      <td class="text-center">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; border-radius: 50%; border: 1.5px solid ${t.tyreColor}; color: ${t.tyreColor}; font-size: 9px; font-weight: 800; font-family: var(--font-mono);">
          ${t.tyre}
        </span>
      </td>
    </tr>
  `).join('');

  return `
    <div class="overview-dashboard">
      
      <!-- ========================================================
           ROW 1: NEXT GRAND PRIX HERO BANNER (SINGAPORE ANCHOR)
           ======================================================== -->
      <section class="overview-hero-card" aria-label="Next Grand Prix Anchor">
        <div class="hero-left-content">
          <div class="hero-round-label">ROUND 18 / 24</div>
          <h1 class="hero-title-main">SINGAPORE GRAND PRIX</h1>
          <div class="hero-circuit-row">
            ${singaporeFlagSvg}
            <span>MARINA BAY STREET CIRCUIT</span>
          </div>
          <div class="hero-badges-row">
            <span class="hero-pill-date">03 - 05 OCT 2026</span>
            <a href="#circuits" class="hero-pill-link">
              <span>SINGAPORE</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <div class="hero-session-box">
          <span class="hero-session-kicker">NEXT SESSION</span>
          <span class="hero-session-title">QUALIFYING</span>
          
          <div class="hero-countdown-container">
            <div class="hero-countdown-digits-row">
              <span id="header-countdown-d">01</span>
              <span class="hero-countdown-colon">:</span>
              <span id="header-countdown-m">42</span>
              <span class="hero-countdown-colon">:</span>
              <span id="header-countdown-s">18</span>
            </div>
            <div class="hero-countdown-units-row">
              <span>DAYS</span>
              <span>MINS</span>
              <span>SECS</span>
            </div>
          </div>

          <span class="hero-session-timestamp">SAT 04 OCT · 19:00 (SGT)</span>
        </div>
      </section>

      <!-- ========================================================
           ROW 2: 3 COLUMNS TRIPLET (DRIVERS, CONSTRUCTORS, CIRCUIT)
           ======================================================== -->
      <section class="overview-row-triplet" aria-label="Championship and Circuit Core">
        
        <!-- COLUMN 1: DRIVER CHAMPIONSHIP -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">DRIVER CHAMPIONSHIP</span>
            <span class="panel-badge">TOP 5</span>
          </div>
          <div class="panel-body no-padding">
            <div class="table-responsive">
              <table class="data-table" style="font-size: 11px;">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 28px;">POS</th>
                    <th>DRIVER</th>
                    <th>TEAM</th>
                    <th class="text-right">PTS</th>
                    <th class="text-center" style="width: 24px;">W</th>
                    <th class="text-center" style="width: 28px;">POD</th>
                    <th class="text-center" style="width: 38px;">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  ${driverRowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- COLUMN 2: CONSTRUCTOR CHAMPIONSHIP -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">CONSTRUCTOR CHAMPIONSHIP</span>
            <span class="panel-badge">TOP 5</span>
          </div>
          <div class="panel-body no-padding">
            <div class="table-responsive">
              <table class="data-table" style="font-size: 11px;">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 28px;">POS</th>
                    <th>CONSTRUCTOR</th>
                    <th class="text-right">PTS</th>
                    <th class="text-center" style="width: 24px;">W</th>
                    <th class="text-center" style="width: 28px;">POD</th>
                    <th class="text-center">LAST</th>
                    <th class="text-center" style="width: 38px;">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  ${constructorRowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- COLUMN 3: CIRCUIT INFO -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">CIRCUIT INFO</span>
            <a href="#circuits" class="panel-action-link" style="text-decoration: none; font-size: 11px; color: var(--text-muted); font-weight: 600;">
              View Circuit →
            </a>
          </div>
          
          <div class="panel-body" style="padding: var(--space-2) var(--space-3); display: flex; flex-direction: column; gap: var(--space-2);">
            <!-- Vector track SVG with 3 sectors -->
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 4px; display: flex; align-items: center; justify-content: center;">
              <svg viewBox="0 0 380 180" style="width: 100%; height: 115px; display: block;">
                <!-- S1: Turn 1 to 5 (Red/Coral) -->
                <path d="M 60,135 L 42,105 L 50,75 L 80,65 L 110,72 L 135,55" fill="none" stroke="#ff5e57" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- S2: Turn 6 to 14 (Electric Blue) -->
                <path d="M 135,55 L 175,30 L 215,40 L 260,60 L 295,55 L 335,62 L 350,80 L 350,110" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- S3: Turn 15 to 19 (Gold/Amber) -->
                <path d="M 350,110 L 355,140 L 338,155 L 305,145 L 275,110 L 245,120 L 215,115 L 175,145 L 125,130 L 60,135" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Sector Labels -->
                <text x="32" y="90" fill="#ff5e57" font-family="var(--font-mono)" font-size="11" font-weight="800">S1</text>
                <text x="250" y="48" fill="#38bdf8" font-family="var(--font-mono)" font-size="11" font-weight="800">S2</text>
                <text x="355" y="135" fill="#f59e0b" font-family="var(--font-mono)" font-size="11" font-weight="800">S3</text>
              </svg>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
              <span style="font-weight: 700; font-size: 12px; color: var(--text-primary); text-transform: uppercase;">MARINA BAY STREET CIRCUIT</span>
              <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary);">
                ${singaporeFlagSvg}
                <span>SINGAPORE</span>
              </span>
            </div>
          </div>

          <div class="circuit-stats-quad">
            <div class="stat-quad-item">
              <span class="stat-quad-label">LENGTH</span>
              <span class="stat-quad-value">5.063 km</span>
            </div>
            <div class="stat-quad-item">
              <span class="stat-quad-label">CORNERS</span>
              <span class="stat-quad-value">23</span>
            </div>
            <div class="stat-quad-item">
              <span class="stat-quad-label">LAPS</span>
              <span class="stat-quad-value">62</span>
            </div>
            <div class="stat-quad-item">
              <span class="stat-quad-label">RACE DISTANCE</span>
              <span class="stat-quad-value">314.9 km</span>
            </div>
          </div>
        </div>

      </section>

      <!-- ========================================================
           ROW 3: 2 UNEQUAL COLUMNS SPLIT (WIDE LEFT + COMPACT RIGHT)
           ======================================================== -->
      <section class="overview-row-split" aria-label="Live Operations and Analytical Overview">
        
        <!-- LEFT COLUMN: LIVE TIMING + RECENT RACE -->
        <div class="overview-col-left">
          
          <!-- Card 1: Live Timing -->
          <div class="panel">
            <div class="panel-header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="live-pulse-dot" style="margin: 0;"></span>
                <span style="font-weight: 800; font-size: 11px; letter-spacing: 0.06em; color: var(--text-primary);">LIVE TIMING</span>
                <span class="badge-tag f1-red" style="padding: 1px 6px; font-size: 9px; font-weight: 800;">● LIVE</span>
                <span class="badge-tag" style="padding: 1px 6px; font-size: 9px;">PRACTICE 3</span>
              </div>
              <span class="font-mono text-muted" style="font-size: 11px;">LAP 28 / 62</span>
            </div>

            <div class="panel-body no-padding">
              <div class="table-responsive">
                <table class="data-table" style="font-size: 11px;">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 28px;">POS</th>
                      <th>DRIVER</th>
                      <th>TEAM</th>
                      <th class="text-center" style="width: 32px;">LAP</th>
                      <th>TIME</th>
                      <th>GAP</th>
                      <th class="text-center">S1</th>
                      <th class="text-center">S2</th>
                      <th class="text-center">S3</th>
                      <th class="text-center">TYRE</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${timingRowsHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Card 2: Recent Race (Italian Grand Prix) -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">RECENT RACE</span>
              <span class="font-mono text-muted" style="font-size: 11px; text-transform: uppercase;">ITALIAN GRAND PRIX</span>
            </div>

            <div class="recent-race-card-body">
              <div class="recent-race-columns">
                <!-- Winner segment -->
                <div class="winner-profile-segment">
                  <div class="winner-avatar-frame">
                    <svg viewBox="0 0 40 40" width="38" height="38" fill="none">
                      <circle cx="20" cy="20" r="18" fill="#171b22" stroke="var(--border-default)"/>
                      <path d="M10 30 C10 23, 14 19, 20 19 C26 19, 30 23, 30 30 Z" fill="#e10600"/>
                      <circle cx="20" cy="14" r="6" fill="#e5e7eb"/>
                      <rect x="14" y="16" width="12" height="4" rx="2" fill="#11141a"/>
                    </svg>
                  </div>
                  <div>
                    <div class="technical-label" style="font-size: 9px; margin-bottom: 2px;">RACE WINNER</div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      ${getTeamIconSvg('Red Bull')}
                      <span style="font-weight: 800; font-size: 13px; color: var(--text-primary);">MAX VERSTAPPEN</span>
                    </div>
                    <div class="text-muted font-mono" style="font-size: 10px; margin-left: 20px;">RED BULL</div>
                  </div>
                </div>

                <!-- P2 & P3 podium finishers -->
                <div class="podium-finishers-segment">
                  <div class="podium-finisher-row">
                    <span class="podium-chip-num p2">2</span>
                    ${getTeamIconSvg('McLaren')}
                    <span style="font-weight: 600; color: var(--text-primary);">Lando Norris</span>
                    <span class="font-mono text-muted" style="margin-left: auto;">+2.341</span>
                  </div>
                  <div class="podium-finisher-row">
                    <span class="podium-chip-num p3">3</span>
                    ${getTeamIconSvg('Ferrari')}
                    <span style="font-weight: 600; color: var(--text-primary);">Charles Leclerc</span>
                    <span class="font-mono text-muted" style="margin-left: auto;">+6.827</span>
                  </div>
                </div>
              </div>

              <!-- Footer stat bar -->
              <div class="recent-race-footer-bar font-mono">
                <div>
                  <span class="text-muted" style="font-size: 10px;">FASTEST LAP:</span>
                  <span style="font-weight: 700; color: var(--text-primary); margin-left: 4px;">1:28.441</span>
                  <span class="text-muted" style="font-size: 10px; margin-left: 4px;">Lando Norris</span>
                </div>
                <div>
                  <span class="text-muted" style="font-size: 10px;">POINTS LEADER:</span>
                  <span style="font-weight: 700; color: var(--text-primary); margin-left: 4px;">312 PTS</span>
                  <span class="text-muted" style="font-size: 10px; margin-left: 4px;">Max Verstappen</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: WEATHER + SCHEDULE + PROGRESSION -->
        <div class="overview-col-right">
          
          <!-- Card 1: Weather -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">WEATHER</span>
              <span class="badge-tag status-green" style="font-size: 9px;">● LIVE</span>
            </div>
            <div class="weather-panel-content">
              <div class="weather-top-metric-row">
                <div class="weather-icon-symbol">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-mono" style="font-size: 19px; font-weight: 800; color: var(--text-primary); line-height: 1;">28°C</div>
                  <div class="technical-label" style="font-size: 9px; margin-top: 2px;">AIR TEMP</div>
                </div>
                <div style="margin-left: var(--space-4);">
                  <div class="font-mono" style="font-size: 19px; font-weight: 800; color: var(--text-primary); line-height: 1;">31°C</div>
                  <div class="technical-label" style="font-size: 9px; margin-top: 2px;">TRACK TEMP</div>
                </div>
              </div>

              <div class="weather-bottom-metric-row">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary);">10%</span>
                  <span class="text-muted" style="font-size: 9px;">RAIN PROB.</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary);">2.1 m/s</span>
                  <span class="text-muted" style="font-size: 9px;">WIND (NW)</span>
                </div>
                <div>
                  <span style="font-weight: 700; color: var(--text-primary);">Clear</span>
                  <span class="text-muted" style="font-size: 9px; margin-left: 2px;">CONDITIONS</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Session Schedule -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">SESSION SCHEDULE</span>
              <span class="font-mono text-muted" style="font-size: 11px;">SAT 04 OCT</span>
            </div>
            <div class="schedule-clean-list">
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">P1</span>
                <span class="font-mono text-muted" style="font-size: 11px;">12:30 - 13:30</span>
                <span class="schedule-status-done">✓ COMPLETED</span>
              </div>
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">P2</span>
                <span class="font-mono text-muted" style="font-size: 11px;">16:00 - 17:00</span>
                <span class="schedule-status-done">✓ COMPLETED</span>
              </div>
              <div class="schedule-clean-row live">
                <span class="schedule-clean-session">P3</span>
                <span class="font-mono text-muted" style="font-size: 11px;">12:30 - 13:30</span>
                <span class="schedule-status-live">● LIVE NOW</span>
              </div>
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">Qualifying</span>
                <span class="font-mono text-muted" style="font-size: 11px;">19:00 - 20:00</span>
                <span class="schedule-status-upcoming">UPCOMING</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Championship Progression -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">CHAMPIONSHIP PROGRESSION</span>
              <span class="font-mono text-muted" style="font-size: 11px;">AFTER ROUND 17</span>
            </div>
            <div class="progression-split-content">
              <!-- Progression Line Chart -->
              <div style="height: 125px; width: 100%; position: relative;">
                <svg viewBox="0 0 240 120" style="width: 100%; height: 100%; display: block;">
                  <!-- Grid lines -->
                  <line x1="25" y1="15" x2="235" y2="15" stroke="var(--border-subtle)" stroke-dasharray="2 2"/>
                  <line x1="25" y1="42" x2="235" y2="42" stroke="var(--border-subtle)" stroke-dasharray="2 2"/>
                  <line x1="25" y1="69" x2="235" y2="69" stroke="var(--border-subtle)" stroke-dasharray="2 2"/>
                  <line x1="25" y1="96" x2="235" y2="96" stroke="var(--border-subtle)"/>

                  <!-- Y-Axis labels -->
                  <text x="20" y="18" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">400</text>
                  <text x="20" y="45" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">300</text>
                  <text x="20" y="72" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">200</text>
                  <text x="20" y="99" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">100</text>
                  <text x="20" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">0</text>

                  <!-- X-Axis labels -->
                  <text x="25" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">1</text>
                  <text x="75" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">8</text>
                  <text x="125" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">12</text>
                  <text x="175" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">16</text>
                  <text x="225" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">24</text>

                  <!-- Plotted Lines -->
                  <!-- VER (Blue) -->
                  <path d="M 25,100 L 60,88 L 100,72 L 140,55 L 180,36 L 230,22" fill="none" stroke="#1e41ff" stroke-width="1.8" stroke-linecap="round"/>
                  <!-- NOR (Orange) -->
                  <path d="M 25,102 L 60,92 L 100,78 L 140,62 L 180,44 L 230,26" fill="none" stroke="#ff8000" stroke-width="1.8" stroke-linecap="round"/>
                  <!-- LEC (Red) -->
                  <path d="M 25,101 L 60,90 L 100,82 L 140,70 L 180,54 L 230,34" fill="none" stroke="#e10600" stroke-width="1.8" stroke-linecap="round"/>
                  <!-- PIA (Orange Dashed) -->
                  <path d="M 25,103 L 60,95 L 100,86 L 140,76 L 180,62 L 230,42" fill="none" stroke="#ff8000" stroke-width="1.6" stroke-dasharray="3 2" stroke-linecap="round"/>
                  <!-- HAM (Teal) -->
                  <path d="M 25,103 L 60,96 L 100,88 L 140,80 L 180,68 L 230,48" fill="none" stroke="#00d2be" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>

              <!-- Legend / Scores -->
              <div class="progression-scores-list">
                <div class="progression-driver-score">
                  <span class="prog-color-box" style="background: #1e41ff;"></span>
                  <span>VER</span>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary); margin-left: auto;">312</span>
                </div>
                <div class="progression-driver-score">
                  <span class="prog-color-box" style="background: #ff8000;"></span>
                  <span>NOR</span>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary); margin-left: auto;">298</span>
                </div>
                <div class="progression-driver-score">
                  <span class="prog-color-box" style="background: #e10600;"></span>
                  <span>LEC</span>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary); margin-left: auto;">275</span>
                </div>
                <div class="progression-driver-score">
                  <span class="prog-color-box dashed" style="background: #ff8000;"></span>
                  <span>PIA</span>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary); margin-left: auto;">248</span>
                </div>
                <div class="progression-driver-score">
                  <span class="prog-color-box" style="background: #00d2be;"></span>
                  <span>HAM</span>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary); margin-left: auto;">232</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

    </div>
  `;
}
