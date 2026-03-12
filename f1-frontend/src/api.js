const BASE = "http://localhost:8000"
export const fetchSeasons = () => fetch(`${BASE}/seasons`).then(r => r.json())
export const fetchRaces = (season) => fetch(`${BASE}/races/${season}`).then(r => r.json())
export const fetchPredictions = (season, circuit) => fetch(`${BASE}/predict/${season}/${circuit}`).then(r => r.json())
