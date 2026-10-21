/* ==========================================================================
   COMPONENT: RESTRAINED TELEMETRY CHARTS
   Strict Anti-Slop: Thin lines, subtle grid, no gradients, no glow, semantic colors.
   ========================================================================== */

export function renderProgressionChart(driver, teammate = null) {
  const points = driver.progression || [];
  const maxPts = 320;
  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Generate path data for driver
  const coordsDriver = points.map((val, idx) => {
    const x = padding.left + (idx / (points.length - 1)) * chartW;
    const y = padding.top + chartH - (val / maxPts) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathDriver = `M ${coordsDriver.join(' L ')}`;

  // Teammate path if available
  let pathTeammate = '';
  if (teammate && teammate.progression) {
    const coordsTeammate = teammate.progression.map((val, idx) => {
      const x = padding.left + (idx / (points.length - 1)) * chartW;
      const y = padding.top + chartH - (val / maxPts) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    pathTeammate = `M ${coordsTeammate.join(' L ')}`;
  }

  // Grid lines (subtle, 1px)
  const ySteps = [0, 100, 200, 300];
  const gridLines = ySteps.map(step => {
    const y = padding.top + chartH - (step / maxPts) * chartH;
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid-line" />
      <text x="${padding.left - 8}" y="${y + 3}" class="chart-text" text-anchor="end">${step}</text>
    `;
  }).join('');

  // X labels (rounds 1, 5, 10, 15)
  const xLabels = [1, 5, 10, 15].map(round => {
    const idx = round - 1;
    const x = padding.left + (idx / (points.length - 1)) * chartW;
    return `
      <text x="${x}" y="${height - 10}" class="chart-text" text-anchor="middle">R${round}</text>
    `;
  }).join('');

  return `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="technical-label">CHAMPIONSHIP POINTS PROGRESSION</span>
          <span class="panel-badge">ROUNDS 1–15</span>
        </div>
        <div style="display: flex; gap: 12px; font-size: 11px; font-family: var(--font-mono);">
          <span style="display: flex; align-items: center; gap: 4px;">
            <span style="width: 12px; height: 2px; background: ${driver.teamColor}; display: inline-block;"></span>
            ${driver.code} (${driver.points} pts)
          </span>
          ${teammate ? `
            <span style="display: flex; align-items: center; gap: 4px; color: var(--text-muted);">
              <span style="width: 12px; height: 2px; background: #888; border-top: 1px dashed; display: inline-block;"></span>
              ${teammate.code} (${teammate.points} pts)
            </span>
          ` : ''}
        </div>
      </div>
      <div class="panel-body">
        <div class="chart-container">
          <svg class="technical-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            ${gridLines}
            ${xLabels}
            ${pathTeammate ? `
              <path d="${pathTeammate}" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-dasharray="4 2" />
            ` : ''}
            <path d="${pathDriver}" class="chart-data-line" stroke="${driver.teamColor}" />
            <!-- Final point dot -->
            <circle cx="${coordsDriver[coordsDriver.length - 1].split(',')[0]}" cy="${coordsDriver[coordsDriver.length - 1].split(',')[1]}" r="3.5" fill="${driver.teamColor}" />
          </svg>
        </div>
      </div>
    </div>
  `;
}

export function renderSpeedTraceChart(telemetryData) {
  const pts = telemetryData.points || [];
  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 25, bottom: 35, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minSpeed = 60;
  const maxSpeed = 340;
  const speedRange = maxSpeed - minSpeed;

  const coordsA = pts.map((p, idx) => {
    const x = padding.left + (idx / (pts.length - 1)) * chartW;
    const y = padding.top + chartH - ((p.speedA - minSpeed) / speedRange) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathA = `M ${coordsA.join(' L ')}`;

  const coordsB = pts.map((p, idx) => {
    const x = padding.left + (idx / (pts.length - 1)) * chartW;
    const y = padding.top + chartH - ((p.speedB - minSpeed) / speedRange) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathB = `M ${coordsB.join(' L ')}`;

  // Grid steps (100, 200, 300 km/h)
  const ySteps = [100, 200, 300];
  const gridLines = ySteps.map(spd => {
    const y = padding.top + chartH - ((spd - minSpeed) / speedRange) * chartH;
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid-line" />
      <text x="${padding.left - 8}" y="${y + 3}" class="chart-text" text-anchor="end">${spd}</text>
    `;
  }).join('');

  // X distance markers (0, 1500, 3000, 4500m)
  const distMarkers = [0, 1500, 3000, 4500].map(dist => {
    const x = padding.left + (dist / 4940) * chartW;
    return `
      <text x="${x}" y="${height - 12}" class="chart-text" text-anchor="middle">${dist}m</text>
    `;
  }).join('');

  return `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="technical-label">TELEMETRY SPEED TRACE</span>
          <span class="panel-badge">${telemetryData.circuitName}</span>
        </div>
        <div style="display: flex; gap: 14px; font-size: 11px; font-family: var(--font-mono);">
          <span style="display: flex; align-items: center; gap: 5px;">
            <span style="width: 12px; height: 2px; background: ${telemetryData.driverA.teamColor}; display: inline-block;"></span>
            ${telemetryData.driverA.code} (${telemetryData.driverA.lastName || telemetryData.driverA.name || 'A'})
          </span>
          <span style="display: flex; align-items: center; gap: 5px;">
            <span style="width: 12px; height: 2px; background: ${telemetryData.driverB.teamColor}; display: inline-block;"></span>
            ${telemetryData.driverB.code} (${telemetryData.driverB.lastName || telemetryData.driverB.name || 'B'})
          </span>
        </div>
      </div>
      <div class="panel-body">
        <div class="chart-container">
          <svg class="technical-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            ${gridLines}
            ${distMarkers}
            <path d="${pathB}" class="chart-data-line" stroke="${telemetryData.driverB.teamColor}" stroke-dasharray="3 2" />
            <path d="${pathA}" class="chart-data-line" stroke="${telemetryData.driverA.teamColor}" />
          </svg>
        </div>
      </div>
    </div>
  `;
}

export function renderTeammateHeadToHead(driver, teammate) {
  if (!driver || !teammate) return '';

  const h2h = driver.h2h || { raceAhead: 8, qualiAhead: 7, pointsShare: 50 };
  const totalRaces = 15;
  const raceAheadPct = ((h2h.raceAhead / totalRaces) * 100).toFixed(0);
  const raceBehindPct = (100 - raceAheadPct).toFixed(0);

  const qualiAheadPct = ((h2h.qualiAhead / totalRaces) * 100).toFixed(0);
  const qualiBehindPct = (100 - qualiAheadPct).toFixed(0);

  return `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="technical-label">TEAMMATE HEAD-TO-HEAD</span>
          <span class="panel-badge">${driver.teamName}</span>
        </div>
        <div class="font-mono text-muted" style="font-size: 11px;">${driver.code} VS ${teammate.code}</div>
      </div>

      <div class="panel-body">
        <div class="h2h-container">
          <!-- Race Ahead -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;" class="font-mono">
              <span style="color: var(--text-primary); font-weight: 700;">${driver.code} (${h2h.raceAhead})</span>
              <span class="technical-label" style="font-size: 10px;">RACE FINISHES AHEAD</span>
              <span style="color: var(--text-secondary); font-weight: 700;">${teammate.code} (${totalRaces - h2h.raceAhead})</span>
            </div>
            <div class="h2h-bar-wrapper">
              <div class="h2h-bar-left" style="width: ${raceAheadPct}%; background-color: ${driver.teamColor};"></div>
              <div class="h2h-bar-right" style="width: ${raceBehindPct}%; background-color: var(--border-strong);"></div>
            </div>
          </div>

          <!-- Quali Ahead -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;" class="font-mono">
              <span style="color: var(--text-primary); font-weight: 700;">${driver.code} (${h2h.qualiAhead})</span>
              <span class="technical-label" style="font-size: 10px;">QUALIFYING AHEAD</span>
              <span style="color: var(--text-secondary); font-weight: 700;">${teammate.code} (${totalRaces - h2h.qualiAhead})</span>
            </div>
            <div class="h2h-bar-wrapper">
              <div class="h2h-bar-left" style="width: ${qualiAheadPct}%; background-color: ${driver.teamColor};"></div>
              <div class="h2h-bar-right" style="width: ${qualiBehindPct}%; background-color: var(--border-strong);"></div>
            </div>
          </div>

          <!-- Points Share -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;" class="font-mono">
              <span style="color: var(--text-primary); font-weight: 700;">${h2h.pointsShare}%</span>
              <span class="technical-label" style="font-size: 10px;">TEAM POINTS SHARE</span>
              <span style="color: var(--text-secondary); font-weight: 700;">${(100 - h2h.pointsShare).toFixed(1)}%</span>
            </div>
            <div class="h2h-bar-wrapper">
              <div class="h2h-bar-left" style="width: ${h2h.pointsShare}%; background-color: ${driver.teamColor};"></div>
              <div class="h2h-bar-right" style="width: ${100 - h2h.pointsShare}%; background-color: var(--border-strong);"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
