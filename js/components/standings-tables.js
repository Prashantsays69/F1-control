/* ==========================================================================
   COMPONENT: STANDINGS TABLES
   Dense professional championship tables for drivers and constructors
   ========================================================================== */

export function renderDriversStandingsTable(drivers, limit = 8) {
  const displayDrivers = limit ? drivers.slice(0, limit) : drivers;

  const rows = displayDrivers.map(d => {
    let deltaHtml = `<span class="pos-delta neutral">-</span>`;
    if (d.posChange > 0) {
      deltaHtml = `<span class="pos-delta gain">▲${d.posChange}</span>`;
    } else if (d.posChange < 0) {
      deltaHtml = `<span class="pos-delta loss">▼${Math.abs(d.posChange)}</span>`;
    }

    const posClass = d.championshipPos === 1 ? 'p1' : (d.championshipPos === 2 ? 'p2' : (d.championshipPos === 3 ? 'p3' : ''));

    return `
      <tr>
        <td class="pos-cell">
          <span class="pos-badge ${posClass}">${d.championshipPos}</span>
        </td>
        <td>
          <div class="driver-cell">
            <span class="team-stripe" style="background-color: ${d.teamColor}"></span>
            <span class="driver-code">${d.code}</span>
            <span class="driver-full-name">${d.firstName} ${d.lastName}</span>
          </div>
        </td>
        <td class="text-muted">${d.teamName}</td>
        <td class="text-center">${deltaHtml}</td>
        <td class="text-center font-mono">${d.wins}</td>
        <td class="text-center font-mono">${d.podiums}</td>
        <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">
          ${d.points} <span class="text-muted" style="font-size: 10px;">PTS</span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th class="text-center" style="width: 36px;">POS</th>
            <th>DRIVER</th>
            <th>TEAM</th>
            <th class="text-center" style="width: 44px;">+/-</th>
            <th class="text-center">WINS</th>
            <th class="text-center">POD</th>
            <th class="text-right">POINTS</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

export function renderConstructorsStandingsTable(constructors, limit = 10) {
  const displayConstructors = limit ? constructors.slice(0, limit) : constructors;

  const rows = displayConstructors.map(c => {
    let trendHtml = `<span class="pos-delta neutral">-</span>`;
    if (c.trend.startsWith('+')) {
      trendHtml = `<span class="pos-delta gain">▲${c.trend.slice(1)}</span>`;
    } else if (c.trend.startsWith('-')) {
      trendHtml = `<span class="pos-delta loss">▼${c.trend.slice(1)}</span>`;
    }

    const posClass = c.pos === 1 ? 'p1' : (c.pos === 2 ? 'p2' : (c.pos === 3 ? 'p3' : ''));

    // Recent form pill list
    const formPills = c.recentResults.slice(0, 4).map(res => {
      const isWin = res === "1st";
      return `<span class="badge-tag ${isWin ? 'status-green' : ''}" style="padding: 1px 4px; font-size: 9px;">${res}</span>`;
    }).join(' ');

    return `
      <tr>
        <td class="pos-cell">
          <span class="pos-badge ${posClass}">${c.pos}</span>
        </td>
        <td>
          <div class="team-cell">
            <span class="team-stripe" style="background-color: ${c.color}"></span>
            <span style="font-weight: 700;">${c.shortName}</span>
          </div>
        </td>
        <td class="text-center">${trendHtml}</td>
        <td class="text-center font-mono">${c.wins}</td>
        <td class="text-center font-mono">${c.podiums}</td>
        <td>
          <div style="display: flex; gap: 3px;">
            ${formPills}
          </div>
        </td>
        <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">
          ${c.points} <span class="text-muted" style="font-size: 10px;">PTS</span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th class="text-center" style="width: 36px;">POS</th>
            <th>CONSTRUCTOR</th>
            <th class="text-center" style="width: 44px;">+/-</th>
            <th class="text-center">WINS</th>
            <th class="text-center">POD</th>
            <th>RECENT FORM</th>
            <th class="text-right">POINTS</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
