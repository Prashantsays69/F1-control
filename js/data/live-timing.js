/* ==========================================================================
   DATA: LIVE TIMING FEED & RACE CONTROL
   Singapore GP official race telemetry archive
   ========================================================================== */

export const LIVE_SESSION_STATE = {
  "sessionName": "Grand Prix (Session Concluded)",
  "circuitName": "Marina Bay Street Circuit",
  "trackStatus": "GREEN",
  "currentLap": 62,
  "totalLaps": 62,
  "remainingTime": "00:00:00",
  "lastUpdated": "SESSION ARCHIVE",
  "isLive": false,
  "statusLabel": "SESSION CONCLUDED · ARCHIVED DATA"
};

export const LIVE_TIMING_FEED = [
  {
    "pos": 1,
    "carNumber": 3,
    "code": "VER",
    "driverName": "Max VERSTAPPEN",
    "team": "Red Bull Racing",
    "teamId": "red_bull",
    "teamColor": "#4781d7",
    "lap": 62,
    "lapTime": "1:35.842",
    "gap": "LEADER",
    "interval": "LEADER",
    "s1": {
      "time": "27.450",
      "status": "purple"
    },
    "s2": {
      "time": "38.160",
      "status": "yellow"
    },
    "s3": {
      "time": "29.640",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 19
    },
    "pits": 1,
    "speedTrapKmh": 311.59999999999997,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 2,
    "carNumber": 16,
    "code": "LEC",
    "driverName": "Charles LECLERC",
    "team": "Ferrari",
    "teamId": "ferrari",
    "teamColor": "#ed1131",
    "lap": 62,
    "lapTime": "1:35.918",
    "gap": "+7.335s",
    "interval": "+7.335s",
    "s1": {
      "time": "27.500",
      "status": "green"
    },
    "s2": {
      "time": "38.220",
      "status": "purple"
    },
    "s3": {
      "time": "29.680",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 20
    },
    "pits": 1,
    "speedTrapKmh": 310.79999999999995,
    "inPit": false,
    "bestLapOverall": true
  },
  {
    "pos": 3,
    "carNumber": 12,
    "code": "ANT",
    "driverName": "Kimi ANTONELLI",
    "team": "Mercedes",
    "teamId": "mercedes",
    "teamColor": "#00d7b6",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+24.573s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.550",
      "status": "green"
    },
    "s2": {
      "time": "38.280",
      "status": "yellow"
    },
    "s3": {
      "time": "29.720",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 21
    },
    "pits": 1,
    "speedTrapKmh": 310,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 4,
    "carNumber": 1,
    "code": "NOR",
    "driverName": "Lando NORRIS",
    "team": "McLaren",
    "teamId": "mclaren",
    "teamColor": "#f47600",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+40.506s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.600",
      "status": "green"
    },
    "s2": {
      "time": "38.340",
      "status": "yellow"
    },
    "s3": {
      "time": "29.760",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 22
    },
    "pits": 1,
    "speedTrapKmh": 309.2,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 5,
    "carNumber": 81,
    "code": "PIA",
    "driverName": "Oscar PIASTRI",
    "team": "McLaren",
    "teamId": "mclaren",
    "teamColor": "#f47600",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+49.644s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.650",
      "status": "green"
    },
    "s2": {
      "time": "38.400",
      "status": "yellow"
    },
    "s3": {
      "time": "29.800",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 23
    },
    "pits": 1,
    "speedTrapKmh": 308.4,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 6,
    "carNumber": 44,
    "code": "HAM",
    "driverName": "Lewis HAMILTON",
    "team": "Ferrari",
    "teamId": "ferrari",
    "teamColor": "#ed1131",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+53.188s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.700",
      "status": "green"
    },
    "s2": {
      "time": "38.460",
      "status": "yellow"
    },
    "s3": {
      "time": "29.840",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 24
    },
    "pits": 1,
    "speedTrapKmh": 307.59999999999997,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 7,
    "carNumber": 30,
    "code": "LAW",
    "driverName": "Liam LAWSON",
    "team": "Racing Bulls",
    "teamId": "racing_bulls",
    "teamColor": "#6c98ff",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+81.666s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.750",
      "status": "green"
    },
    "s2": {
      "time": "38.520",
      "status": "yellow"
    },
    "s3": {
      "time": "29.880",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 25
    },
    "pits": 1,
    "speedTrapKmh": 306.79999999999995,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 8,
    "carNumber": 27,
    "code": "HUL",
    "driverName": "Nico HULKENBERG",
    "team": "Audi",
    "teamId": "audi",
    "teamColor": "#f50537",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+83.386s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.800",
      "status": "green"
    },
    "s2": {
      "time": "38.580",
      "status": "yellow"
    },
    "s3": {
      "time": "29.920",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 18
    },
    "pits": 1,
    "speedTrapKmh": 306,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 9,
    "carNumber": 63,
    "code": "RUS",
    "driverName": "George RUSSELL",
    "team": "Mercedes",
    "teamId": "mercedes",
    "teamColor": "#00d7b6",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+84.677s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.850",
      "status": "green"
    },
    "s2": {
      "time": "38.640",
      "status": "yellow"
    },
    "s3": {
      "time": "29.960",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 19
    },
    "pits": 1,
    "speedTrapKmh": 305.2,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 10,
    "carNumber": 6,
    "code": "HAD",
    "driverName": "Isack HADJAR",
    "team": "Red Bull Racing",
    "teamId": "red_bull",
    "teamColor": "#4781d7",
    "lap": 62,
    "lapTime": "1:36.140",
    "gap": "+90.862s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.900",
      "status": "green"
    },
    "s2": {
      "time": "38.700",
      "status": "yellow"
    },
    "s3": {
      "time": "30.000",
      "status": "green"
    },
    "tyre": {
      "compound": "medium",
      "age": 20
    },
    "pits": 1,
    "speedTrapKmh": 304.4,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 11,
    "carNumber": 10,
    "code": "GAS",
    "driverName": "Pierre GASLY",
    "team": "Alpine",
    "teamId": "alpine",
    "teamColor": "#00a1e8",
    "lap": 61,
    "lapTime": "1:36.140",
    "gap": "+23.100s",
    "interval": "+1.482s",
    "s1": {
      "time": "27.950",
      "status": "green"
    },
    "s2": {
      "time": "38.760",
      "status": "yellow"
    },
    "s3": {
      "time": "30.040",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 21
    },
    "pits": 1,
    "speedTrapKmh": 303.59999999999997,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 12,
    "carNumber": 87,
    "code": "BEA",
    "driverName": "Oliver BEARMAN",
    "team": "Haas F1 Team",
    "teamId": "haas",
    "teamColor": "#9c9fa2",
    "lap": 61,
    "lapTime": "1:36.140",
    "gap": "+25.200s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.000",
      "status": "green"
    },
    "s2": {
      "time": "38.820",
      "status": "yellow"
    },
    "s3": {
      "time": "30.080",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 22
    },
    "pits": 1,
    "speedTrapKmh": 302.79999999999995,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 13,
    "carNumber": 31,
    "code": "OCO",
    "driverName": "Esteban OCON",
    "team": "Haas F1 Team",
    "teamId": "haas",
    "teamColor": "#9c9fa2",
    "lap": 61,
    "lapTime": "1:36.140",
    "gap": "+27.300s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.050",
      "status": "green"
    },
    "s2": {
      "time": "38.880",
      "status": "yellow"
    },
    "s3": {
      "time": "30.120",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 23
    },
    "pits": 1,
    "speedTrapKmh": 302,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 14,
    "carNumber": 55,
    "code": "SAI",
    "driverName": "Carlos SAINZ",
    "team": "Williams",
    "teamId": "williams",
    "teamColor": "#1868db",
    "lap": 61,
    "lapTime": "1:36.140",
    "gap": "+29.400s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.100",
      "status": "green"
    },
    "s2": {
      "time": "38.940",
      "status": "yellow"
    },
    "s3": {
      "time": "30.160",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 24
    },
    "pits": 1,
    "speedTrapKmh": 301.2,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 15,
    "carNumber": 41,
    "code": "LIN",
    "driverName": "Arvid LINDBLAD",
    "team": "Racing Bulls",
    "teamId": "racing_bulls",
    "teamColor": "#6c98ff",
    "lap": 61,
    "lapTime": "1:36.140",
    "gap": "+31.500s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.150",
      "status": "green"
    },
    "s2": {
      "time": "39.000",
      "status": "yellow"
    },
    "s3": {
      "time": "30.200",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 25
    },
    "pits": 1,
    "speedTrapKmh": 300.4,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 16,
    "carNumber": 14,
    "code": "ALO",
    "driverName": "Fernando ALONSO",
    "team": "Aston Martin",
    "teamId": "aston_martin",
    "teamColor": "#229971",
    "lap": 61,
    "lapTime": "1:36.140",
    "gap": "+33.600s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.200",
      "status": "green"
    },
    "s2": {
      "time": "39.060",
      "status": "yellow"
    },
    "s3": {
      "time": "30.240",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 18
    },
    "pits": 1,
    "speedTrapKmh": 299.59999999999997,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 17,
    "carNumber": 11,
    "code": "PER",
    "driverName": "Sergio PEREZ",
    "team": "Cadillac",
    "teamId": "cadillac",
    "teamColor": "#909090",
    "lap": 60,
    "lapTime": "1:36.140",
    "gap": "+35.700s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.250",
      "status": "green"
    },
    "s2": {
      "time": "39.120",
      "status": "yellow"
    },
    "s3": {
      "time": "30.280",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 19
    },
    "pits": 1,
    "speedTrapKmh": 298.79999999999995,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 18,
    "carNumber": 23,
    "code": "ALB",
    "driverName": "Alexander ALBON",
    "team": "Williams",
    "teamId": "williams",
    "teamColor": "#1868db",
    "lap": 59,
    "lapTime": "1:36.140",
    "gap": "+37.800s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.300",
      "status": "green"
    },
    "s2": {
      "time": "39.180",
      "status": "yellow"
    },
    "s3": {
      "time": "30.320",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 20
    },
    "pits": 1,
    "speedTrapKmh": 298,
    "inPit": false,
    "bestLapOverall": false
  },
  {
    "pos": 19,
    "carNumber": 77,
    "code": "BOT",
    "driverName": "Valtteri BOTTAS",
    "team": "Cadillac",
    "teamId": "cadillac",
    "teamColor": "#909090",
    "lap": 59,
    "lapTime": "1:36.140",
    "gap": "+39.900s",
    "interval": "+1.482s",
    "s1": {
      "time": "28.350",
      "status": "green"
    },
    "s2": {
      "time": "39.240",
      "status": "yellow"
    },
    "s3": {
      "time": "30.360",
      "status": "green"
    },
    "tyre": {
      "compound": "hard",
      "age": 21
    },
    "pits": 1,
    "speedTrapKmh": 297.2,
    "inPit": false,
    "bestLapOverall": false
  }
];

