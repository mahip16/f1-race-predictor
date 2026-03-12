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
    { driver: "norris", team: "mclaren", grid: 1, win_probability: 0.31, mc_probability: 0.29 },
    { driver: "piastri", team: "mclaren", grid: 3, win_probability: 0.22, mc_probability: 0.20 },
    { driver: "leclerc", team: "ferrari", grid: 2, win_probability: 0.18, mc_probability: 0.17 },
    { driver: "max_verstappen", team: "red_bull", grid: 4, win_probability: 0.12, mc_probability: 0.14 },
    { driver: "russell", team: "mercedes", grid: 5, win_probability: 0.07, mc_probability: 0.08 },
    { driver: "hamilton", team: "ferrari", grid: 6, win_probability: 0.05, mc_probability: 0.06 },
    { driver: "antonelli", team: "mercedes", grid: 7, win_probability: 0.03, mc_probability: 0.04 },
    { driver: "alonso", team: "aston_martin", grid: 8, win_probability: 0.01, mc_probability: 0.01 },
    { driver: "sainz", team: "williams", grid: 9, win_probability: 0.005, mc_probability: 0.006 },
    { driver: "hulkenberg", team: "kick_sauber", grid: 10, win_probability: 0.005, mc_probability: 0.004 },
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