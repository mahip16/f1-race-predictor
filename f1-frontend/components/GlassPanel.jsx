function GlassPanel( { children, style = {} }) {
  return (
    <div style={{
        background: 'rgba(10, 10, 15, 0.45)',
        backdropFilter: 'blur(22px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: "32px",
        boxShadow: "0 8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        ...style,
    }}>
      {children}

    </div>
  )
}

export default GlassPanel
