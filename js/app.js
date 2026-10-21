/* ==========================================================================
   F1 // CONTROL APPLICATION ENTRY POINT
   Professional race control shell controller & live telemetry bindings
   ========================================================================== */

import { router } from './router.js';
import { liveSimulation } from './services/live-simulation-service.js';
import { dataService } from './services/data-service.js';

class F1DashboardApp {
  constructor() {
    this.topbarClockEl = document.getElementById('data-clock');
    this.trackFlagEl = document.getElementById('topbar-flag-indicator');
    this.seasonSelectorEl = document.getElementById('season-selector');
    this.mobileToggleEl = document.getElementById('mobile-nav-toggle');
    this.sidebarEl = document.getElementById('app-sidebar');
  }

  init() {
    // 1. Initialize client-side router
    router.init();

    // 2. Setup mobile sidebar toggle
    if (this.mobileToggleEl && this.sidebarEl) {
      this.mobileToggleEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sidebarEl.classList.toggle('open');
      });

      // Close when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (this.sidebarEl.classList.contains('open') && !this.sidebarEl.contains(e.target) && e.target !== this.mobileToggleEl) {
          this.sidebarEl.classList.remove('open');
        }
      });
    }

    // 3. Season selector listener
    if (this.seasonSelectorEl) {
      this.seasonSelectorEl.addEventListener('change', (e) => {
        const season = e.target.value;
        dataService.setSeason(season);
        const seasonDisplay = document.getElementById('topbar-season-display');
        if (seasonDisplay) seasonDisplay.textContent = `${season} SEASON`;
      });
    }

    // 4. Subscribe to Live Simulation Service
    liveSimulation.subscribe(({ feed, session, lastEvent }) => {
      this.handleLiveTelemetryUpdate(feed, session, lastEvent);
    });

    console.info("F1 // CONTROL race control system online.");
  }

  handleLiveTelemetryUpdate(feed, session, lastEvent) {
    // Update topbar clock
    if (this.topbarClockEl) {
      this.topbarClockEl.textContent = session.lastUpdated;
    }

    // Update topbar track status badge
    if (this.trackFlagEl) {
      const status = session.trackStatus;
      this.trackFlagEl.className = 'track-flag-indicator';
      if (status === 'GREEN') {
        // default
      } else if (status === 'YELLOW') {
        this.trackFlagEl.classList.add('caution');
      } else if (status === 'SC') {
        this.trackFlagEl.classList.add('safety-car');
      } else if (status === 'RED') {
        this.trackFlagEl.classList.add('red-flag');
      }

      const flagText = this.trackFlagEl.querySelector('.flag-name');
      if (flagText) {
        flagText.textContent = `TRACK ${status}`;
      }
    }

    // If currently on Overview or Live Timing page and timing table is in DOM,
    // update timing cells surgically
    const activeRoute = router.currentRoute;
    if (activeRoute === 'overview') {
      const p1TimeEl = document.querySelector('#overview-live-table-container tbody tr:first-child .timing-cell');
      if (p1TimeEl && feed[0]) {
        p1TimeEl.textContent = feed[0].lapTime;
      }
    } else if (activeRoute === 'live-timing' && lastEvent && lastEvent.type === 'TELEMETRY_UPDATE') {
      const idx = lastEvent.updatedDriverIndex;
      const driver = feed[idx];
      if (driver) {
        const rows = document.querySelectorAll('#live-timing-table-wrapper tbody tr');
        const targetRow = rows[idx];
        if (targetRow) {
          // Update sector chips if present
          const sectorChips = targetRow.querySelectorAll('.sector-chip');
          if (sectorChips.length >= 3) {
            sectorChips[0].textContent = driver.s1.time;
            sectorChips[0].className = `sector-chip ${driver.s1.status}`;
            sectorChips[1].textContent = driver.s2.time;
            sectorChips[1].className = `sector-chip ${driver.s2.status}`;
            sectorChips[2].textContent = driver.s3.time;
            sectorChips[2].className = `sector-chip ${driver.s3.status}`;
          }
        }
      }
    }
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new F1DashboardApp();
  app.init();
});
