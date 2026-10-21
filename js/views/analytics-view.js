/* ==========================================================================
   VIEW: TELEMETRY & STRATEGY ANALYTICS
   Strict adherence to Sections 7 & 10 of design.txt
   ========================================================================== */

import { dataService } from '../services/data-service.js';
import { renderSpeedTraceChart } from '../components/telemetry-charts.js';

let currentDriverA = "norris";
let currentDriverB = "verstappen";

export async function renderAnalyticsView(driverAId = currentDriverA, driverBId = currentDriverB) {
  currentDriverA = driverAId;
  currentDriverB = driverBId;
  const drivers = await dataService.getDrivers();
  const telemetry = await dataService.getTelemetryComparison(currentDriverA, currentDriverB);

  // Driver comparison options
  const optionsA = drivers.map(d => `
    <option value="${d.id}" ${d.id === currentDriverA ? 'selected' : ''}>
      ${d.firstName} ${d.lastName} (${d.code}) - ${d.teamName}
    </option>
  `).join('');

  const optionsB = drivers.map(d => `
    <option value="${d.id}" ${d.id === currentDriverB ? 'selected' : ''}>
      ${d.firstName} ${d.lastName} (${d.code}) - ${d.teamName}
    </option>
  `).join('');

  // Qualifying teammate delta analysis (in milliseconds)
  const qualiDeltas = [
    { team: "McLaren", pair: "NOR vs PIA", deltaMs: -128, leader: "NOR", color: "#ff8000" },
    { team: "Red Bull Racing", pair: "VER vs PER", deltaMs: -542, leader: "VER", color: "#1e41ff" },
    { team: "Ferrari", pair: "LEC vs SAI", deltaMs: -89, leader: "LEC", color: "#e80020" },
    { team: "Mercedes", pair: "RUS vs HAM", deltaMs: -45, leader: "RUS", color: "#00a19c" },
    { team: "Aston Martin", pair: "ALO vs STR", deltaMs: -410, leader: "ALO", color: "#229971" },
    { team: "Haas", pair: "HUL vs MAG", deltaMs: -215, leader: "HUL", color: "#b6babd" },
    { team: "Williams", pair: "ALB vs COL", deltaMs: -110, leader: "ALB", color: "#64c4ff" },
    { team: "RB", pair: "TSU vs RIC", deltaMs: -95, leader: "TSU", color: "#6692ff" }
  ];

  const deltaRowsHtml = qualiDeltas.map(d => `
    <div style="display: grid; grid-template-columns: 140px 120px 1fr 90px; align-items: center; gap: 12px; padding: 6px 12px; border-bottom: 1px solid var(--border-subtle);">
      <span style="display: flex; align-items: center; gap: 6px;">
        <span class="team-stripe" style="background-color: ${d.color};"></span>
        <span style="font-weight: 700; font-size: 11px;">${d.team}</span>
      </span>
      <span class="font-mono text-muted" style="font-size: 11px;">${d.pair}</span>
      <div style="background: var(--bg-surface-elevated); height: 6px; border-radius: 2px; overflow: hidden; position: relative;">
        <div style="width: ${Math.min(100, Math.abs(d.deltaMs) / 6)}%; height: 100%; background-color: ${d.color};"></div>
      </div>
      <span class="font-mono text-right" style="font-size: 11px; font-weight: 700; color: var(--status-green);">
        ${d.deltaMs} ms (${d.leader})
      </span>
    </div>
  `).join('');

  return `
    <div class="analytics-page">
      <div class="filter-bar">
        <div>
          <span class="technical-label">TELEMETRY & STRATEGY BENCHMARKING</span>
          <div class="technical-subtext">DIRECT SENSOR OVERLAY & QUALIFYING DELTAS</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <label class="technical-label" style="font-size: 10px;">COMPARE:</label>
          <select id="telemetry-select-a" class="control-select" style="font-size: 11px; padding: 4px 8px;">
            ${optionsA}
          </select>
          <span class="font-mono text-muted" style="font-size: 11px;">VS</span>
          <select id="telemetry-select-b" class="control-select" style="font-size: 11px; padding: 4px 8px;">
            ${optionsB}
          </select>
        </div>
      </div>

      <!-- Restrained Telemetry Speed Trace -->
      <div style="margin-bottom: var(--space-4);" id="telemetry-chart-container">
        ${renderSpeedTraceChart(telemetry)}
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-4);">
        <!-- Teammate Qualifying Deltas -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <span class="technical-label">TEAMMATE QUALIFYING GAP</span>
              <span class="panel-badge">SEASON AVERAGE (MS)</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 10px;">LOWER DELTA = CLOSER</span>
          </div>

          <div class="panel-body no-padding">
            ${deltaRowsHtml}
          </div>
        </div>

        <!-- Tyre Degradation Index -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <span class="technical-label">TYRE COMPOUND DEGRADATION MATRIX</span>
              <span class="panel-badge">SINGAPORE GP MODEL</span>
            </div>
            <span class="font-mono text-muted" style="font-size: 10px;">PER-LAP PACE LOSS</span>
          </div>

          <div class="panel-body">
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              <div class="circuit-spec-row">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <span class="tyre-badge soft">S</span>
                  <span style="font-weight: 700; font-size: 11px;">C5 SOFT COMPOUND</span>
                </span>
                <span class="circuit-spec-value" style="color: var(--f1-red);">+0.125s / LAP (CLIFF: LAP 16)</span>
              </div>

              <div class="circuit-spec-row">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <span class="tyre-badge medium">M</span>
                  <span style="font-weight: 700; font-size: 11px;">C4 MEDIUM COMPOUND</span>
                </span>
                <span class="circuit-spec-value" style="color: var(--sector-yellow);">+0.078s / LAP (CLIFF: LAP 28)</span>
              </div>

              <div class="circuit-spec-row">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <span class="tyre-badge hard">H</span>
                  <span style="font-weight: 700; font-size: 11px;">C3 HARD COMPOUND</span>
                </span>
                <span class="circuit-spec-value" style="color: var(--status-green);">+0.042s / LAP (CLIFF: LAP 42)</span>
              </div>

              <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted); line-height: 1.5;">
                <div class="technical-label" style="margin-bottom: 4px;">RECOMMENDED STRATEGY</div>
                <div>Optimal 1-Stop: MEDIUM (Start) → HARD (Pit Window: Lap 22–27). Projected delta to 2-stop: -4.8 seconds over 62 laps.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindAnalyticsEvents(onCompareChange) {
  const selA = document.getElementById('telemetry-select-a');
  const selB = document.getElementById('telemetry-select-b');
  
  const handleChange = () => {
    if (selA && selB && onCompareChange) {
      onCompareChange(selA.value, selB.value);
    }
  };

  if (selA) selA.addEventListener('change', handleChange);
  if (selB) selB.addEventListener('change', handleChange);
}
