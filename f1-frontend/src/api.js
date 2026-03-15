const BASE = "http://localhost:8000"
export const fetchSeasons = () => fetch(`${BASE}/seasons`).then(r => r.json())
export const fetchRaces = (season) => fetch(`${BASE}/races/${season}`).then(r => r.json())
export const fetchPredictions = (season, circuit) => fetch(`${BASE}/predict/${season}/${circuit}`).then(r => r.json())
export const fetchForm = (season, circuit) =>
  fetch(`${BASE}/form/${season}/${circuit}`).then(r => r.json())
export async function fetch2026Predictions(circuit, grid) {
  const res = await fetch(`http://localhost:8000/predict2026/${circuit}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid }),
  })
  return res.json()
}