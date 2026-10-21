/* ==========================================================================
   VIEW: RESULTS ARCHIVE
   Strict adherence to Section 9 of design.txt
   ========================================================================== */

import { dataService } from '../services/data-service.js';

let selectedRound = 17;

export async function renderResultsView(roundNumber = selectedRound) {
  selectedRound = parseInt(roundNumber, 10) || 17;
  const calendar = await dataService.getCalendar();
  const raceData = await dataService.getRaceResults(selectedRound);

  // If raceData cannot be found at all
  if (!raceData) {
    return `
      <div class="results-page">
        <div class="filter-bar">
          <div>
            <span class="technical-label">OFFICIAL CLASSIFICATION ARCHIVE</span>
            <div class="technical-subtext">SELECT ROUND TO INSPECT OFFICIAL FIA RESULTS</div>
          </div>
        </div>
        <div class="panel" style="padding: var(--space-8); text-align: center;">
          <div class="technical-label" style="font-size: 14px; margin-bottom: var(--space-2); color: var(--f1-red);">CLASSIFICATION RECORD NOT FOUND</div>
          <p class="text-secondary" style="font-size: 13px; max-width: 520px; margin: 0 auto var(--space-4); line-height: 1.6;">
            Round ${selectedRound} classification is not available in official archives. Please select a verified round from the 2026 calendar.
          </p>
          <a href="#results/17" class="filter-btn active" style="display: inline-block;">LOAD VERIFIED ROUND 17 (AZERBAIJAN)</a>
        </div>
      </div>
    `;
  }

  // Quick buttons for key recent rounds
  const recentRounds = [17, 16, 15, 14, 13, 12];
  const quickPillsHtml = recentRounds.map(rNum => {
    const rCal = calendar.find(c => c.round === rNum);
    const label = rCal ? `R${rNum} (${rCal.country.toUpperCase()})` : `ROUND ${rNum}`;
    return `<button class="filter-btn ${selectedRound === rNum ? 'active' : ''}" data-round="${rNum}">${label}</button>`;
  }).join('');

  // Dropdown options for all 24 calendar rounds
  const dropdownOptionsHtml = calendar.map(c => `
    <option value="${c.round}" ${c.round === selectedRound ? 'selected' : ''}>
      ROUND ${String(c.round).padStart(2, '0')}: ${c.grandPrix.toUpperCase()} (${c.status.toUpperCase()})
    </option>
  `).join('');

  // 1. UPCOMING ROUND STATE
  if (raceData.isUpcoming) {
    return `
      <div class="results-page">
        <div class="filter-bar">
          <div>
            <span class="technical-label">OFFICIAL CLASSIFICATION & RACE RESULTS</span>
            <div class="technical-subtext">ROUND ${raceData.round}: ${raceData.grandPrix.toUpperCase()} · ${raceData.date}</div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="results-round-select" class="control-select" style="font-size: 11px; padding: 4px 8px;">
              ${dropdownOptionsHtml}
            </select>
          </div>
        </div>

        <div class="filter-btn-group" id="results-round-filter" style="margin-bottom: var(--space-4);">
          ${quickPillsHtml}
        </div>

        <div class="panel" style="padding: var(--space-8); text-align: center;">
          <span class="badge-tag status-amber" style="margin-bottom: var(--space-3); display: inline-block;">SESSION SCHEDULED · NOT YET RUN</span>
          <div class="technical-label" style="font-size: 16px; margin-bottom: var(--space-2);">${raceData.grandPrix.toUpperCase()}</div>
          <div class="font-mono text-muted" style="font-size: 13px; margin-bottom: var(--space-4);">
            ${raceData.circuit} · ${raceData.date}
          </div>
          <p class="text-secondary" style="font-size: 13px; max-width: 520px; margin: 0 auto var(--space-4); line-height: 1.6;">
            Official FIA classification will be published following the conclusion of Sunday's Grand Prix. Review track telemetry and sector breakdown below.
          </p>
          ${raceData.circuitId ? `
            <a href="#circuits/${raceData.circuitId}" class="filter-btn active" style="display: inline-block;">
              INSPECT ${raceData.circuit.toUpperCase()} TELEMETRY →
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 2. PARTIAL SUMMARY COMPLETED ROUND (Rounds 1-15)
  if (raceData.isPartialArchive) {
    return `
      <div class="results-page">
        <div class="filter-bar">
          <div>
            <span class="technical-label">OFFICIAL CLASSIFICATION & RACE RESULTS</span>
            <div class="technical-subtext">ROUND ${raceData.round}: ${raceData.grandPrix.toUpperCase()} · ${raceData.date}</div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="results-round-select" class="control-select" style="font-size: 11px; padding: 4px 8px;">
              ${dropdownOptionsHtml}
            </select>
          </div>
        </div>

        <div class="filter-btn-group" id="results-round-filter" style="margin-bottom: var(--space-4);">
          ${quickPillsHtml}
        </div>

        <div class="panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <span class="technical-label">${raceData.grandPrix.toUpperCase()}</span>
              <span class="panel-badge">FIA VERIFIED ARCHIVE</span>
            </div>
            <span class="badge-tag" style="font-size: 10px;">HISTORICAL RESULT</span>
          </div>

          <div class="panel-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-4);">
              <div class="stat-block">
                <span class="stat-block-label">RACE WINNER</span>
                <span class="stat-block-value" style="color: var(--text-primary); font-size: var(--text-xl);">${raceData.winner}</span>
                <span class="stat-block-sub">25 Championship Points</span>
              </div>
              <div class="stat-block">
                <span class="stat-block-label">CIRCUIT & DATE</span>
                <span class="stat-block-value" style="font-size: var(--text-md);">${raceData.circuit}</span>
                <span class="stat-block-sub">${raceData.date}</span>
              </div>
            </div>

            <div style="padding: var(--space-3); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 11px; color: var(--text-muted); line-height: 1.6;">
              <span class="technical-label" style="font-size: 10px; display: block; margin-bottom: 2px;">ARCHIVE NOTICE</span>
              Summary confirmation retrieved from FIA Season Register. Complete lap-by-lap telemetry for Round ${raceData.round} is archived. Detailed 20-car sector tables are active for Round 17 (Azerbaijan) and Round 16 (Monza).
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. FULL DETAILED CLASSIFICATION (Rounds 16 & 17)
  const rows = raceData.results.map(r => {
    const isDNF = r.pos === "DNF";
    const posClass = r.pos === 1 ? 'p1' : (r.pos === 2 ? 'p2' : (r.pos === 3 ? 'p3' : ''));

    let gridDelta = '-';
    if (!isDNF && typeof r.grid === 'number' && typeof r.pos === 'number') {
      const diff = r.grid - r.pos;
      if (diff > 0) gridDelta = `<span class="pos-delta gain">▲${diff}</span>`;
      else if (diff < 0) gridDelta = `<span class="pos-delta loss">▼${Math.abs(diff)}</span>`;
      else gridDelta = `<span class="pos-delta neutral">-</span>`;
    }

    return `
      <tr>
        <td class="pos-cell">
          ${isDNF ? `<span class="badge-tag f1-red">DNF</span>` : `<span class="pos-badge ${posClass}">${r.pos}</span>`}
        </td>
        <td class="text-center font-mono text-muted">${r.grid || '-'}</td>
        <td class="text-center">${gridDelta}</td>
        <td>
          <div class="driver-cell">
            <span class="team-stripe" style="background-color: ${r.teamColor}"></span>
            <span class="driver-number">${r.number}</span>
            <span class="driver-full-name" style="font-weight: 700; color: var(--text-primary); font-size: 13px;">${r.driver}</span>
          </div>
        </td>
        <td class="text-muted">${r.team}</td>
        <td class="timing-cell font-mono">${r.time}</td>
        <td class="text-center font-mono">${r.pits}</td>
        <td class="text-center">
          ${r.fastestLap ? `<span class="sector-chip fastest">FL</span>` : `<span class="text-muted font-mono">-</span>`}
        </td>
        <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">
          ${r.points} <span class="text-muted" style="font-size: 10px;">PTS</span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="results-page">
      <!-- Round Filter Bar -->
      <div class="filter-bar">
        <div>
          <span class="technical-label">OFFICIAL CLASSIFICATION & RACE RESULTS</span>
          <div class="technical-subtext">${raceData.grandPrix.toUpperCase()} · ${raceData.circuit} · ${raceData.date}</div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center;">
          <select id="results-round-select" class="control-select" style="font-size: 11px; padding: 4px 8px;">
            ${dropdownOptionsHtml}
          </select>
        </div>
      </div>

      <div class="filter-btn-group" id="results-round-filter" style="margin-bottom: var(--space-4);">
        ${quickPillsHtml}
      </div>

      <!-- Classification Data Table -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="technical-label">FINAL CLASSIFICATION</span>
            <span class="panel-badge">FIA VERIFIED</span>
          </div>
          <div class="font-mono text-muted" style="font-size: 11px;">
            FASTEST LAP: ${raceData.fastestLap?.driver || 'Archived'} (${raceData.fastestLap?.time || '-'})
          </div>
        </div>

        <div class="panel-body no-padding">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 40px;">POS</th>
                  <th class="text-center" style="width: 40px;">GRID</th>
                  <th class="text-center" style="width: 44px;">+/-</th>
                  <th>DRIVER</th>
                  <th>CONSTRUCTOR</th>
                  <th>TIME / RETIRED</th>
                  <th class="text-center">PITS</th>
                  <th class="text-center">FASTEST</th>
                  <th class="text-right">POINTS</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindResultsEvents(onRoundSelect) {
  const buttons = document.querySelectorAll('#results-round-filter .filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const round = parseInt(btn.getAttribute('data-round'), 10);
      if (round && onRoundSelect) {
        onRoundSelect(round);
      }
    });
  });

  const select = document.getElementById('results-round-select');
  if (select) {
    select.addEventListener('change', (e) => {
      const round = parseInt(e.target.value, 10);
      if (round && onRoundSelect) {
        onRoundSelect(round);
      }
    });
  }
}
