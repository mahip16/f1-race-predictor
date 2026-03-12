import GlassPanel from "./GlassPanel"
import { MOCK_RECENT_FORM, TEAM_COLORS, teamKey } from "../src/mockData"
import { useState, useEffect, useRef } from "react"

function DriverCard({ entry }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const color = TEAM_COLORS[teamKey(entry.team)] || "#fff"
  const formatName = (str) => str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  const avg = (entry.results.reduce((a, b) => a + b, 0) / entry.results.length).toFixed(1)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}22`,
      borderRadius: "12px",
      padding: "20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ color, fontWeight: 700, textTransform: "uppercase", fontSize: "14px" }}>
          {formatName(entry.driver)}
        </span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
          Avg P{avg}
        </span>
      </div>

      <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "80px" }}>
        {entry.results.map((pos, i) => {
          const barH = ((20 - pos) / 19) * 80
          return (
            <div key={i} style={{ width: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "100%",
                height: visible ? `${barH}px` : "0px",
                background: pos === 1 ? color : `${color}55`,
                borderRadius: "3px 3px 0 0",
                transition: `height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`,
                boxShadow: pos === 1 ? `0 0 8px ${color}88` : "none",
              }} />
              <span style={{ fontSize: "9px", color: pos === 1 ? color : "rgba(255,255,255,0.25)" }}>
                P{pos}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FormSection({ form: formProp }) {
  const entries = formProp?.form || MOCK_RECENT_FORM
  return (
    <GlassPanel>
       <div style={{ borderLeft: "3px solid #FF8000", paddingLeft: "12px", marginBottom: "28px" }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Recent Form — Last 5 Races
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {MOCK_RECENT_FORM.map((entry) => (
          <DriverCard key={entry.driver} entry={entry} />
        ))}
      </div>
    </GlassPanel>
  )
}