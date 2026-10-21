/* ==========================================================================
   VIEW: CONSTRUCTORS CHAMPIONSHIP
   Full constructor profiles, engineering specs, power units & driver pairings
   ========================================================================== */

import { dataService } from '../services/data-service.js';

export async function renderConstructorsView() {
  const constructors = await dataService.getConstructors();
  const drivers = await dataService.getDrivers();

  const cardsHtml = constructors.map(c => {
    // Get drivers for this constructor
    const teamDrivers = drivers.filter(d => c.drivers.includes(d.id));

    const driverPairHtml = teamDrivers.map(d => `
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
        <span style="display: flex; align-items: center; gap: 6px;">
          <span class="font-mono text-muted">#${d.number}</span>
          <span style="font-weight: 700; color: var(--text-primary);">${d.firstName} ${d.lastName}</span>
        </span>
        <span class="font-mono" style="font-weight: 700; color: var(--text-primary);">${d.points} PTS</span>
      </div>
    `).join('');

    const recentFormBadges = c.recentResults.map(res => `
      <span class="badge-tag ${res === '1st' ? 'status-green' : ''}" style="padding: 1px 5px; font-size: 9px;">${res}</span>
    `).join(' ');

    return `
      <div class="constructor-card">
        <span class="constructor-accent-bar" style="background-color: ${c.color};"></span>
        <div class="constructor-card-top">
          <div>
            <div class="technical-label" style="margin-bottom: 2px;">ROUND 18 STANDINGS</div>
            <div class="constructor-card-title">${c.name}</div>
            <div class="technical-subtext">${c.base}</div>
          </div>
          <div style="text-align: right;">
            <div class="constructor-card-pos">P${c.pos}</div>
            <div class="font-mono" style="font-weight: 800; color: var(--text-primary); font-size: var(--text-lg);">
              ${c.points} <span class="text-muted" style="font-size: 11px;">PTS</span>
            </div>
          </div>
        </div>

        <!-- Driver pairing -->
        <div class="constructor-driver-pair">
          <div class="technical-label" style="font-size: 10px; margin-bottom: 4px;">DRIVER LINEUP</div>
          ${driverPairHtml}
        </div>

        <!-- Technical specs -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
          <div class="circuit-spec-row" style="padding: 4px 8px;">
            <span class="text-muted">CHASSIS</span>
            <span class="font-mono" style="font-weight: 700; color: var(--text-primary);">${c.chassis}</span>
          </div>
          <div class="circuit-spec-row" style="padding: 4px 8px;">
            <span class="text-muted">POWER UNIT</span>
            <span class="font-mono" style="font-weight: 700; color: var(--text-primary);">${c.powerUnit.split(' ')[0]}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 10px; font-size: 11px;">
          <div style="display: flex; gap: 4px; align-items: center;">
            <span class="text-muted" style="font-size: 10px;">RECENT:</span>
            ${recentFormBadges}
          </div>
          <div class="font-mono text-muted" style="font-size: 11px;">
            ${c.wins} WINS · ${c.podiums} PODIUMS
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="constructors-page">
      <div class="filter-bar">
        <div class="technical-label">2026 CONSTRUCTORS WORLD CHAMPIONSHIP</div>
        <div class="font-mono text-muted" style="font-size: 11px;">10 CONSTRUCTORS REGISTERED</div>
      </div>

      <div class="constructors-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
