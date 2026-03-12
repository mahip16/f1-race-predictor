import GlassPanel from "./GlassPanel"
import AnimatedBar from "./AnimatedBar"
import { MOCK_PREDICTIONS, TEAM_COLORS } from "../src/mockData"

export default function MonteCarloSection() {
  const { predictions } = MOCK_PREDICTIONS
  const maxValue = Math.max(...predictions.map(d => d.mc_probability))
  const formatName = (str) => str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())

  return (
    <GlassPanel>
      <div style={{ borderLeft: "3px solid #27F4D2", paddingLeft: "12px", marginBottom: "28px" }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Monte Carlo Simulation — 10,000 Races
        </span>
      </div>
      <div>
        {predictions.map((driver, index) => {
          const delta = ((driver.mc_probability - driver.win_probability) * 100).toFixed(1)
          const sign = delta > 0 ? "+" : ""
          return (
            <AnimatedBar
              key={driver.driver}
              value={driver.mc_probability}
              maxValue={maxValue}
              color={TEAM_COLORS[driver.team]}
              delay={index * 0.06}
              label={formatName(driver.driver)}
              sublabel={`MC vs Model: ${sign}${delta}%`}
              rightLabel={(driver.mc_probability * 100).toFixed(1) + "%"}
            />
          )
        })}
      </div>
    </GlassPanel>
  )
}