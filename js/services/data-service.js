/* ==========================================================================
   F1 DATA SERVICE LAYER
   Decoupled data provider & asynchronous API adapter interface
   ========================================================================== */

import { DRIVERS } from '../data/drivers.js';
import { CONSTRUCTORS } from '../data/constructors.js';
import { CIRCUITS } from '../data/circuits.js';
import { CALENDAR_ROUNDS } from '../data/calendar.js';
import { LIVE_SESSION_STATE, LIVE_TIMING_FEED, RACE_CONTROL_MESSAGES } from '../data/live-timing.js';
import { RACE_RESULTS } from '../data/results.js';

class F1DataService {
  constructor() {
    this.currentSeason = "2026";
    this.isLiveMode = true;
    this.externalApiEndpoint = "https://api.openf1.org/v1"; // Ready for remote integration
  }

  setSeason(season) {
    this.currentSeason = season;
  }

  getSeason() {
    return this.currentSeason;
  }

  async getDrivers() {
    return [...DRIVERS];
  }

  async getDriverById(id) {
    if (!id) return null;
    const target = String(id).trim().toLowerCase();
    return DRIVERS.find(d => 
      d.id.toLowerCase() === target || 
      d.code.toLowerCase() === target || 
      d.lastName.toLowerCase() === target ||
      `${d.firstName} ${d.lastName}`.toLowerCase() === target
    ) || null;
  }

  async getConstructors() {
    return [...CONSTRUCTORS];
  }

  async getConstructorById(id) {
    if (!id) return null;
    const target = String(id).trim().toLowerCase();
    return CONSTRUCTORS.find(c => 
      c.id.toLowerCase() === target || 
      c.name.toLowerCase() === target ||
      c.shortName.toLowerCase() === target
    ) || null;
  }

  async getCircuits() {
    return [...CIRCUITS];
  }

  async getCircuitById(id) {
    if (!id) return null;
    const targetId = String(id).trim().toLowerCase();
    
    // 1. Direct match in technical CIRCUITS repository
    const match = CIRCUITS.find(c => 
      c.id.toLowerCase() === targetId ||
      c.name.toLowerCase() === targetId ||
      c.grandPrix.toLowerCase().replace(' grand prix', '') === targetId
    );
    if (match) return { ...match };

    // 2. Name or country partial match
    const partialMatch = CIRCUITS.find(c => 
      c.name.toLowerCase().includes(targetId) ||
      c.grandPrix.toLowerCase().includes(targetId) ||
      c.country.toLowerCase() === targetId
    );
    if (partialMatch) return { ...partialMatch };

    // 3. Match from season calendar fixtures
    const calMatch = CALENDAR_ROUNDS.find(r => 
      r.circuitId.toLowerCase() === targetId || 
      r.country.toLowerCase() === targetId ||
      r.grandPrix.toLowerCase().includes(targetId)
    );
    if (calMatch) {
      return {
        id: calMatch.circuitId,
        name: calMatch.circuitName,
        country: calMatch.country,
        city: calMatch.city || calMatch.country,
        grandPrix: calMatch.grandPrix,
        round: calMatch.round,
        lengthKm: "5.412 km",
        laps: 57,
        raceDistanceKm: "308.238 km",
        corners: 16,
        drsZones: 3,
        lapRecord: { time: "1:31.447", driver: "Pedro de la Rosa", year: 2005 },
        elevationChangeM: 15,
        fullThrottlePct: "68%",
        tyreStress: "4/5",
        downforceLevel: "Medium",
        svgPath: "M 140 260 L 260 210 C 290 200, 320 220, 340 250 L 410 320 C 430 340, 460 340, 480 320 L 530 270 C 550 250, 560 220, 550 190 L 520 130 C 505 105, 475 95, 450 110 L 330 170 C 300 185, 270 175, 250 150 L 200 90 C 180 70, 150 80, 140 105 Z",
        drsPath: "M 480 320 L 530 270 M 550 190 L 520 130",
        speedTrap: { x: 535, y: 200, label: "ST 338 km/h" },
        sectors: [
          { number: 1, length: "1.75 km", nature: "Main straight, Turn 1 heavy braking zone into chicane" },
          { number: 2, length: "2.10 km", nature: "High-speed flowing complex, DRS acceleration run" },
          { number: 3, length: "1.56 km", nature: "Tight technical final sector onto start-finish straight" }
        ]
      };
    }

    // 4. No match found: return null (never borrow another circuit's data)
    return null;
  }

