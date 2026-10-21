/* ==========================================================================
   VIEW: CIRCUITS
   Strict adherence to Section 8 of design.txt
   ========================================================================== */

import { dataService } from '../services/data-service.js';
import { renderTechnicalCircuitPanel } from '../components/technical-circuit.js';

export async function renderCircuitsView(circuitId) {
  const circuits = await dataService.getCircuits();
  
  // Resolve circuitId if omitted: derive dynamically from current season fixture
  let targetId = circuitId;
  if (!targetId) {
    const nextEvent = await dataService.getNextGrandPrix();
    targetId = nextEvent?.circuit?.id || circuits[0]?.id;
  }

  const circuit = await dataService.getCircuitById(targetId);

  // If circuit cannot be resolved, show an honest, recoverable state
  if (!circuit) {
    const fallbackId = circuits[0]?.id || 'silverstone';
    return `
      <div class="circuits-page">
        <div class="filter-bar">
          <div>
            <span class="technical-label">CIRCUIT TELEMETRY ARCHIVE</span>
            <div class="technical-subtext">TECHNICAL LAYOUTS & SENSOR METRICS</div>
          </div>
          <div class="filter-btn-group" id="circuits-filter-bar">
            ${circuits.map(c => `
              <button class="filter-btn" data-circuit-id="${c.id}">
                ${c.country.toUpperCase()} (${c.name.split(' ')[0]})
              </button>
            `).join('')}
          </div>
        </div>
        <div class="panel" style="padding: var(--space-8); text-align: center;">
          <div class="technical-label" style="font-size: 14px; margin-bottom: var(--space-2); color: var(--f1-red);">CIRCUIT RECORD UNAVAILABLE</div>
          <p class="text-secondary" style="font-size: 13px; max-width: 520px; margin: 0 auto var(--space-4); line-height: 1.6;">
            The requested circuit identifier "${targetId}" could not be resolved from official FIA records. Please select a verified circuit from the archive above.
          </p>
          <a href="#circuits/${fallbackId}" class="filter-btn active" style="display: inline-block;">LOAD VERIFIED ARCHIVE (${fallbackId.toUpperCase()})</a>
        </div>
      </div>
    `;
  }

  const selectedCircuitId = circuit.id;

  const circuitButtonsHtml = circuits.map(c => `
    <button class="filter-btn ${c.id === selectedCircuitId ? 'active' : ''}" data-circuit-id="${c.id}">
      ${c.country.toUpperCase()} (${c.name.split(' ')[0]})
    </button>
  `).join('');

  return `
    <div class="circuits-page">
      <!-- Selector Filter Bar -->
      <div class="filter-bar">
        <div>
          <span class="technical-label">CIRCUIT TELEMETRY ARCHIVE</span>
          <div class="technical-subtext">TECHNICAL LAYOUTS & SENSOR METRICS</div>
        </div>
        <div class="filter-btn-group" id="circuits-filter-bar">
          ${circuitButtonsHtml}
        </div>
      </div>

      <!-- Main Circuit Breakdown -->
      <div class="circuit-detail-grid">
        <!-- Technical Vector Map Panel -->
        ${renderTechnicalCircuitPanel(circuit, true)}

        <!-- Extended Technical Specifications Panel -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <span class="technical-label">${circuit.name.toUpperCase()}</span>
              <span class="panel-badge">PROFILE</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 11px;">ROUND ${circuit.round}</span>
          </div>

          <div class="panel-body">
            <div class="circuit-spec-list">
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">OFFICIAL GRAND PRIX</span>
                <span class="circuit-spec-value">${circuit.grandPrix}</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">LOCATION</span>
                <span class="circuit-spec-value">${circuit.city}, ${circuit.country}</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">CIRCUIT LENGTH</span>
                <span class="circuit-spec-value">${circuit.lengthKm}</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">TOTAL RACE LAPS</span>
                <span class="circuit-spec-value">${circuit.laps} Laps</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">RACE DISTANCE</span>
                <span class="circuit-spec-value">${circuit.raceDistanceKm}</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">CORNERS / APEXES</span>
                <span class="circuit-spec-value">${circuit.corners}</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">DRS DETECTION & ZONES</span>
                <span class="circuit-spec-value">${circuit.drsZones} ZONES</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">ELEVATION DELTA</span>
                <span class="circuit-spec-value">${circuit.elevationChangeM} Meters</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">THROTTLE PROFILE</span>
                <span class="circuit-spec-value">${circuit.fullThrottlePct} Full Throttle</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">TYRE STRESS INDEX</span>
                <span class="circuit-spec-value">${circuit.tyreStress}</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">AERODYNAMIC DOWNFORCE</span>
                <span class="circuit-spec-value">${circuit.downforceLevel}</span>
              </div>
              <div class="circuit-spec-row">
                <span class="circuit-spec-label">ALL-TIME LAP RECORD</span>
                <span class="circuit-spec-value font-mono" style="color: var(--text-primary); font-weight: 700;">
                  ${circuit.lapRecord.time} <span class="text-secondary" style="font-size: 11px; font-weight: 400;">(${circuit.lapRecord.driver}, ${circuit.lapRecord.year})</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindCircuitsEvents(onCircuitSelect) {
  const buttons = document.querySelectorAll('#circuits-filter-bar .filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-circuit-id');
      if (id) {
        onCircuitSelect(id);
      }
    });
  });
}
