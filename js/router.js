/* ==========================================================================
   APP ROUTER
   Client-side hash routing with clean view lifecycles
   ========================================================================== */

import { renderOverviewView, bindOverviewEvents } from './views/overview-view.js';
import { renderLiveTimingView, bindLiveTimingEvents } from './views/live-timing-view.js';
import { renderDriversView, bindDriversEvents } from './views/drivers-view.js';
import { renderConstructorsView } from './views/constructors-view.js';
import { renderCalendarView } from './views/calendar-view.js';
import { renderCircuitsView, bindCircuitsEvents } from './views/circuits-view.js';
import { renderResultsView, bindResultsEvents } from './views/results-view.js';
import { renderAnalyticsView, bindAnalyticsEvents } from './views/analytics-view.js';
import { initHeaderCountdown } from './components/race-control-header.js';

class AppRouter {
  constructor() {
    this.currentRoute = 'overview';
    this.countdownTimer = null;
    this.viewportEl = document.getElementById('viewport-container');
    this.pageTitleEl = document.getElementById('current-page-title');
  }

  init() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    // Initial route
    this.handleHashChange();
  }

  async handleHashChange() {
    const rawHash = window.location.hash.replace('#', '') || 'overview';
    const [route, param] = rawHash.split('/');

    this.currentRoute = route;
    this.updateNavigationUI(route);
    await this.loadRoute(route, param);
  }

  updateNavigationUI(route) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const targetRoute = item.getAttribute('data-route');
      if (targetRoute === route) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Close mobile sidebar if open
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  }

  async loadRoute(route, param) {
    if (!this.viewportEl) return;

    // Clear previous timer if any
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    let viewHtml = '';
    let titleText = 'OVERVIEW';

    switch (route) {
      case 'overview':
        const targetRound = param ? parseInt(param, 10) : null;
        titleText = 'RACE CONTROL // OVERVIEW';
        viewHtml = await renderOverviewView(targetRound);
        this.viewportEl.innerHTML = viewHtml;
        bindOverviewEvents(roundNum => {
          window.location.hash = `overview/${roundNum}`;
        });
        this.countdownTimer = initHeaderCountdown();
        break;

      case 'live-timing':
        titleText = 'TELEMETRY // LIVE TIMING';
        viewHtml = await renderLiveTimingView();
        this.viewportEl.innerHTML = viewHtml;
        bindLiveTimingEvents();
        break;

      case 'drivers':
        titleText = 'CHAMPIONSHIP // DRIVER ANALYTICS';
        viewHtml = await renderDriversView(param || 'norris');
        this.viewportEl.innerHTML = viewHtml;
        bindDriversEvents(async (driverId) => {
          window.location.hash = `drivers/${driverId}`;
        });
        break;

      case 'constructors':
        titleText = 'CHAMPIONSHIP // CONSTRUCTORS';
        viewHtml = await renderConstructorsView();
        this.viewportEl.innerHTML = viewHtml;
        break;

      case 'calendar':
        titleText = 'SEASON 2026 // CALENDAR';
        viewHtml = await renderCalendarView();
        this.viewportEl.innerHTML = viewHtml;
        break;

      case 'circuits':
        titleText = 'CIRCUITS // TECHNICAL PROFILES';
        viewHtml = await renderCircuitsView(param);
        this.viewportEl.innerHTML = viewHtml;
        bindCircuitsEvents((circuitId) => {
          if (window.location.hash !== `#circuits/${circuitId}`) {
            window.location.hash = `circuits/${circuitId}`;
          }
        });
        break;

      case 'results':
        titleText = 'OFFICIAL RESULTS // CLASSIFICATION';
        viewHtml = await renderResultsView(param ? parseInt(param, 10) : 17);
        this.viewportEl.innerHTML = viewHtml;
        bindResultsEvents(async (roundNum) => {
          window.location.hash = `results/${roundNum}`;
        });
        break;

      case 'analytics':
        titleText = 'STRATEGY // TELEMETRY BENCHMARKING';
        const [driverA, driverB] = (param || '').split('-vs-');
        viewHtml = await renderAnalyticsView(driverA || 'norris', driverB || 'verstappen');
        this.viewportEl.innerHTML = viewHtml;
        bindAnalyticsEvents((dA, dB) => {
          window.location.hash = `analytics/${dA}-vs-${dB}`;
        });
        break;

      default:
        titleText = 'RACE CONTROL // OVERVIEW';
        viewHtml = await renderOverviewView();
        this.viewportEl.innerHTML = viewHtml;
        bindOverviewEvents(roundNum => {
          window.location.hash = `overview/${roundNum}`;
        });
        this.countdownTimer = initHeaderCountdown();
        break;
    }

    if (this.pageTitleEl) {
      this.pageTitleEl.textContent = titleText;
    }

    // Scroll to top
    this.viewportEl.scrollTop = 0;
  }
}

export const router = new AppRouter();