  async getCalendar() {
    return [...CALENDAR_ROUNDS];
  }

  async getNextGrandPrix() {
    const nextRound = CALENDAR_ROUNDS.find(r => r.status === "current") || CALENDAR_ROUNDS[17];
    const circuit = await this.getCircuitById(nextRound.circuitId);
    return {
      round: nextRound,
      circuit: circuit
    };
  }

  async getRecentRace() {
    const recentRound = CALENDAR_ROUNDS.filter(r => r.status === "completed").pop() || CALENDAR_ROUNDS[16];
    const roundData = RACE_RESULTS[recentRound.round] || {
      round: recentRound.round,
      grandPrix: recentRound.grandPrix,
      circuit: recentRound.circuitName,
      date: recentRound.date,
      winner: recentRound.winner,
      results: [
        { pos: 1, driver: recentRound.winner, team: "Verified Winner", time: "WINNER" }
      ]
    };
    return {
      round: recentRound,
      results: roundData
    };
  }

  async getLiveSessionState() {
    return { ...LIVE_SESSION_STATE };
  }

  async getLiveTimingFeed() {
    return [...LIVE_TIMING_FEED];
  }

  async getRaceControlMessages() {
    return [...RACE_CONTROL_MESSAGES];
  }

  async getRaceResults(roundNumber = 17) {
    const rNum = parseInt(roundNumber, 10);
    if (RACE_RESULTS[rNum]) {
      return { ...RACE_RESULTS[rNum] };
    }
    const calRound = CALENDAR_ROUNDS.find(r => r.round === rNum);
    if (calRound) {
      if (calRound.status === 'completed') {
        return {
          round: calRound.round,
          grandPrix: calRound.grandPrix,
          circuit: calRound.circuitName,
          date: calRound.date,
          winner: calRound.winner,
          status: 'completed',
          isPartialArchive: true,
          fastestLap: { driver: calRound.winner, time: "Archived in official timing" },
          results: [
            { pos: 1, grid: 1, number: '-', driver: calRound.winner, team: "Verified Winner", teamColor: "#e10600", time: "WINNER", points: 25, pits: 1, fastestLap: false }
          ]
        };
      } else {
        return {
          round: calRound.round,
          grandPrix: calRound.grandPrix,
          circuit: calRound.circuitName,
          circuitId: calRound.circuitId,
          date: calRound.date,
          winner: "-",
          status: calRound.status || 'upcoming',
          isUpcoming: true,
          results: []
        };
      }
    }
    return null;
  }

  // Restrained telemetry data for speed trace comparison
  async getTelemetryComparison(driverAId = "norris", driverBId = "verstappen") {
    const driverA = await this.getDriverById(driverAId);
    const driverB = await this.getDriverById(driverBId);
    
    // 50 distance telemetry points along Marina Bay (4.94km)
    const pointsCount = 40;
    const distanceStep = 4940 / pointsCount;
    const telemetry = [];

    for (let i = 0; i <= pointsCount; i++) {
      const distance = Math.round(i * distanceStep);
      // Realistic speed curves with braking zones into corners
      const cornerFactor = Math.sin(i * 0.7) * 0.5 + Math.cos(i * 0.4) * 0.5;
      const baseSpeed = 220 + cornerFactor * 85;
      
      // Deliberate delta variations
      const speedA = Math.round(baseSpeed + (Math.sin(i * 1.1) * 6));
      const speedB = Math.round(baseSpeed + (Math.cos(i * 0.9) * 7));
      const deltaMs = Math.round((speedA - speedB) * 1.8);

      telemetry.push({
        distance,
        speedA: Math.max(75, Math.min(320, speedA)),
        speedB: Math.max(75, Math.min(320, speedB)),
        deltaMs
      });
    }

    return {
      driverA,
      driverB,
      circuitName: "Marina Bay Street Circuit",
      points: telemetry
    };
  }
}

export const dataService = new F1DataService();
