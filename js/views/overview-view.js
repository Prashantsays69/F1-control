/* ==========================================================================
   VIEW: OVERVIEW - F1 SEASON COMMAND DASHBOARD
   Race operations, next Grand Prix dynamic hero, and championship standings
   ========================================================================== */

import { dataService } from '../services/data-service.js';
import { initHeaderCountdown } from '../components/race-control-header.js';

const CONSTRUCTOR_ID_BY_KEY = {
  'mclaren': 'mclaren',
  'ferrari': 'ferrari',
  'mercedes': 'mercedes',
  'red_bull': 'red_bull',
  'redbull': 'red_bull',
  'aston_martin': 'aston_martin',
  'aston': 'aston_martin',
  'alpine': 'alpine',
  'williams': 'williams',
  'racing_bulls': 'racing_bulls',
  'rb': 'racing_bulls',
  'haas': 'haas',
  'audi': 'audi',
  'sauber': 'audi',
  'cadillac': 'cadillac'
};

const CONSTRUCTOR_BRAND_METADATA = {
  'mclaren': { name: 'McLaren Formula 1 Team', code: 'MCL', file: 'assets/teams/mclaren.webp' },
  'ferrari': { name: 'Scuderia Ferrari', code: 'FER', file: 'assets/teams/ferrari.webp' },
  'mercedes': { name: 'Mercedes-AMG PETRONAS Formula One Team', code: 'MER', file: 'assets/teams/mercedes.webp' },
  'red_bull': { name: 'Red Bull Racing', code: 'RBR', file: 'assets/teams/red_bull.webp' },
  'aston_martin': { name: 'Aston Martin Aramco Formula One Team', code: 'AMR', file: 'assets/teams/aston_martin.webp' },
  'alpine': { name: 'BWT Alpine Formula One Team', code: 'ALP', file: 'assets/teams/alpine.webp' },
  'williams': { name: 'Williams Racing', code: 'WIL', file: 'assets/teams/williams.webp' },
  'racing_bulls': { name: 'Visa Cash App RB Formula One Team', code: 'RB', file: 'assets/teams/racing_bulls.webp' },
  'haas': { name: 'MoneyGram Haas F1 Team', code: 'HAS', file: 'assets/teams/haas.webp' },
  'audi': { name: 'Audi Revolut Formula 1 Team', code: 'AUD', file: 'assets/teams/audi.webp' },
  'cadillac': { name: 'Cadillac Formula 1 Team', code: 'CAD', file: 'assets/teams/cadillac.webp' }
};

export function resolveConstructorId(teamInput) {
  if (!teamInput) return null;
  const str = String(teamInput).trim().toLowerCase();
  if (CONSTRUCTOR_ID_BY_KEY[str]) return CONSTRUCTOR_ID_BY_KEY[str];
  if (str.includes('mclaren')) return 'mclaren';
  if (str.includes('ferrari')) return 'ferrari';
  if (str.includes('mercedes')) return 'mercedes';
  if (str.includes('red bull') || str.includes('redbull') || str.includes('red_bull')) return 'red_bull';
  if (str.includes('aston') || str.includes('martin')) return 'aston_martin';
  if (str.includes('alpine')) return 'alpine';
  if (str.includes('williams')) return 'williams';
  if (str.includes('racing bulls') || str.includes('racing bull') || str.includes('racing_bulls') || str.includes('cash app') || str === 'rb' || str.includes('rb f1')) return 'racing_bulls';
  if (str.includes('haas')) return 'haas';
  if (str.includes('audi') || str.includes('sauber') || str.includes('stake')) return 'audi';
  if (str.includes('cadillac')) return 'cadillac';
  return null;
}

export function getTeamLogoHtml(teamInput, options = {}) {
  const constructorId = resolveConstructorId(teamInput);
  const meta = constructorId ? CONSTRUCTOR_BRAND_METADATA[constructorId] : null;

  if (!meta) {
    const fallbackText = typeof teamInput === 'string' && teamInput.length > 0 
      ? teamInput.substring(0, 3).toUpperCase() 
      : 'F1';
    return `<span class="team-logo-container font-mono text-muted" style="font-size: 10px; font-weight: 700;" title="${teamInput || 'Constructor'}">${fallbackText}</span>`;
  }

  const maxH = options.maxHeight || 16;
  const maxW = options.maxWidth || 40;

  return `
    <span class="team-logo-container" title="${meta.name}">
      <img src="${meta.file}" alt="${meta.name}" class="team-brand-logo" 
           style="max-height: ${maxH}px; max-width: ${maxW}px;"
           loading="lazy"
           onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='inline-block';" />
      <span class="team-logo-fallback font-mono" style="display: none;">${meta.code}</span>
    </span>
  `.trim();
}

