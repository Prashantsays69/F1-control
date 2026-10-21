/* ==========================================================================
   VIEW: CALENDAR
   Strict adherence to Section 8 of design.txt
   ========================================================================== */

import { dataService } from '../services/data-service.js';

export async function renderCalendarView() {
  const calendar = await dataService.getCalendar();

  const cardsHtml = calendar.map(item => {
    let statusBadge = '';
    if (item.status === 'completed') {
      statusBadge = `<span class="badge-tag">COMPLETED</span>`;
    } else if (item.status === 'current') {
      statusBadge = `<span class="badge-tag f1-red">● CURRENT ROUND</span>`;
    } else {
      statusBadge = `<span class="badge-tag status-amber">UPCOMING</span>`;
    }

    return `
      <div class="calendar-card ${item.status}">
        <div class="calendar-round">
          <span>ROUND ${String(item.round).padStart(2, '0')}</span>
        </div>
        
        <div class="calendar-event">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>${item.flag}</span>
            <span class="calendar-gp-name">${item.grandPrix}</span>
          </div>
          <span class="calendar-circuit-name">${item.circuitName} · ${item.country}</span>
        </div>

        <div class="calendar-date">
          <span>${item.date}</span>
        </div>

        <div class="circuit-spec font-mono text-muted" style="font-size: 11px;">
          ${item.winner !== '-' ? `
            <span style="color: var(--text-primary); font-weight: 600;">WIN: ${item.winner}</span>
          ` : `<span>SCHEDULED</span>`}
        </div>

        <div class="calendar-status">
          ${statusBadge}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="calendar-page">
      <div class="filter-bar">
        <div>
          <span class="technical-label">2026 FIA FORMULA ONE WORLD CHAMPIONSHIP CALENDAR</span>
          <div class="technical-subtext">24 ROUNDS CHRONOLOGICAL SCHEDULE</div>
        </div>
        <div style="display: flex; gap: 12px; font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">
          <span>COMPLETED: 17</span>
          <span style="color: var(--f1-red);">CURRENT: 1</span>
          <span>UPCOMING: 6</span>
        </div>
      </div>

      <div class="calendar-list">
        ${cardsHtml}
      </div>
    </div>
  `;
}
