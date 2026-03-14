export const TEAM_COLORS = {
  mclaren: "#FF8000",
  ferrari: "#E8002D",
  red_bull: "#3671C6",
  mercedes: "#27F4D2",
  aston_martin: "#229971",
  alpine: "#FF87BC",
  haas: "#B6BABD",
  rb: "#6692FF",
  williams: "#64C4FF",
  kick_sauber: "#52E252",
  cadillac: "#4d4d4d",
  audi: "#BB0000",

  alfa_romeo: "#B12335",
  alphatauri: "#5E8FAA",
  alpha_tauri: "#5E8FAA",
  renault: "#FFF500",
  racing_point: "#F596C8",
  force_india: "#F596C8",
  toro_rosso: "#469BFF",
  lotus: "#FFB800",
  manor: "#6E0000",
  sauber: "#006EFF",
  caterham: "#005030",
  marussia: "#6E0000",
  jordan: "#FFD700",

};

export const teamKey = (team) =>
  team?.toLowerCase()
    .replace(/ f1 team| racing| motorsport/g, "")
    .replace(/ /g, "_")
    .trim()

export const MOCK_PREDICTIONS = {
  season: 2025,
  circuit: "monaco",
  predictions: [
    { 
      driver: "norris", team: "mclaren", grid: 1, 
      win_probability: 0.31, mc_probability: 0.29,
      driver_avg_finish_last3: 2.0, driver_circuit_win_rate: 0.15,
      team_avg_points_last3: 85, driver_dnf_rate: 0.05,
      driver_championship_pos: 2, gap_to_leader: 15, 
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "piastri", team: "mclaren", grid: 3, 
      win_probability: 0.22, mc_probability: 0.20,
      driver_avg_finish_last3: 3.3, driver_circuit_win_rate: 0.08,
      team_avg_points_last3: 85, driver_dnf_rate: 0.08,
      driver_championship_pos: 4, gap_to_leader: 42,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "leclerc", team: "ferrari", grid: 2, 
      win_probability: 0.18, mc_probability: 0.17,
      driver_avg_finish_last3: 3.0, driver_circuit_win_rate: 0.22,
      team_avg_points_last3: 78, driver_dnf_rate: 0.12,
      driver_championship_pos: 3, gap_to_leader: 28,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "max_verstappen", team: "red_bull", grid: 4, 
      win_probability: 0.12, mc_probability: 0.14,
      driver_avg_finish_last3: 4.0, driver_circuit_win_rate: 0.25,
      team_avg_points_last3: 72, driver_dnf_rate: 0.06,
      driver_championship_pos: 1, gap_to_leader: 0,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "russell", team: "mercedes", grid: 5, 
      win_probability: 0.07, mc_probability: 0.08,
      driver_avg_finish_last3: 5.3, driver_circuit_win_rate: 0.05,
      team_avg_points_last3: 65, driver_dnf_rate: 0.07,
      driver_championship_pos: 5, gap_to_leader: 58,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "hamilton", team: "ferrari", grid: 6, 
      win_probability: 0.05, mc_probability: 0.06,
      driver_avg_finish_last3: 5.7, driver_circuit_win_rate: 0.18,
      team_avg_points_last3: 78, driver_dnf_rate: 0.04,
      driver_championship_pos: 6, gap_to_leader: 65,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "antonelli", team: "mercedes", grid: 7, 
      win_probability: 0.03, mc_probability: 0.04,
      driver_avg_finish_last3: 7.7, driver_circuit_win_rate: 0.0,
      team_avg_points_last3: 65, driver_dnf_rate: 0.15,
      driver_championship_pos: 8, gap_to_leader: 95,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "alonso", team: "aston_martin", grid: 8, 
      win_probability: 0.01, mc_probability: 0.01,
      driver_avg_finish_last3: 8.3, driver_circuit_win_rate: 0.12,
      team_avg_points_last3: 42, driver_dnf_rate: 0.08,
      driver_championship_pos: 7, gap_to_leader: 88,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "sainz", team: "williams", grid: 9, 
      win_probability: 0.005, mc_probability: 0.006,
      driver_avg_finish_last3: 7.3, driver_circuit_win_rate: 0.06,
      team_avg_points_last3: 28, driver_dnf_rate: 0.11,
      driver_championship_pos: 9, gap_to_leader: 112,
      regulation_era: 2022, home_race: 0
    },
    { 
      driver: "hulkenberg", team: "kick_sauber", grid: 10, 
      win_probability: 0.005, mc_probability: 0.004,
      driver_avg_finish_last3: 11.0, driver_circuit_win_rate: 0.0,
      team_avg_points_last3: 18, driver_dnf_rate: 0.09,
      driver_championship_pos: 12, gap_to_leader: 145,
      regulation_era: 2022, home_race: 0
    },
  ],
};

export const MOCK_FEATURE_IMPORTANCE = {
  grid: 0.34,
  driver_avg_finish_last3: 0.21,
  driver_circuit_win_rate: 0.15,
  team_avg_points_last3: 0.12,
  driver_championship_pos: 0.08,
  gap_to_leader: 0.05,
  driver_dnf_rate: 0.03,
  regulation_era: 0.01,
  home_race: 0.01,
};

export const MOCK_RECENT_FORM = [
  { driver: "norris", team: "mclaren", results: [1, 2, 1, 3, 1] },
  { driver: "piastri", team: "mclaren", results: [3, 1, 4, 2, 2] },
  { driver: "leclerc", team: "ferrari", results: [2, 4, 2, 1, 3] },
  { driver: "max_verstappen", team: "red_bull", results: [5, 3, 3, 4, 4] },
  { driver: "russell", team: "mercedes", results: [4, 5, 5, 5, 6] },
  { driver: "hamilton", team: "ferrari", results: [6, 6, 7, 3, 5] },
  { driver: "sainz", team: "williams", results: [7, 8, 6, 8, 7] },
  { driver: "antonelli", team: "mercedes", results: [8, 7, 8, 7, 8] },
];