export const RACE_CONTROL_MESSAGES = [
  {
    "id": 1,
    "time": "11:11",
    "flag": "TRACK",
    "category": "Other",
    "text": "TRACK SURFACE SLIPPERY IN TRACK SECTOR 3"
  },
  {
    "id": 2,
    "time": "11:20",
    "flag": "GREEN",
    "category": "Flag",
    "text": "GREEN LIGHT - PIT EXIT OPEN"
  },
  {
    "id": 3,
    "time": "11:26",
    "flag": "TRACK",
    "category": "Other",
    "text": "INCIDENT INVOLVING CAR 18 (STR) NOTED - FAILING TO FOLLOW RACE DIRECTORS INSTRUCTIONS – PRACTICE START INFRINGEMENT (19:23:23)"
  },
  {
    "id": 4,
    "time": "11:26",
    "flag": "CLEAR",
    "category": "Flag",
    "text": "CLEAR IN TRACK SECTOR 3"
  },
  {
    "id": 5,
    "time": "11:26",
    "flag": "TRACK",
    "category": "Other",
    "text": "FIA STEWARDS: INCIDENT INVOLVING CAR 18 (STR) WILL BE INVESTIGATED AFTER THE RACE - FAILING TO FOLLOW RACE DIRECTORS INSTRUCTIONS – PRACTICE START INFRINGEMENT (19:23:23)"
  },
  {
    "id": 6,
    "time": "11:30",
    "flag": "TRACK",
    "category": "Other",
    "text": "PIT EXIT CLOSED"
  },
  {
    "id": 7,
    "time": "11:45",
    "flag": "TRACK",
    "category": "Other",
    "text": "RISK OF RAIN FOR THE F1 RACE IS 5%"
  },
  {
    "id": 8,
    "time": "11:57",
    "flag": "TRACK",
    "category": "Other",
    "text": "OVERTAKE DISABLED"
  },
  {
    "id": 9,
    "time": "12:03",
    "flag": "TRACK",
    "category": "SessionStatus",
    "text": "SESSION STARTED"
  },
  {
    "id": 10,
    "time": "12:03",
    "flag": "TRACK",
    "category": "Other",
    "text": "RACE START"
  }
];
