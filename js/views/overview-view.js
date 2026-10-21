/* ==========================================================================
   VIEW: OVERVIEW - F1 SEASON COMMAND DASHBOARD
   Race operations, next Grand Prix dynamic hero, and championship standings
   ========================================================================== */

import { dataService } from '../services/data-service.js';
import { initHeaderCountdown } from '../components/race-control-header.js';

function getTeamIconSvg(teamName) {
  const t = (teamName || '').toLowerCase();
  if (t.includes('mclaren')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="McLaren"><path d="M4.5 17.5C11 7 19.5 6 20.5 6c-2 4-7.5 8.5-16 11.5z" fill="#f47600"/></svg>`;
  } else if (t.includes('ferrari')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Ferrari"><path d="M12 2l-7 3v6.5c0 5 3.5 8.5 7 10.5 3.5-2 7-5.5 7-10.5V5l-7-3z" fill="#fadb14"/><circle cx="12" cy="11.5" r="2.2" fill="#fff"/></svg>`;
  } else if (t.includes('mercedes')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Mercedes"><circle cx="12" cy="12" r="9.5" stroke="#00d7b6" stroke-width="1.8" fill="none"/><path d="M12 2.5v9.5m0 0l-8.2 4.8m8.2-4.8l8.2 4.8" stroke="#00d7b6" stroke-width="1.8"/></svg>`;
  } else if (t.includes('red bull')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Red Bull"><circle cx="12" cy="12" r="10" fill="#1b2444"/><circle cx="12" cy="12" r="4.5" fill="#fadb14"/></svg>`;
  } else if (t.includes('racing bulls') || t.includes('rb')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Racing Bulls"><circle cx="12" cy="12" r="9" fill="#162238" stroke="#6c98ff" stroke-width="1.5"/></svg>`;
  } else if (t.includes('alpine')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Alpine"><path d="M12 3L4 20h3.5l1.8-4h5.4l1.8 4H20L12 3z" fill="#00a1e8"/></svg>`;
  } else if (t.includes('williams')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Williams"><path d="M4 4h3l3.2 12.5L13.5 7h2l3.3 9.5L22 4h-3l-2.2 7.5L14.5 4h-3L9.2 11.5 7 4H4z" fill="#1868db"/></svg>`;
  } else if (t.includes('haas')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Haas"><circle cx="12" cy="12" r="9.5" fill="#1e2023" stroke="#e10600" stroke-width="1.5"/></svg>`;
  } else if (t.includes('audi')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Audi"><circle cx="7" cy="12" r="4.2" stroke="#f50537" stroke-width="1.4" fill="none"/><circle cx="10.3" cy="12" r="4.2" stroke="#f50537" stroke-width="1.4" fill="none"/></svg>`;
  } else if (t.includes('cadillac')) {
    return `<svg class="team-logo-icon" viewBox="0 0 24 24" title="Cadillac"><path d="M4 7h16l-2 5-6 6-6-6L4 7z" fill="#909090" stroke="#fadb14" stroke-width="1"/></svg>`;
  }
  return `<span class="team-stripe" style="background-color: var(--f1-red);"></span>`;
}

