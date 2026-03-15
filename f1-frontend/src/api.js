const BASE = "https://f1-race-predictor-6b91.onrender.com"
export const fetchSeasons = () => fetch(`${BASE}/seasons`).then(r => r.json())
export const fetchRaces = (season) => fetch(`${BASE}/races/${season}`).then(r => r.json())
export const fetchPredictions = (season, circuit) => fetch(`${BASE}/predict/${season}/${circuit}`).then(r => r.json())
export const fetchForm = (season, circuit) =>
  fetch(`${BASE}/form/${season}/${circuit}`).then(r => r.json())

export async function fetch2026Predictions(circuit, grid) {
  const res = await fetch(`${BASE}/predict2026/${circuit}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid }),
  })
  return res.json()
}