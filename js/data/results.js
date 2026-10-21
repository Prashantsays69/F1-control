/* ==========================================================================
   F1 DATA ARCHITECTURE - RACE RESULTS
   Detailed race results with finishing positions, grid deltas, points & fastest laps
   ========================================================================== */

export const RACE_RESULTS = {
  17: {
    round: 17,
    grandPrix: "Azerbaijan Grand Prix",
    circuit: "Baku City Circuit",
    date: "15 SEP 2026",
    winner: "Oscar Piastri",
    fastestLap: { driver: "Lando Norris", time: "1:45.255", lap: 42 },
    results: [
      { pos: 1, grid: 2, number: 81, driver: "Oscar Piastri", team: "McLaren", teamColor: "#ff8000", time: "1:32:58.007", points: 25, pits: 1 },
      { pos: 2, grid: 1, number: 16, driver: "Charles Leclerc", team: "Ferrari", teamColor: "#e80020", time: "+10.910", points: 18, pits: 1 },
      { pos: 3, grid: 4, number: 63, driver: "George Russell", team: "Mercedes", teamColor: "#00a19c", time: "+31.328", points: 15, pits: 1 },
      { pos: 4, grid: 15, number: 4, driver: "Lando Norris", team: "McLaren", teamColor: "#ff8000", time: "+36.143", points: 13, pits: 1, fastestLap: true },
      { pos: 5, grid: 6, number: 1, driver: "Max Verstappen", team: "Red Bull Racing", teamColor: "#1e41ff", time: "+1:17.098", points: 10, pits: 2 },
      { pos: 6, grid: 7, number: 14, driver: "Fernando Alonso", team: "Aston Martin", teamColor: "#229971", time: "+1:25.468", points: 8, pits: 1 },
      { pos: 7, grid: 9, number: 23, driver: "Alexander Albon", team: "Williams", teamColor: "#64c4ff", time: "+1:27.396", points: 6, pits: 1 },
      { pos: 8, grid: 8, number: 43, driver: "Franco Colapinto", team: "Williams", teamColor: "#64c4ff", time: "+1:29.541", points: 4, pits: 1 },
      { pos: 9, grid: 7, number: 44, driver: "Lewis Hamilton", team: "Mercedes", teamColor: "#00a19c", time: "+1:32.401", points: 2, pits: 1 },
      { pos: 10, grid: 11, number: 50, driver: "Oliver Bearman", team: "Haas", teamColor: "#b6babd", time: "+1:33.127", points: 1, pits: 1 },
      { pos: 11, grid: 10, number: 27, driver: "Nico Hülkenberg", team: "Haas", teamColor: "#b6babd", time: "+1:33.456", points: 0, pits: 1 },
      { pos: 12, grid: 18, number: 10, driver: "Pierre Gasly", team: "Alpine", teamColor: "#0093cc", time: "+1:57.189", points: 0, pits: 1 },
      { pos: 13, grid: 16, number: 3, driver: "Daniel Ricciardo", team: "RB", teamColor: "#6692ff", time: "+2:26.907", points: 0, pits: 2 },
      { pos: 14, grid: 19, number: 24, driver: "Guanyu Zhou", team: "Kick Sauber", teamColor: "#52e252", time: "+1 Lap", points: 0, pits: 1 },
      { pos: 15, grid: 17, number: 31, driver: "Esteban Ocon", team: "Alpine", teamColor: "#0093cc", time: "+1 Lap", points: 0, pits: 1 },
      { pos: 16, grid: 14, number: 77, driver: "Valtteri Bottas", team: "Kick Sauber", teamColor: "#52e252", time: "+1 Lap", points: 0, pits: 1 },
      { pos: "DNF", grid: 3, number: 55, driver: "Carlos Sainz", team: "Ferrari", teamColor: "#e80020", time: "Collision", points: 0, pits: 1 },
      { pos: "DNF", grid: 4, number: 11, driver: "Sergio Perez", team: "Red Bull Racing", teamColor: "#1e41ff", time: "Collision", points: 0, pits: 1 },
      { pos: "DNF", grid: 13, number: 18, driver: "Lance Stroll", team: "Aston Martin", teamColor: "#229971", time: "Brakes", points: 0, pits: 2 },
      { pos: "DNF", grid: 12, number: 22, driver: "Yuki Tsunoda", team: "RB", teamColor: "#6692ff", time: "Damage", points: 0, pits: 1 }
    ]
  },
  16: {
    round: 16,
    grandPrix: "Italian Grand Prix",
    circuit: "Autodromo Nazionale Monza",
    date: "01 SEP 2026",
    winner: "Charles Leclerc",
    fastestLap: { driver: "Lando Norris", time: "1:21.432", lap: 53 },
    results: [
      { pos: 1, grid: 4, number: 16, driver: "Charles Leclerc", team: "Ferrari", teamColor: "#e80020", time: "1:14:40.727", points: 25, pits: 1 },
      { pos: 2, grid: 2, number: 81, driver: "Oscar Piastri", team: "McLaren", teamColor: "#ff8000", time: "+2.664", points: 18, pits: 2 },
      { pos: 3, grid: 1, number: 4, driver: "Lando Norris", team: "McLaren", teamColor: "#ff8000", time: "+6.153", points: 16, pits: 2, fastestLap: true },
      { pos: 4, grid: 5, number: 55, driver: "Carlos Sainz", team: "Ferrari", teamColor: "#e80020", time: "+15.621", points: 12, pits: 1 },
      { pos: 5, grid: 6, number: 44, driver: "Lewis Hamilton", team: "Mercedes", teamColor: "#00a19c", time: "+22.820", points: 10, pits: 2 },
      { pos: 6, grid: 7, number: 1, driver: "Max Verstappen", team: "Red Bull Racing", teamColor: "#1e41ff", time: "+37.932", points: 8, pits: 2 },
      { pos: 7, grid: 3, number: 63, driver: "George Russell", team: "Mercedes", teamColor: "#00a19c", time: "+39.715", points: 6, pits: 2 },
      { pos: 8, grid: 8, number: 11, driver: "Sergio Perez", team: "Red Bull Racing", teamColor: "#1e41ff", time: "+54.148", points: 4, pits: 2 },
      { pos: 9, grid: 9, number: 23, driver: "Alexander Albon", team: "Williams", teamColor: "#64c4ff", time: "+1:07.456", points: 2, pits: 1 },
      { pos: 10, grid: 14, number: 20, driver: "Kevin Magnussen", team: "Haas", teamColor: "#b6babd", time: "+1:08.302", points: 1, pits: 1 }
    ]
  }
};