export async function renderOverviewView() {
  const nextGp = await dataService.getNextGrandPrix();
  const driverStandings = (await dataService.getDriverStandings()) || [];
  const constructorStandings = (await dataService.getConstructorStandings()) || [];
  const liveFeed = (await dataService.getLiveTimingFeed()) || [];
  const recentRace = await dataService.getRecentRace();
  const calendar = await dataService.getCalendar();

  // 1. DRIVER CHAMPIONSHIP ROWS (Top 5)
  const driverRows = driverStandings.filter(Boolean).slice(0, 5);
  const driverRowsHtml = driverRows.map(d => {
    const driverName = d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Driver';
    const driverTeam = d.team || d.teamName || 'Independent';
    return `
      <tr>
        <td class="pos-cell"><span class="pos-num-text">${String(d.pos).padStart(2, '0')}</span></td>
        <td>
          <a href="#drivers/${d.id || d.driverId || ''}" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit;">
            <span style="font-weight: 600; color: var(--text-primary);">${driverName}</span>
          </a>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 5px;">
            ${getTeamIconSvg(driverTeam)}
            <span class="text-secondary" style="font-size: 11px;">${driverTeam}</span>
          </div>
        </td>
        <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${d.points ?? d.pts ?? 0}</td>
        <td class="text-center font-mono text-muted">${d.wins ?? d.w ?? 0}</td>
        <td class="text-center font-mono text-muted">${d.podiums ?? d.pod ?? 0}</td>
        <td class="text-center">-</td>
      </tr>
    `;
  }).join('');

  // 2. CONSTRUCTOR CHAMPIONSHIP ROWS (Top 5)
  const constructorRows = constructorStandings.filter(Boolean).slice(0, 5);
  const constructorRowsHtml = constructorRows.map(c => {
    const cTeam = c.team || c.constructor || c.name || 'Team';
    return `
      <tr>
        <td class="pos-cell"><span class="pos-num-text">${String(c.pos).padStart(2, '0')}</span></td>
        <td>
          <a href="#constructors" style="display: flex; align-items: center; gap: 6px; text-decoration: none; color: inherit;">
            ${getTeamIconSvg(cTeam)}
            <span style="font-weight: 600; color: var(--text-primary);">${cTeam}</span>
          </a>
        </td>
        <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${c.points ?? c.pts ?? 0}</td>
        <td class="text-center font-mono text-muted">${c.wins ?? c.w ?? 0}</td>
        <td class="text-center font-mono text-muted">${c.podiums ?? c.pod ?? 0}</td>
        <td class="text-center text-muted font-mono" style="font-size: 10px;">${c.recentFinish || '1st'}</td>
        <td class="text-center">-</td>
      </tr>
    `;
  }).join('');

  // 3. LIVE TIMING TOP 5 ROWS
  const timingFeed = liveFeed.slice(0, 5).map((t, idx) => ({
    pos: t.pos || idx + 1,
    code: t.code || 'DRV',
    team: t.team || 'Team',
    lap: t.lap || 62,
    time: t.lapTime || '1:35.842',
    gap: idx === 0 ? 'LEADER' : (t.gap || `+${(idx * 2.345).toFixed(3)}s`),
    s1: t.s1?.time || '27.450',
    s1Status: t.s1?.status || 'purple',
    s2: t.s2?.time || '38.160',
    s2Status: t.s2?.status || 'yellow',
    s3: t.s3?.time || '29.640',
    s3Status: t.s3?.status || 'green',
    tyre: t.tyre?.compound || 'M',
    tyreColor: (t.tyre?.compound === 'S') ? '#f87171' : ((t.tyre?.compound === 'H') ? '#e5e7eb' : '#facc15')
  }));

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

  const sessionTitle = (nextGp.nextSession?.session_name || 'Practice 1').toUpperCase();
  const sessionTimeDisplay = nextGp.round.sessions?.p1 || 'FRI 23 OCT · 17:30 UTC';

  const heroImageMap = {
    'austin': 'assets/austin-hero.jpg',
    'circuit-of-the-americas': 'assets/austin-hero.jpg',
    'singapore': 'assets/singapore-hero.jpg',
    'marina-bay': 'assets/singapore-hero.jpg'
  };
  const heroBgImg = (nextGp.round && heroImageMap[nextGp.round.circuitId]) 
    ? heroImageMap[nextGp.round.circuitId] 
    : 'assets/austin-hero.jpg';

  return `
    <div class="overview-dashboard">
      
      <!-- ========================================================
           ROW 1: NEXT GRAND PRIX HERO BANNER (DYNAMIC ANCHOR)
           ======================================================== -->
      <section class="overview-hero-card" style="background-image: linear-gradient(90deg, rgba(12, 13, 16, 0.92) 0%, rgba(12, 13, 16, 0.74) 45%, rgba(12, 13, 16, 0.28) 75%, rgba(12, 13, 16, 0.88) 100%), url('${heroBgImg}'); background-position: center 42%; background-size: cover; background-repeat: no-repeat;" aria-label="Next Grand Prix Anchor">
        <div class="hero-left-content">
          <div class="hero-round-label">ROUND ${String(nextGp.round.round).padStart(2, '0')} / ${calendar.length}</div>
          <h1 class="hero-title-main">${nextGp.round.grandPrix.toUpperCase()}</h1>
          <div class="hero-circuit-row">
            <span class="country-flag-icon" style="font-size: 14px; margin-right: 4px;">${nextGp.round.flag || '🏁'}</span>
            <span>${nextGp.round.circuitName.toUpperCase()} · ${(nextGp.round.city || nextGp.round.country).toUpperCase()}</span>
          </div>
          <div class="hero-badges-row">
            <span class="hero-pill-date">${nextGp.round.date}</span>
            <a href="#circuits/${nextGp.round.circuitId}" class="hero-pill-link">
              <span>CIRCUIT SPECIFICATION</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <div class="hero-session-box">
          <span class="hero-session-kicker">NEXT SESSION</span>
          <span class="hero-session-title">${sessionTitle}</span>
          
          <div class="hero-countdown-container">
            <div class="hero-countdown-digits-row">
              <span id="header-countdown-d">00</span>
              <span class="hero-countdown-colon">:</span>
              <span id="header-countdown-m">00</span>
              <span class="hero-countdown-colon">:</span>
              <span id="header-countdown-s">00</span>
            </div>
            <div class="hero-countdown-units-row">
              <span>DAYS</span>
              <span style="opacity: 0; padding: 0 4px;" aria-hidden="true">:</span>
              <span>MINS</span>
              <span style="opacity: 0; padding: 0 4px;" aria-hidden="true">:</span>
              <span>SECS</span>
            </div>
          </div>

          <span class="hero-session-timestamp">${sessionTimeDisplay}</span>
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
            <span class="panel-badge">TOP 5 · 2026 STANDINGS</span>
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
            <span class="panel-badge">TOP 5 · 2026 STANDINGS</span>
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
            <a href="#circuits/${nextGp.round.circuitId}" class="panel-action-link" style="text-decoration: none; font-size: 11px; color: var(--text-muted); font-weight: 600;">
              View Circuit →
            </a>
          </div>
          
          <div class="panel-body" style="padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-3);">
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="technical-label" style="font-size: 9px; margin-bottom: 2px;">NEXT UPCOMING VENUE</div>
                <div style="font-weight: 800; font-size: 13px; color: var(--text-primary); text-transform: uppercase;">${nextGp.circuit.name}</div>
                <div class="text-muted font-mono" style="font-size: 11px;">${nextGp.round.city}, ${nextGp.round.country}</div>
              </div>
              <span style="font-size: 24px;">${nextGp.round.flag || '🏁'}</span>
            </div>

            <div class="circuit-stats-quad">
              <div class="stat-quad-item">
                <span class="stat-quad-label">LENGTH</span>
                <span class="stat-quad-value font-mono">${nextGp.circuit.lengthKm}</span>
              </div>
              <div class="stat-quad-item">
                <span class="stat-quad-label">CORNERS</span>
                <span class="stat-quad-value font-mono">${nextGp.circuit.corners}</span>
              </div>
              <div class="stat-quad-item">
                <span class="stat-quad-label">LAPS</span>
                <span class="stat-quad-value font-mono">${nextGp.circuit.laps}</span>
              </div>
              <div class="stat-quad-item">
                <span class="stat-quad-label">RACE DISTANCE</span>
                <span class="stat-quad-value font-mono">${nextGp.circuit.raceDistanceKm}</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- ========================================================
           ROW 3: 2 UNEQUAL COLUMNS SPLIT (WIDE LEFT + COMPACT RIGHT)
           ======================================================== -->
      <section class="overview-row-split" aria-label="Live Operations and Analytical Overview">
        
        <!-- COLUMN 1: LIVE TIMING FEED -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <span class="panel-title">SESSION ARCHIVE // SINGAPORE GRAND PRIX</span>
              <span class="panel-badge">COMPLETED ROUND 19</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 11px;">CLASSIFICATION · 62 LAPS</span>
          </div>
          <div class="panel-body no-padding">
            <div class="table-responsive">
              <table class="data-table" style="font-size: 11px;">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 28px;">POS</th>
                    <th style="width: 45px;">DRIVER</th>
                    <th>TEAM</th>
                    <th class="text-center" style="width: 32px;">LAP</th>
                    <th style="width: 65px;">TIME</th>
                    <th style="width: 55px;">GAP</th>
                    <th class="text-center" style="width: 48px;">S1</th>
                    <th class="text-center" style="width: 48px;">S2</th>
                    <th class="text-center" style="width: 48px;">S3</th>
                    <th class="text-center" style="width: 28px;">TYRE</th>
                  </tr>
                </thead>
                <tbody>
                  ${timingRowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- COLUMN 2: WEATHER SENSORS -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">SESSION WEATHER SENSORS</span>
            <span class="panel-badge">SINGAPORE GP ARCHIVE</span>
          </div>
          <div class="panel-body">
            <div class="weather-metrics-grid">
              <div class="weather-temp-block">
                <div class="weather-icon-temp">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="weather-svg"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                  <div>
                    <span class="weather-value font-mono">30.2°C</span>
                    <span class="weather-label">AIR TEMP</span>
                  </div>
                </div>
              </div>

              <div class="weather-temp-block">
                <div>
                  <span class="weather-value font-mono">41.5°C</span>
                  <span class="weather-label">TRACK TEMP</span>
                </div>
              </div>
            </div>

            <div class="weather-details-row">
              <span>0% RAIN PROB.</span>
              <span>1.4 m/s WIND (SW)</span>
              <span>77.4% HUMIDITY</span>
            </div>
          </div>
        </div>

      </section>

    </div>
  `;
}