export function getTeamIconSvg(teamName) {
  return getTeamLogoHtml(teamName);
}

export async function renderOverviewView(roundNumber = null) {
  const calendar = await dataService.getCalendar();
  const selectedEvent = await dataService.getEventByRound(roundNumber);
  const driverStandings = (await dataService.getDriverStandings()) || [];
  const constructorStandings = (await dataService.getConstructorStandings()) || [];
  const recentRace = await dataService.getRecentRace();

  const isUpcoming = selectedEvent.round.status === 'upcoming';
  const isCompleted = selectedEvent.round.status === 'completed';

  // 1. DRIVER CHAMPIONSHIP ROWS (Top 5)
  const driverRows = driverStandings.filter(Boolean).slice(0, 5);
  const driverRowsHtml = driverRows.map(d => {
    const driverName = d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Driver';
    const driverTeam = d.team || d.teamName || 'Independent';
    return `
      <tr>
        <td class="pos-cell"><span class="pos-num-text">${d.pos || '01'}</span></td>
        <td>
          <a href="#drivers/${d.id || d.driverId || (d.code ? d.code.toLowerCase() : '')}" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit;">
            <span style="font-weight: 600; color: var(--text-primary);">${driverName}</span>
          </a>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${getTeamIconSvg(driverTeam)}
            <span class="text-secondary" style="font-size: 11px;">${driverTeam}</span>
          </div>
        </td>
        <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${d.pts ?? d.points ?? 0}</td>
        <td class="text-center font-mono text-muted">${d.wins ?? d.w ?? 0}</td>
        <td class="text-center font-mono text-muted">${d.podiums ?? d.pod ?? 0}</td>
        <td class="text-center">${d.delta || '-'}</td>
      </tr>
    `;
  }).join('');

  // 2. CONSTRUCTOR CHAMPIONSHIP ROWS (Top 5)
  const constructorRows = constructorStandings.filter(Boolean).slice(0, 5);
  const constructorRowsHtml = constructorRows.map(c => {
    const cTeam = c.team || c.constructor || c.name || 'Team';
    return `
      <tr>
        <td class="pos-cell"><span class="pos-num-text">${c.pos || '01'}</span></td>
        <td>
          <a href="#constructors" style="display: flex; align-items: center; gap: 6px; text-decoration: none; color: inherit;">
            ${getTeamIconSvg(cTeam)}
            <span style="font-weight: 600; color: var(--text-primary);">${cTeam}</span>
          </a>
        </td>
        <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${c.pts ?? c.points ?? 0}</td>
        <td class="text-center font-mono text-muted">${c.wins ?? c.w ?? 0}</td>
        <td class="text-center font-mono text-muted">${c.podiums ?? c.pod ?? 0}</td>
        <td class="text-center font-mono" style="font-size: 11px; color: var(--text-secondary);">${c.last || '-'}</td>
        <td class="text-center">${c.delta || '-'}</td>
      </tr>
    `;
  }).join('');

  // 3. EVENT SPECIFIC MODULES (Hero Image, Venue Weather, Session State)
  const heroImageMap = {
    'austin': 'assets/austin-hero.jpg',
    'circuit-of-the-americas': 'assets/austin-hero.jpg',
    '9': 'assets/austin-hero.jpg',
    'singapore': 'assets/singapore-hero.jpg',
    'marina-bay': 'assets/singapore-hero.jpg',
    '61': 'assets/singapore-hero.jpg'
  };
  const circuitIdKey = String(selectedEvent.round.circuitId || selectedEvent.round.circuitKey || '').toLowerCase();
  const heroBgImg = heroImageMap[circuitIdKey] || (selectedEvent.round.circuitId === '61' ? 'assets/singapore-hero.jpg' : 'assets/austin-hero.jpg');

  const venueWeatherPresets = {
    '9': {
      title: 'SESSION WEATHER // CIRCUIT OF THE AMERICAS',
      badge: 'AUSTIN VENUE FORECAST',
      airTemp: '24.6°C',
      trackTemp: '31.2°C',
      rainProb: '0%',
      wind: '2.4 m/s (NE)',
      humidity: '46.0%'
    },
    'austin': {
      title: 'SESSION WEATHER // CIRCUIT OF THE AMERICAS',
      badge: 'AUSTIN VENUE FORECAST',
      airTemp: '24.6°C',
      trackTemp: '31.2°C',
      rainProb: '0%',
      wind: '2.4 m/s (NE)',
      humidity: '46.0%'
    },
    '61': {
      title: 'SESSION WEATHER // MARINA BAY STREET CIRCUIT',
      badge: 'SINGAPORE GP ARCHIVE',
      airTemp: '30.2°C',
      trackTemp: '41.5°C',
      rainProb: '10%',
      wind: '1.4 m/s (SW)',
      humidity: '77.4%'
    },
    'singapore': {
      title: 'SESSION WEATHER // MARINA BAY STREET CIRCUIT',
      badge: 'SINGAPORE GP ARCHIVE',
      airTemp: '30.2°C',
      trackTemp: '41.5°C',
      rainProb: '10%',
      wind: '1.4 m/s (SW)',
      humidity: '77.4%'
    }
  };
  const activeWeather = venueWeatherPresets[circuitIdKey] || {
    title: `SESSION WEATHER // ${selectedEvent.circuit.name.toUpperCase()}`,
    badge: `${(selectedEvent.round.city || selectedEvent.round.country).toUpperCase()} TRACK SENSORS`,
    airTemp: '23.8°C',
    trackTemp: '29.5°C',
    rainProb: '0%',
    wind: '1.8 m/s (W)',
    humidity: '52.0%'
  };

  const roundNumberStr = String(selectedEvent.round.round).padStart(2, '0');
  const totalRounds = calendar.length;
  const statusText = isUpcoming ? 'UPCOMING GRAND PRIX' : (isCompleted ? 'COMPLETED ROUND' : 'CURRENT EVENT');
  const statusBadgeClass = isCompleted ? 'completed' : 'upcoming';

  let heroRightPanelHtml = '';
  if (isUpcoming) {
    const sessionTitle = (selectedEvent.nextSession?.session_name || 'Practice 1').toUpperCase();
    const sessionTimeDisplay = selectedEvent.round.sessions?.p1 || 'FRI 23 OCT · 17:30 UTC';
    heroRightPanelHtml = `
      <div class="hero-session-box" aria-label="Session Countdown">
        <span class="hero-session-kicker">NEXT SESSION</span>
        <span class="hero-session-title">${sessionTitle}</span>
        
        <div class="hero-countdown-container">
          <div class="hero-countdown-digits-row font-mono">
            <span id="header-countdown-d">00</span>
            <span class="hero-countdown-colon">:</span>
            <span id="header-countdown-h">00</span>
            <span class="hero-countdown-colon">:</span>
            <span id="header-countdown-m">00</span>
            <span class="hero-countdown-colon">:</span>
            <span id="header-countdown-s">00</span>
          </div>
          <div class="hero-countdown-units-row">
            <span>DAYS</span>
            <span style="opacity: 0; padding: 0 2px;" aria-hidden="true">:</span>
            <span>HRS</span>
            <span style="opacity: 0; padding: 0 2px;" aria-hidden="true">:</span>
            <span>MINS</span>
            <span style="opacity: 0; padding: 0 2px;" aria-hidden="true">:</span>
            <span>SECS</span>
          </div>
        </div>

        <span class="hero-session-timestamp">${sessionTimeDisplay}</span>
      </div>
    `;
  } else {
    heroRightPanelHtml = `
      <div class="hero-session-box" aria-label="Event Classification Summary">
        <span class="hero-session-kicker">EVENT STATUS</span>
        <span class="hero-session-title">OFFICIAL RESULT</span>
        
        <div style="margin: 8px 0; display: flex; flex-direction: column; gap: 4px;">
          <div class="technical-label" style="font-size: 9px;">RACE WINNER</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff;">${selectedEvent.round.winner || 'M. Verstappen'}</div>
          <div class="font-mono text-muted" style="font-size: 11px;">${selectedEvent.circuit.laps || 62} LAPS COMPLETED</div>
        </div>

        <span class="hero-session-timestamp">${selectedEvent.round.date}</span>
      </div>
    `;
  }

  let row3Card1Html = '';
  if (isUpcoming) {
    const sessions = selectedEvent.round.sessions || {
      p1: 'FRI 23 OCT · 17:30 UTC',
      p2: 'FRI 23 OCT · 21:00 UTC',
      p3: 'SAT 24 OCT · 17:30 UTC',
      quali: 'SAT 24 OCT · 21:00 UTC',
      race: 'SUN 25 OCT · 20:00 UTC'
    };

    row3Card1Html = `
      <div class="panel">
        <div class="panel-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; font-size: 11px; letter-spacing: 0.06em; color: var(--text-primary);">
              SESSION STATUS // ${selectedEvent.round.grandPrix.toUpperCase()}
            </span>
            <span class="hero-status-badge">ROUND ${selectedEvent.round.round} · UPCOMING</span>
          </div>
          <span class="font-mono text-muted" style="font-size: 11px;">SCHEDULED RACE WEEKEND</span>
        </div>

        <div class="upcoming-session-schedule-list">
          <div class="upcoming-session-row current-target">
            <div>
              <span style="font-weight: 700; color: var(--text-primary);">Practice 1</span>
              <span class="text-muted font-mono" style="font-size: 11px; margin-left: 8px;">60 MINS</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 11px;">${sessions.p1}</span>
            <span class="badge-tag status-green" style="font-size: 9px; font-weight: 700;">NEXT SESSION</span>
          </div>
          <div class="upcoming-session-row">
            <div>
              <span style="font-weight: 700; color: var(--text-primary);">Practice 2</span>
              <span class="text-muted font-mono" style="font-size: 11px; margin-left: 8px;">60 MINS</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 11px;">${sessions.p2}</span>
            <span class="badge-tag" style="font-size: 9px;">SCHEDULED</span>
          </div>
          <div class="upcoming-session-row">
            <div>
              <span style="font-weight: 700; color: var(--text-primary);">Practice 3</span>
              <span class="text-muted font-mono" style="font-size: 11px; margin-left: 8px;">60 MINS</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 11px;">${sessions.p3}</span>
            <span class="badge-tag" style="font-size: 9px;">SCHEDULED</span>
          </div>
          <div class="upcoming-session-row">
            <div>
              <span style="font-weight: 700; color: var(--text-primary);">Qualifying</span>
              <span class="text-muted font-mono" style="font-size: 11px; margin-left: 8px;">Q1 · Q2 · Q3</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 11px;">${sessions.quali}</span>
            <span class="badge-tag" style="font-size: 9px;">SCHEDULED</span>
          </div>
          <div class="upcoming-session-row">
            <div>
              <span style="font-weight: 700; color: var(--text-primary);">Grand Prix</span>
              <span class="text-muted font-mono" style="font-size: 11px; margin-left: 8px;">${selectedEvent.circuit.laps} LAPS</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 11px;">${sessions.race}</span>
            <span class="badge-tag" style="font-size: 9px;">SCHEDULED</span>
          </div>
        </div>

        <div class="session-standby-banner">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted);"></span>
            <span class="font-mono" style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: var(--text-secondary);">
              TRACK TIMING TRANSPONDERS & TELEMETRY SENSORS ON STANDBY
            </span>
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5; margin: 0;">
            Live telemetry streams and car transponders activate at green flag for Practice 1. Explore recent completed session classifications below or launch the telemetry replay engine.
          </p>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <a href="#results/19" class="hero-pill-link" style="font-size: 10px; padding: 4px 10px;">
              <span>VIEW ROUND 19 ARCHIVE (SINGAPORE)</span>
              <span>→</span>
            </a>
            <a href="#live-timing" class="hero-pill-link" style="font-size: 10px; padding: 4px 10px;">
              <span>OPEN TELEMETRY SIMULATION</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    `;
  } else {
    const resData = await dataService.getRaceResults(selectedEvent.round.round);
    const results = (resData?.results && resData.results.length > 0) ? resData.results.slice(0, 5) : [];
    
    const timingRowsHtml = results.map(r => `
      <tr>
        <td class="pos-cell font-mono text-center" style="font-weight: 700;">${r.pos}</td>
        <td style="font-weight: 700; color: var(--text-primary); font-family: var(--font-mono);">${r.code}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${getTeamIconSvg(r.teamName || r.team)}
            <span class="text-secondary" style="font-size: 11px;">${r.teamName || r.team}</span>
          </div>
        </td>
        <td class="font-mono text-center text-muted">${selectedEvent.circuit.laps || 62}</td>
        <td class="font-mono" style="font-weight: 700; color: var(--text-primary);">${r.time}</td>
        <td class="font-mono text-muted">${r.gap || '-'}</td>
        <td class="font-mono text-center"><span class="sector-chip purple">FL</span></td>
        <td class="font-mono text-center"><span class="sector-chip green">P${r.pits || 1}</span></td>
        <td class="font-mono text-center"><span class="sector-chip green">${r.points} PTS</span></td>
        <td class="text-center font-mono text-muted">H</td>
      </tr>
    `).join('');

    row3Card1Html = `
      <div class="panel">
        <div class="panel-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; font-size: 11px; letter-spacing: 0.06em; color: var(--text-primary);">
              SESSION ARCHIVE // ${selectedEvent.round.grandPrix.toUpperCase()}
            </span>
            <span class="badge-tag status-green" style="padding: 1px 6px; font-size: 9px; font-weight: 600;">COMPLETED ROUND ${selectedEvent.round.round}</span>
          </div>
          <span class="font-mono text-muted" style="font-size: 11px;">CLASSIFICATION · ${selectedEvent.circuit.laps || 62} LAPS</span>
        </div>

        <div class="panel-body no-padding">
          <div class="table-responsive">
            <table class="data-table" style="font-size: 11px;">
              <thead>
                <tr>
                  <th class="text-center" style="width: 28px;">POS</th>
                  <th>DRIVER</th>
                  <th>CONSTRUCTOR</th>
                  <th class="text-center" style="width: 32px;">LAPS</th>
                  <th>TIME</th>
                  <th>GAP</th>
                  <th class="text-center">FAST</th>
                  <th class="text-center">PIT</th>
                  <th class="text-center">PTS</th>
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
    `;
  }

  const scheduleSessions = selectedEvent.round.sessions || {
    p1: 'FRI 23 OCT · 17:30 UTC',
    p2: 'FRI 23 OCT · 21:00 UTC',
    p3: 'SAT 24 OCT · 17:30 UTC',
    quali: 'SAT 24 OCT · 21:00 UTC',
    race: 'SUN 25 OCT · 20:00 UTC'
  };

  return `
    <div class="overview-dashboard">
      
      <!-- EVENT SELECTOR TOOLBAR -->
      <div class="event-selector-bar">
        <div style="display: flex; align-items: center; gap: 10px;">
          <label for="overview-event-select" class="technical-label" style="font-size: 10px; color: var(--text-muted); cursor: pointer;">EVENT FOCUS:</label>
          <select id="overview-event-select" class="event-selector-select" aria-label="Select Grand Prix Focus">
            ${calendar.map(r => `
              <option value="${r.round}" ${r.round === selectedEvent.round.round ? 'selected' : ''}>
                ROUND ${String(r.round).padStart(2, '0')}: ${r.grandPrix.toUpperCase()} (${r.status.toUpperCase()})
              </option>
            `).join('')}
          </select>
        </div>
        <div class="font-mono text-muted" style="font-size: 11px;">
          ${selectedEvent.round.circuitName} · ${selectedEvent.round.date}
        </div>
      </div>

      <!-- ========================================================
           ROW 1: EDITORIAL GRAND PRIX HERO BANNER
           ======================================================== -->
      <section class="overview-hero-card" style="background-image: linear-gradient(90deg, rgba(12, 13, 16, 0.94) 0%, rgba(12, 13, 16, 0.82) 44%, rgba(12, 13, 16, 0.32) 75%, rgba(12, 13, 16, 0.88) 100%), url('${heroBgImg}');" aria-label="${selectedEvent.round.grandPrix} Editorial Banner">
        
        <!-- LEFT EDITORIAL CONTENT COLUMN -->
        <div class="hero-editorial-column">
          <!-- 1. Round and event status -->
          <div class="hero-status-kicker">
            <span>ROUND ${roundNumberStr} / ${totalRounds}</span>
            <span class="hero-status-badge ${statusBadgeClass}">${statusText}</span>
          </div>

          <!-- 2. Country identifier -->
          <div class="hero-country-identifier">
            <span class="country-flag-symbol">${selectedEvent.round.flag || '🏁'}</span>
            <span>${selectedEvent.round.country.toUpperCase()}</span>
          </div>

          <!-- 3. Grand Prix title -->
          <h1 class="hero-title-main">${selectedEvent.round.grandPrix.toUpperCase()}</h1>

          <!-- 4. Circuit name or location -->
          <div class="hero-venue-location">
            <span>${selectedEvent.round.circuitName.toUpperCase()}</span>
            <span class="text-muted">·</span>
            <span class="text-muted">${(selectedEvent.round.city || selectedEvent.round.country).toUpperCase()}</span>
          </div>

          <!-- 5 & 6. Grouped date range & circuit action -->
          <div class="hero-actions-group">
            <span class="hero-pill-date">${selectedEvent.round.date}</span>
            <a href="#circuits/${selectedEvent.round.circuitId || selectedEvent.round.circuitKey}" class="hero-pill-link">
              <span>CIRCUIT SPECIFICATION</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <!-- RIGHT INDEPENDENT COUNTDOWN / STATUS PANEL -->
        ${heroRightPanelHtml}
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
                    <th>CONSTRUCTOR</th>
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

        <!-- COLUMN 3: CIRCUIT SPECIFICATION -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">CIRCUIT SPECIFICATION</span>
            <a href="#circuits/${selectedEvent.round.circuitId || selectedEvent.round.circuitKey}" class="panel-action-link" style="text-decoration: none; font-size: 11px; color: var(--text-muted); font-weight: 600;">
              View Circuit →
            </a>
          </div>
          
          <div class="panel-body" style="padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-3);">
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="technical-label" style="font-size: 9px; margin-bottom: 2px;">VENUE SPECIFICATION</div>
                <div style="font-weight: 800; font-size: 13px; color: var(--text-primary); text-transform: uppercase;">${selectedEvent.circuit.name}</div>
                <div class="text-muted font-mono" style="font-size: 11px;">${selectedEvent.round.city}, ${selectedEvent.round.country}</div>
              </div>
              <span style="font-size: 24px;">${selectedEvent.round.flag || '🏁'}</span>
            </div>

            <div class="circuit-stats-quad">
              <div class="stat-quad-item">
                <span class="stat-quad-label">LENGTH</span>
                <span class="stat-quad-value font-mono">${selectedEvent.circuit.lengthKm}</span>
              </div>
              <div class="stat-quad-item">
                <span class="stat-quad-label">CORNERS</span>
                <span class="stat-quad-value font-mono">${selectedEvent.circuit.corners}</span>
              </div>
              <div class="stat-quad-item">
                <span class="stat-quad-label">LAPS</span>
                <span class="stat-quad-value font-mono">${selectedEvent.circuit.laps}</span>
              </div>
              <div class="stat-quad-item">
                <span class="stat-quad-label">RACE DISTANCE</span>
                <span class="stat-quad-value font-mono">${selectedEvent.circuit.raceDistanceKm}</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- ========================================================
           ROW 3: 2 UNEQUAL COLUMNS SPLIT (WIDE LEFT + COMPACT RIGHT)
           ======================================================== -->
      <section class="overview-row-split" aria-label="Operations and Analytical Status">
        
        <!-- LEFT COLUMN: SESSION STATUS/ARCHIVE + RECENT COMPLETED RACE -->
        <div class="overview-col-left">
          
          <!-- Card 1: Session Status or Archive -->
          ${row3Card1Html}

          <!-- Card 2: Recent Completed Race -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">RECENT COMPLETED RACE</span>
              <a href="#results/${recentRace.roundNumber || 19}" class="panel-action-link" style="text-decoration: none; font-size: 11px; color: var(--text-muted); font-weight: 600;">
                ${recentRace.raceName} →
              </a>
            </div>

            <div class="recent-race-card-body">
              <div class="recent-race-columns">
                <!-- Winner segment -->
                <div class="winner-profile-segment">
                  <div class="winner-avatar-frame" style="width: 38px; height: 38px; border-radius: 4px; overflow: hidden; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); flex-shrink: 0; position: relative;">
                    ${recentRace.winner.headshot ? `<img src="${recentRace.winner.headshot}" alt="${recentRace.winner.name}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : ''}
                    <div class="font-mono" style="${recentRace.winner.headshot ? 'display: none;' : 'display: flex;'} width: 100%; height: 100%; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; color: var(--f1-red);">
                      WIN
                    </div>
                  </div>
                  <div>
                    <div class="technical-label" style="font-size: 9px; margin-bottom: 2px;">RACE WINNER</div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      ${getTeamIconSvg(recentRace.winner.team)}
                      <span style="font-weight: 800; font-size: 13px; color: var(--text-primary); text-transform: uppercase;">${recentRace.winner.name}</span>
                    </div>
                    <div class="text-muted font-mono" style="font-size: 10px; margin-left: 20px; text-transform: uppercase;">${recentRace.winner.team} · ${recentRace.winner.time}</div>
                  </div>
                </div>

                <!-- P2 & P3 podium finishers -->
                <div class="podium-finishers-segment">
                  <div class="podium-finisher-row">
                    <span class="podium-chip-num p2">2</span>
                    ${getTeamIconSvg(recentRace.p2.team)}
                    <span style="font-weight: 600; color: var(--text-primary);">${recentRace.p2.name}</span>
                    <span class="font-mono text-muted" style="margin-left: auto;">${recentRace.p2.gap}</span>
                  </div>
                  <div class="podium-finisher-row">
                    <span class="podium-chip-num p3">3</span>
                    ${getTeamIconSvg(recentRace.p3.team)}
                    <span style="font-weight: 600; color: var(--text-primary);">${recentRace.p3.name}</span>
                    <span class="font-mono text-muted" style="margin-left: auto;">${recentRace.p3.gap}</span>
                  </div>
                </div>
              </div>

              <!-- Footer stat bar -->
              <div class="recent-race-footer-bar font-mono">
                <div>
                  <span class="text-muted" style="font-size: 10px;">FASTEST LAP:</span>
                  <span style="font-weight: 700; color: var(--text-primary); margin-left: 4px;">${recentRace.fastestLap.time}</span>
                  <span class="text-muted" style="font-size: 10px; margin-left: 4px;">${recentRace.fastestLap.driver}</span>
                </div>
                <div>
                  <span class="text-muted" style="font-size: 10px;">POINTS LEADER:</span>
                  <span style="font-weight: 700; color: var(--text-primary); margin-left: 4px;">${recentRace.pointsLeader.pts}</span>
                  <span class="text-muted" style="font-size: 10px; margin-left: 4px;">${recentRace.pointsLeader.driver}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: WEATHER + SCHEDULE + PROGRESSION -->
        <div class="overview-col-right">
          
          <!-- Card 1: Weather (Derived strictly from selectedEvent) -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">${activeWeather.title}</span>
              <span class="badge-tag" style="font-size: 9px;">${activeWeather.badge}</span>
            </div>
            <div class="weather-panel-content">
              <div class="weather-top-metric-row">
                <div class="weather-icon-symbol">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-mono" style="font-size: 19px; font-weight: 800; color: var(--text-primary); line-height: 1;">${activeWeather.airTemp}</div>
                  <div class="technical-label" style="font-size: 9px; margin-top: 2px;">AIR TEMP</div>
                </div>
                <div style="margin-left: var(--space-4);">
                  <div class="font-mono" style="font-size: 19px; font-weight: 800; color: var(--text-primary); line-height: 1;">${activeWeather.trackTemp}</div>
                  <div class="technical-label" style="font-size: 9px; margin-top: 2px;">TRACK TEMP</div>
                </div>
              </div>

              <div class="weather-bottom-metric-row">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary);">${activeWeather.rainProb}</span>
                  <span class="text-muted" style="font-size: 9px;">RAIN PROB.</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span class="font-mono" style="font-weight: 700; color: var(--text-primary);">${activeWeather.wind}</span>
                  <span class="text-muted" style="font-size: 9px;">WIND</span>
                </div>
                <div>
                  <span style="font-weight: 700; color: var(--text-primary);">${activeWeather.humidity}</span>
                  <span class="text-muted" style="font-size: 9px; margin-left: 2px;">HUMIDITY</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Event Weekend Schedule -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">EVENT WEEKEND SCHEDULE</span>
              <span class="font-mono text-muted" style="font-size: 11px;">ROUND ${selectedEvent.round.round} · ${(selectedEvent.round.city || selectedEvent.round.country).toUpperCase()}</span>
            </div>
            <div class="schedule-clean-list">
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">Practice 1</span>
                <span class="font-mono text-muted" style="font-size: 11px;">${scheduleSessions.p1}</span>
                <span class="schedule-status-upcoming">${isCompleted ? 'COMPLETED' : 'SCHEDULED'}</span>
              </div>
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">Practice 2</span>
                <span class="font-mono text-muted" style="font-size: 11px;">${scheduleSessions.p2}</span>
                <span class="schedule-status-upcoming">${isCompleted ? 'COMPLETED' : 'SCHEDULED'}</span>
              </div>
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">Practice 3</span>
                <span class="font-mono text-muted" style="font-size: 11px;">${scheduleSessions.p3}</span>
                <span class="schedule-status-upcoming">${isCompleted ? 'COMPLETED' : 'SCHEDULED'}</span>
              </div>
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">Qualifying</span>
                <span class="font-mono text-muted" style="font-size: 11px;">${scheduleSessions.quali}</span>
                <span class="schedule-status-upcoming">${isCompleted ? 'COMPLETED' : 'SCHEDULED'}</span>
              </div>
              <div class="schedule-clean-row">
                <span class="schedule-clean-session">Grand Prix</span>
                <span class="font-mono text-muted" style="font-size: 11px;">${scheduleSessions.race}</span>
                <span class="schedule-status-upcoming">${isCompleted ? 'COMPLETED' : 'SCHEDULED'}</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Championship Progression -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">CHAMPIONSHIP PROGRESSION</span>
              <span class="panel-badge">TOP 5 · 2026 STANDINGS</span>
            </div>
            <div class="progression-split-content">
              <div style="height: 125px; width: 100%; position: relative;">
                <svg viewBox="0 0 240 120" style="width: 100%; height: 100%; display: block;">
                  <line x1="25" y1="15" x2="235" y2="15" stroke="var(--border-subtle)" stroke-dasharray="2 2"/>
                  <line x1="25" y1="42" x2="235" y2="42" stroke="var(--border-subtle)" stroke-dasharray="2 2"/>
                  <line x1="25" y1="69" x2="235" y2="69" stroke="var(--border-subtle)" stroke-dasharray="2 2"/>
                  <line x1="25" y1="96" x2="235" y2="96" stroke="var(--border-subtle)"/>

                  <text x="20" y="18" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">400</text>
                  <text x="20" y="45" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">300</text>
                  <text x="20" y="72" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">200</text>
                  <text x="20" y="99" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" text-anchor="end">100</text>

                  <text x="25" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">R1</text>
                  <text x="80" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">R6</text>
                  <text x="135" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">R12</text>
                  <text x="185" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">R19</text>
                  <text x="225" y="112" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8">R25</text>

                  ${driverRows.map((d, idx) => {
                    const maxPts = 400;
                    const endY = 96 - ((d.pts || d.points || 0) / maxPts) * 81;
                    const midY = 96 - ((d.pts || d.points || 0) * 0.55 / maxPts) * 81;
                    return `<path d="M 25,96 L 80,${Math.round(96 - (d.pts*0.25/maxPts)*81)} L 135,${Math.round(midY)} L 185,${Math.round(endY)}" fill="none" stroke="${d.teamColor || '#e10600'}" stroke-width="1.8" stroke-linecap="round"/>`;
                  }).join('')}
                </svg>
              </div>

              <div class="progression-scores-list">
                ${driverRows.map((d) => `
                  <div class="progression-driver-score">
                    <span class="prog-color-box" style="background: ${d.teamColor || '#e10600'};"></span>
                    <span>${d.code}</span>
                    <span class="font-mono" style="font-weight: 700; color: var(--text-primary); margin-left: auto;">${d.pts ?? d.points ?? 0}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>

      </section>

    </div>
  `;
}

export function bindOverviewEvents(onSelectRound) {
  const selectEl = document.getElementById('overview-event-select');
  if (selectEl && onSelectRound) {
    selectEl.addEventListener('change', (e) => {
      const roundNum = e.target.value;
      if (roundNum) {
        onSelectRound(roundNum);
      }
    });
  }
}
