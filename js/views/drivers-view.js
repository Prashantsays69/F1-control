/* ==========================================================================
   VIEW: DRIVER ANALYTICS
   Strict adherence to Section 7 of design.txt
   ========================================================================== */

import { dataService } from '../services/data-service.js';
import { renderProgressionChart, renderTeammateHeadToHead } from '../components/telemetry-charts.js';

let selectedDriverId = "norris";

export async function renderDriversView(driverId = selectedDriverId) {
  const drivers = await dataService.getDrivers();
  const targetId = driverId || drivers[0]?.id || "norris";
  const driver = await dataService.getDriverById(targetId);

  // If driver cannot be resolved
  if (!driver) {
    const fallbackId = drivers[0]?.id || "norris";
    return `
      <div class="drivers-page">
        <div class="filter-bar">
          <div class="technical-label">DRIVER ANALYTICS ARCHIVE</div>
          <div class="font-mono text-muted" style="font-size: 11px;">2026 FIA FORMULA 1 DRIVERS</div>
        </div>
        <div class="panel" style="padding: var(--space-8); text-align: center;">
          <div class="technical-label" style="font-size: 14px; margin-bottom: var(--space-2); color: var(--f1-red);">DRIVER RECORD UNAVAILABLE</div>
          <p class="text-secondary" style="font-size: 13px; max-width: 520px; margin: 0 auto var(--space-4); line-height: 1.6;">
            The requested driver identifier "${targetId}" could not be resolved from official 2026 superlicense registrations.
          </p>
          <a href="#drivers/${fallbackId}" class="filter-btn active" style="display: inline-block;">LOAD CHAMPIONSHIP LEADER (${fallbackId.toUpperCase()})</a>
        </div>
      </div>
    `;
  }

  selectedDriverId = driver.id;
  
  // Find teammate
  let teammate = null;
  if (driver.h2h && driver.h2h.teammateId) {
    teammate = await dataService.getDriverById(driver.h2h.teammateId);
  }

  // Driver cards selector grid
  const driverCardsHtml = drivers.map(d => {
    const isSelected = d.id === selectedDriverId;
    return `
      <div class="driver-card ${isSelected ? 'active' : ''}" data-driver-id="${d.id}">
        <span class="constructor-accent-bar" style="background-color: ${d.teamColor};"></span>
        <div class="driver-card-header">
          <span class="driver-card-pos">P${d.championshipPos}</span>
          <span class="driver-card-number">${d.number}</span>
        </div>
        <div class="driver-card-info">
          <div class="driver-card-name">${d.firstName} ${d.lastName}</div>
          <div class="driver-card-team">
            <span class="team-stripe" style="background-color: ${d.teamColor}"></span>
            <span>${d.teamName}</span>
          </div>
        </div>
        <div class="driver-card-stats">
          <div class="driver-card-stat-item">
            <span class="driver-card-stat-lbl">PTS</span>
            <span class="driver-card-stat-val">${d.points}</span>
          </div>
          <div class="driver-card-stat-item">
            <span class="driver-card-stat-lbl">WINS</span>
            <span class="driver-card-stat-val">${d.wins}</span>
          </div>
          <div class="driver-card-stat-item">
            <span class="driver-card-stat-lbl">POD</span>
            <span class="driver-card-stat-val">${d.podiums}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="drivers-page">
      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="technical-label">SELECT DRIVER TO INSPECT TELEMETRY & CAREER METRICS</div>
        <div class="font-mono text-muted" style="font-size: 11px;">2026 FIA FORMULA 1 DRIVERS</div>
      </div>

      <!-- Driver Cards Grid -->
      <div class="drivers-grid" id="drivers-selector-grid">
        ${driverCardsHtml}
      </div>

      <!-- Selected Driver Detailed Analytics Section -->
      <div class="driver-detail-container" id="driver-detail-area">
        <!-- Profile Banner -->
        <div class="driver-analytics-header">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 4px; height: 48px; background-color: ${driver.teamColor}; border-radius: 2px;"></div>
            <div>
              <div class="technical-label">${driver.teamName} · NO. ${driver.number} · ${driver.countryFlag} ${driver.country}</div>
              <h1 style="font-size: var(--text-2xl); font-weight: 800; color: var(--text-primary); margin: 2px 0;">
                ${driver.firstName.toUpperCase()} ${driver.lastName.toUpperCase()}
              </h1>
              <div class="technical-subtext font-mono">CHAMPIONSHIP STANDING: P${driver.championshipPos} WITH ${driver.points} POINTS</div>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <div class="stat-block" style="min-width: 90px; text-align: center;">
              <span class="stat-block-label">POLES</span>
              <span class="stat-block-value">${driver.poles}</span>
            </div>
            <div class="stat-block" style="min-width: 90px; text-align: center;">
              <span class="stat-block-label">FAST LAPS</span>
              <span class="stat-block-value">${driver.fastestLaps}</span>
            </div>
            <div class="stat-block" style="min-width: 90px; text-align: center;">
              <span class="stat-block-label">AVG QUALI</span>
              <span class="stat-block-value">${driver.avgQualifying}</span>
            </div>
            <div class="stat-block" style="min-width: 90px; text-align: center;">
              <span class="stat-block-label">AVG FINISH</span>
              <span class="stat-block-value">${driver.avgFinish}</span>
            </div>
            <div class="stat-block" style="min-width: 90px; text-align: center;">
              <span class="stat-block-label">DNFS</span>
              <span class="stat-block-value">${driver.dnfs}</span>
            </div>
          </div>
        </div>

        <!-- Analytical Charts Grid -->
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-4);">
          <!-- Points progression -->
          ${renderProgressionChart(driver, teammate)}

          <!-- Teammate Head to Head -->
          ${renderTeammateHeadToHead(driver, teammate)}
        </div>
      </div>
    </div>
  `;
}

export function bindDriversEvents(onDriverSelect) {
  const cards = document.querySelectorAll('.driver-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-driver-id');
      if (id) {
        onDriverSelect(id);
      }
    });
  });
}
