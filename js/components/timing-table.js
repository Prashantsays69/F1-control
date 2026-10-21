/* ==========================================================================
   COMPONENT: TIMING TABLE
   High-density motorsport telemetry and timing tables
   ========================================================================== */

export function renderTimingTable(driversFeed, isCompact = false) {
  const displayDrivers = isCompact ? driversFeed.slice(0, 8) : driversFeed;

  const rows = displayDrivers.map(d => {
    const posClass = d.pos === 1 ? 'p1' : (d.pos === 2 ? 'p2' : (d.pos === 3 ? 'p3' : ''));
    const tyreCompound = d.tyre.compound;
    const tyreLetter = tyreCompound[0].toUpperCase();

    return `
      <tr class="${d.inPit ? 'in-pit-row' : ''}">
        <td class="pos-cell">
          <span class="pos-badge ${posClass}">${d.pos}</span>
        </td>
        <td>
          <div class="driver-cell">
            <span class="team-stripe" style="background-color: ${d.teamColor}"></span>
            <span class="driver-number">${d.carNumber}</span>
            <div class="driver-code-flag">
              <span class="driver-code">${d.code}</span>
              <span class="driver-full-name">${d.driverName}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="team-cell">
            <span>${d.team}</span>
          </div>
        </td>
        <td class="text-center font-mono">${d.lap}</td>
        <td class="timing-cell font-mono ${d.bestLapOverall ? 'best-lap' : ''}">${d.lapTime}</td>
        <td class="gap-cell font-mono ${d.gap === 'LEADER' ? 'leader' : ''}">${d.gap}</td>
        ${!isCompact ? `
          <td class="gap-cell font-mono">${d.interval}</td>
          <td>
            <div class="sector-cell-group">
              <span class="sector-chip ${d.s1.status}">${d.s1.time}</span>
              <span class="sector-chip ${d.s2.status}">${d.s2.time}</span>
              <span class="sector-chip ${d.s3.status}">${d.s3.time}</span>
            </div>
          </td>
        ` : ''}
        <td class="text-center">
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span class="tyre-badge ${tyreCompound}" title="${tyreCompound.toUpperCase()} (${d.tyre.age} Laps)">
              ${tyreLetter}
            </span>
            <span class="font-mono text-muted" style="font-size: 10px;">${d.tyre.age}L</span>
          </div>
        </td>
        ${!isCompact ? `
          <td class="text-center font-mono">${d.pits}</td>
          <td class="text-right font-mono text-muted">${d.speedTrapKmh > 0 ? d.speedTrapKmh.toFixed(1) : '-'}</td>
          <td class="text-center font-mono" style="font-size: 10px;">
            ${d.inPit ? '<span class="badge-tag status-amber">PIT</span>' : '<span class="badge-tag status-green">TRACK</span>'}
          </td>
        ` : ''}
      </tr>
    `;
  }).join('');

  return `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th class="text-center" style="width: 40px;">POS</th>
            <th>DRIVER</th>
            <th>TEAM</th>
            <th class="text-center">LAP</th>
            <th>TIME</th>
            <th>GAP</th>
            ${!isCompact ? `
              <th>INT</th>
              <th>SECTORS (S1 / S2 / S3)</th>
            ` : ''}
            <th class="text-center">TYRE</th>
            ${!isCompact ? `
              <th class="text-center">PITS</th>
              <th class="text-right">ST (KM/H)</th>
              <th class="text-center">STATUS</th>
            ` : ''}
          </tr>
        </thead>
        <tbody id="timing-table-body">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
