/* ==========================================================================
   F1 DATA ARCHITECTURE - CIRCUITS
   Technical specifications, sector profiles, DRS zones, and vector paths
   ========================================================================== */

export const CIRCUITS = [
  {
    id: "singapore",
    name: "Marina Bay Street Circuit",
    country: "Singapore",
    city: "Marina Bay",
    grandPrix: "Singapore Grand Prix",
    round: 18,
    lengthKm: "4.940 km",
    laps: 62,
    raceDistanceKm: "306.143 km",
    corners: 19,
    drsZones: 4,
    lapRecord: {
      time: "1:35.867",
      driver: "Lewis Hamilton",
      year: 2023
    },
    sectors: [
      { number: 1, length: "1.62 km", nature: "Technical chicane, Turn 1-3 sequence, high braking demand" },
      { number: 2, length: "1.88 km", nature: "Raffles Boulevard high-speed straight, Turn 7 heavy stop, Anderson Bridge" },
      { number: 3, length: "1.44 km", nature: "Collyer Quay, Waterfront high precision sweepers, tight Turn 16-19 complex" }
    ],
    elevationChangeM: 7,
    fullThrottlePct: "47%",
    tyreStress: "3/5",
    downforceLevel: "Maximum",
    // Accurate normalized SVG track path for technical circuit visualizer
    svgPath: "M 120 280 L 120 220 C 120 210, 130 200, 140 200 L 260 200 C 275 200, 280 180, 290 170 L 340 120 C 350 110, 370 110, 380 125 L 430 190 C 440 200, 455 195, 465 185 L 510 130 C 520 120, 535 125, 545 135 L 570 170 C 580 185, 575 210, 560 225 L 490 290 C 475 305, 460 300, 450 285 L 420 240 C 410 225, 390 230, 380 245 L 340 300 C 330 315, 310 320, 290 310 L 220 280 C 205 275, 195 285, 185 295 L 140 320 C 125 330, 120 310, 120 280 Z",
    drsPath: "M 290 170 L 340 120 M 490 290 L 420 240 M 140 200 L 260 200",
    speedTrap: { x: 330, y: 130, label: "ST 312 km/h" },
    schedule: [
      { session: "Practice 1", day: "FRI 09 OCT", time: "14:30 - 15:30", status: "completed" },
      { session: "Practice 2", day: "FRI 09 OCT", time: "18:00 - 19:00", status: "completed" },
      { session: "Practice 3", day: "SAT 10 OCT", time: "14:30 - 15:30", status: "completed" },
      { session: "Qualifying", day: "SAT 10 OCT", time: "18:00 - 19:00", status: "upcoming" },
      { session: "Grand Prix", day: "SUN 11 OCT", time: "17:00 - 19:00", status: "upcoming" }
    ]
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    country: "United Kingdom",
    city: "Silverstone, Northamptonshire",
    grandPrix: "British Grand Prix",
    round: 12,
    lengthKm: "5.891 km",
    laps: 52,
    raceDistanceKm: "306.198 km",
    corners: 18,
    drsZones: 2,
    lapRecord: {
      time: "1:27.097",
      driver: "Max Verstappen",
      year: 2020
    },
    sectors: [
      { number: 1, length: "1.92 km", nature: "Abbey, Farm Curve, Village, The Loop tight hairpin" },
      { number: 2, length: "2.14 km", nature: "Brooklands, Luffield, Woodcote onto Copse flat-out corner" },
      { number: 3, length: "1.83 km", nature: "Maggotts & Becketts legendary S-curves, Chapel, Hangar Straight, Stowe" }
    ],
    elevationChangeM: 11,
    fullThrottlePct: "78%",
    tyreStress: "5/5",
    downforceLevel: "Medium-High",
    svgPath: "M 180 150 L 260 110 C 280 100, 310 110, 330 130 L 390 190 C 410 210, 440 210, 460 190 L 520 130 C 540 110, 560 120, 570 140 L 590 200 C 600 230, 580 260, 550 270 L 460 290 C 440 295, 430 310, 435 330 L 440 370 C 445 400, 410 420, 380 400 L 290 350 C 270 340, 240 345, 220 360 L 160 410 C 140 425, 110 405, 120 375 L 140 280 C 145 250, 160 230, 175 200 Z",
    drsPath: "M 520 130 L 570 140 M 460 290 L 435 330",
    speedTrap: { x: 550, y: 135, label: "ST 336 km/h" }
  },
  {
    id: "spa",
    name: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    city: "Stavelot, Ardennes",
    grandPrix: "Belgian Grand Prix",
    round: 14,
    lengthKm: "7.004 km",
    laps: 44,
    raceDistanceKm: "308.052 km",
    corners: 19,
    drsZones: 2,
    lapRecord: {
      time: "1:46.286",
      driver: "Valtteri Bottas",
      year: 2018
    },
    sectors: [
      { number: 1, length: "2.35 km", nature: "La Source hairpin, steep drop to Eau Rouge, Raidillon hill climb, Kemmel Straight" },
      { number: 2, length: "2.85 km", nature: "Les Combes chicane, Malmedy, Bruxelles downhill carousel, Pouhon ultra high-speed" },
      { number: 3, length: "1.80 km", nature: "Campus, Stavelot, Blanchimont flat-out kink, Bus Stop chicane" }
    ],
    elevationChangeM: 102,
    fullThrottlePct: "80%",
    tyreStress: "5/5",
    downforceLevel: "Medium-Low",
    svgPath: "M 130 140 L 230 110 C 260 100, 300 110, 330 130 L 420 190 C 440 205, 470 200, 490 180 L 550 120 C 570 100, 600 110, 610 135 L 620 190 C 630 220, 610 250, 580 270 L 470 330 C 440 350, 420 380, 430 410 L 440 450 C 445 480, 410 500, 380 480 L 270 410 C 240 390, 210 395, 190 420 L 150 460 C 130 480, 100 460, 110 430 L 140 300 C 145 250, 120 200, 130 140 Z",
    drsPath: "M 330 130 L 420 190 M 270 410 L 190 420",
    speedTrap: { x: 410, y: 185, label: "ST 348 km/h" }
  },
  {
    id: "monza",
    name: "Autodromo Nazionale Monza",
    country: "Italy",
    city: "Monza, Lombardy",
    grandPrix: "Italian Grand Prix",
    round: 16,
    lengthKm: "5.793 km",
    laps: 53,
    raceDistanceKm: "306.720 km",
    corners: 11,
    drsZones: 2,
    lapRecord: {
      time: "1:21.046",
      driver: "Rubens Barrichello",
      year: 2004
    },
    sectors: [
      { number: 1, length: "1.98 km", nature: "Rettifilo start straight, Prima Variante 350->70kmh braking, Curva Grande sweep" },
      { number: 2, length: "2.10 km", nature: "Variante della Roggia, Lesmo 1 & Lesmo 2 technical right-handers" },
      { number: 3, length: "1.71 km", nature: "Curva del Serraglio, Variante Ascari chicane sequence, Curva Parabolica (Alboreto)" }
    ],
    elevationChangeM: 13,
    fullThrottlePct: "84%",
    tyreStress: "4/5",
    downforceLevel: "Lowest (Skinny Wing)",
    svgPath: "M 120 200 L 480 140 C 520 135, 550 160, 560 195 L 570 240 C 575 270, 550 300, 520 310 L 340 350 C 310 355, 290 370, 280 390 L 260 430 C 250 455, 220 465, 195 450 L 150 420 C 130 405, 125 380, 135 360 L 170 310 C 180 295, 175 275, 160 265 L 125 240 C 110 230, 110 210, 120 200 Z",
    drsPath: "M 120 200 L 480 140 M 520 310 L 340 350",
    speedTrap: { x: 460, y: 145, label: "ST 357 km/h" }
  },
  {
    id: "monaco",
    name: "Circuit de Monaco",
    country: "Monaco",
    city: "Monte Carlo",
    grandPrix: "Monaco Grand Prix",
    round: 8,
    lengthKm: "3.337 km",
    laps: 78,
    raceDistanceKm: "260.286 km",
    corners: 19,
    drsZones: 1,
    lapRecord: {
      time: "1:12.909",
      driver: "Lewis Hamilton",
      year: 2021
    },
    sectors: [
      { number: 1, length: "1.08 km", nature: "Sainte-Devote, Beau Rivage climb, Massenet, Casino Square crest" },
      { number: 2, length: "1.25 km", nature: "Mirabeau Haute, Fairmont Hairpin (slowest F1 corner), Portier, Tunnel acceleration" },
      { number: 3, length: "1.00 km", nature: "Nouvelle Chicane, Tabac, Louis Chiron Swimming Pool complex, Rascasse, Anthony Noghes" }
    ],
    elevationChangeM: 42,
    fullThrottlePct: "34%",
    tyreStress: "1/5",
    downforceLevel: "Maximum",
    svgPath: "M 160 300 L 170 230 C 175 210, 195 195, 220 190 L 330 180 C 355 175, 380 185, 395 205 L 430 250 C 440 265, 460 270, 480 260 L 520 240 C 540 230, 560 240, 570 260 L 580 300 C 585 330, 560 360, 530 370 L 440 390 C 410 395, 380 420, 390 450 L 400 480 C 405 505, 375 525, 350 515 L 290 490 C 270 480, 250 490, 240 510 L 220 540 C 205 560, 175 555, 170 530 L 155 450 C 150 400, 155 350, 160 300 Z",
    drsPath: "M 155 450 L 160 300",
    speedTrap: { x: 500, y: 245, label: "ST 294 km/h" }
  },
  {
    id: "suzuka",
    name: "Suzuka International Racing Course",
    country: "Japan",
    city: "Suzuka, Mie Prefecture",
    grandPrix: "Japanese Grand Prix",
    round: 4,
    lengthKm: "5.807 km",
    laps: 53,
    raceDistanceKm: "307.471 km",
    corners: 18,
    drsZones: 1,
    lapRecord: {
      time: "1:30.983",
      driver: "Lewis Hamilton",
      year: 2019
    },
    sectors: [
      { number: 1, length: "1.89 km", nature: "Turn 1-2 double apex, continuous rhythmic 'S' Curves sequence, Dunlop curve" },
      { number: 2, length: "2.12 km", nature: "Degner 1 & 2 high precision curbs, Underpass crossover, Hairpin heavy stop, 200R, Spoon curve" },
      { number: 3, length: "1.79 km", nature: "Back straight crossover bridge, legendary 130R flat-out sweeping left, Casio Triangle chicane" }
    ],
    elevationChangeM: 40,
    fullThrottlePct: "70%",
    tyreStress: "5/5",
    downforceLevel: "High",
    svgPath: "M 140 260 C 145 220, 170 190, 205 180 L 290 160 C 320 150, 350 165, 365 190 L 400 240 C 415 260, 440 270, 465 260 L 530 230 C 555 220, 580 235, 585 260 L 590 320 C 595 350, 570 380, 540 390 L 440 410 C 410 415, 380 400, 370 375 L 340 310 C 330 285, 305 270, 280 275 L 210 290 C 180 295, 155 320, 150 350 L 140 430 C 135 460, 110 475, 90 455 L 75 420 C 60 385, 80 340, 110 325 Z",
    drsPath: "M 140 430 L 140 260",
    speedTrap: { x: 500, y: 395, label: "ST 332 km/h" }
  }
];
