/* ==========================================================================
   LIVE TIMING SIMULATION SERVICE
   Simulates authentic real-time telemetry updates, sector transitions,
   and track status changes for race control feel.
   ========================================================================== */

import { LIVE_TIMING_FEED, LIVE_SESSION_STATE } from '../data/live-timing.js';

class LiveSimulationService {
  constructor() {
    this.subscribers = [];
    this.timer = null;
    this.isRunning = true;
    this.tickIntervalMs = 2500;
    this.feed = JSON.parse(JSON.stringify(LIVE_TIMING_FEED));
    this.session = { ...LIVE_SESSION_STATE };
    this.tickCount = 0;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    // Initial emit
    callback({
      feed: this.feed,
      session: this.session,
      lastEvent: null
    });
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  start() {
    if (this.timer) return;
    this.isRunning = true;
    this.timer = setInterval(() => this.tick(), this.tickIntervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  setTrackStatus(status) {
    this.session.trackStatus = status;
    this.notify({ type: "TRACK_STATUS_CHANGE", status });
  }

  tick() {
    this.tickCount++;

    // Random micro telemetry updates (mimicking cars passing timing loops)
    const activeIndex = Math.floor(Math.random() * 8);
    const driver = this.feed[activeIndex];
    if (driver && !driver.inPit) {
      const sectors = ['s1', 's2', 's3'];
      const chosenSector = sectors[Math.floor(Math.random() * 3)];
      const randVal = (Math.random() * 0.08 - 0.04);
      
      const prevSecTime = parseFloat(driver[chosenSector].time);
      if (!isNaN(prevSecTime)) {
        const newSecTime = (prevSecTime + randVal).toFixed(3);
        driver[chosenSector].time = newSecTime;
        driver[chosenSector].status = randVal < -0.02 ? 'purple' : (randVal < 0 ? 'green' : 'yellow');
      }

      // Tyres wear
      if (this.tickCount % 4 === 0) {
        driver.tyre.age += 1;
      }
    }

    // Update clock
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.session.lastUpdated = `${hours}:${minutes}:${seconds}`;

    this.notify({
      type: "TELEMETRY_UPDATE",
      updatedDriverIndex: activeIndex
    });
  }

  notify(event) {
    this.subscribers.forEach(cb => {
      try {
        cb({
          feed: this.feed,
          session: this.session,
          lastEvent: event
        });
      } catch (err) {
        console.error("Simulation subscriber error:", err);
      }
    });
  }
}

export const liveSimulation = new LiveSimulationService();
// Auto start simulation
liveSimulation.start();
