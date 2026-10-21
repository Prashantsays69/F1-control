/* ==========================================================================
   COMPONENT: TECHNICAL CIRCUIT PANEL
   Clean 2D vector technical circuit visualization with DRS zones & metrics
   ========================================================================== */

export function renderTechnicalCircuitPanel(circuit, showDetails = false) {
  const drsPathSvg = circuit.drsPath ? `
    <path class="drs-zone-path" d="${circuit.drsPath}" />
  ` : '';

  const speedTrapSvg = circuit.speedTrap ? `
    <circle cx="${circuit.speedTrap.x}" cy="${circuit.speedTrap.y}" r="4" class="speed-trap-dot" />
    <text x="${circuit.speedTrap.x + 8}" y="${circuit.speedTrap.y + 4}" class="chart-text" fill="#ff4d4f" font-weight="700">
      ${circuit.speedTrap.label}
    </text>
  ` : '';

  return `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="technical-label">CIRCUIT SPECIFICATION</span>
          <span class="panel-badge">${circuit.country}</span>
        </div>
        <span class="font-mono text-muted" style="font-size: 11px;">${circuit.corners} CORNERS · ${circuit.drsZones} DRS ZONES</span>
      </div>

      <div class="panel-body">
        <div style="position: relative; margin-bottom: var(--space-4);">
          <svg class="technical-circuit-svg" viewBox="50 80 600 450" preserveAspectRatio="xMidYMid meet">
            <!-- Grid reference overlay -->
            <defs>
              <pattern id="technical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#technical-grid)" />

            <!-- Track outline -->
            <path class="track-path" d="${circuit.svgPath}" />
            <path class="track-racing-line" d="${circuit.svgPath}" />
            ${drsPathSvg}
            ${speedTrapSvg}
          </svg>
          <div style="position: absolute; bottom: 8px; right: 12px; display: flex; gap: 12px; font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">
            <span style="display: flex; align-items: center; gap: 4px;">
              <span style="width: 10px; height: 2px; background: #fff; display: inline-block;"></span> RACING LINE
            </span>
            <span style="display: flex; align-items: center; gap: 4px;">
              <span style="width: 10px; height: 2px; background: var(--status-green); display: inline-block;"></span> DRS ACTIVATION
            </span>
            <span style="display: flex; align-items: center; gap: 4px;">
              <span style="width: 5px; height: 5px; border-radius: 50%; background: var(--f1-red); display: inline-block;"></span> SPEED TRAP
            </span>
          </div>
        </div>

        <div class="stat-grid">
          <div class="stat-block">
            <span class="stat-block-label">CIRCUIT LENGTH</span>
            <span class="stat-block-value">${circuit.lengthKm}</span>
            <span class="stat-block-sub">${circuit.corners} Turns</span>
          </div>
          <div class="stat-block">
            <span class="stat-block-label">RACE DISTANCE</span>
            <span class="stat-block-value">${circuit.raceDistanceKm}</span>
            <span class="stat-block-sub">${circuit.laps} Laps</span>
          </div>
          <div class="stat-block">
            <span class="stat-block-label">LAP RECORD</span>
            <span class="stat-block-value font-mono">${circuit.lapRecord.time}</span>
            <span class="stat-block-sub">${circuit.lapRecord.driver} (${circuit.lapRecord.year})</span>
          </div>
          <div class="stat-block">
            <span class="stat-block-label">FULL THROTTLE</span>
            <span class="stat-block-value">${circuit.fullThrottlePct}</span>
            <span class="stat-block-sub">Downforce: ${circuit.downforceLevel}</span>
          </div>
        </div>

        ${showDetails && circuit.sectors ? `
          <div style="margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);">
            <div class="technical-label" style="margin-bottom: 2px;">SECTOR BREAKDOWN</div>
            ${circuit.sectors.map(sec => `
              <div class="circuit-spec-row">
                <span style="display: flex; align-items: center; gap: 6px;">
                  <span class="badge-tag">SECTOR ${sec.number}</span>
                  <span class="text-secondary" style="font-size: 11px;">${sec.nature}</span>
                </span>
                <span class="circuit-spec-value">${sec.length}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
