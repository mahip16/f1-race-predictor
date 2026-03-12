import { useState, useEffect, useRef } from "react"

export default function AnimatedBar({ value, maxValue, color, delay = 0, label, sublabel, rightLabel }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  const pct = (value / maxValue) * 100

  return (
    <div ref={ref} style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <div>
          <span style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>{label}</span>
          {sublabel && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginLeft: "8px" }}>{sublabel}</span>}
        </div>
        <span style={{ color: color, fontSize: "13px", fontWeight: 700 }}>{rightLabel}</span>
      </div>

      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: visible ? `${pct}%` : "0%",
          background: color,
          borderRadius: "3px",
          transition: `width 1.1s ease ${delay}s`,
        }} />
      </div>
    </div>
  )
}