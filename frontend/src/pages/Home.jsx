import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useReveal from '../hooks/useReveal' // adjust path if needed: './useReveal'

const stats = [
  { val: '94.7%', lbl: 'Val Accuracy' },
  { val: '97.2%', lbl: 'Train Accuracy' },
  { val: '43',    lbl: 'Sign Classes' },
  { val: '12ms',  lbl: 'Latency' },
]

const features = [
  { icon: '🧠', title: 'ResNet-50',      desc: 'Deep residual network fine-tuned on 43 GTSRB sign classes with 97.2% training accuracy.' },
  { icon: '⚡', title: 'EfficientNet',   desc: 'Lightweight secondary model for fast validation with minimal accuracy trade-off.' },
  { icon: '🔍', title: 'Sliding Window', desc: 'Multi-scale scanning approach for precise traffic sign localization in any image.' },
  { icon: '🔌', title: 'Flask Backend',  desc: 'Python REST API serving the inference pipeline at port 5000 with low latency.' },
]

export default function Home() {
  const navigate = useNavigate()
  useReveal()

  return (
    <div className="page">

      {/* ── HERO ── */}
      <div className="home-hero">
        <div>
          <span className="home-badge reveal">⬡ System Online · v1.0</span>
          <h1 className="glitch reveal delay-1" data-text="TRAFFIC AI" style={{ marginTop: 16 }}>
            TRAFFIC AI
          </h1>
          <p className="home-desc reveal delay-2">
            Real-time deep learning detection for traffic signs. Upload any road image
            and get instant classification with confidence scoring.
          </p>
          <div className="home-actions reveal delay-3">
            <button onClick={() => navigate('/model')}>Run Detection ›</button>
            <button className="btn-secondary" onClick={() => navigate('/about')}>Learn More</button>
          </div>
        </div>
        <div className="hero-visual reveal-scale delay-2">
          <span className="hero-emoji">🚦</span>
        </div>
      </div>

      {/* ── STATS ── */}
      <span className="section-label reveal">Performance Metrics</span>
      <div className="section-title reveal delay-1">By The Numbers</div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={s.lbl} className={`stat-box reveal delay-${i + 1}`}>
            <span className="stat-val">{s.val}</span>
            <span className="stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <span className="section-label reveal">Architecture</span>
      <div className="section-title reveal delay-1">How It Works</div>
      <div className="feat-grid">
        {features.map((f, i) => (
          <div key={f.title} className={`feat-card reveal delay-${i + 1}`}>
            <span className="feat-icon">{f.icon}</span>
            <div className="feat-title">{f.title}</div>
            <p className="feat-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="panel-wide reveal" style={{ textAlign: 'center', padding: '40px 32px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
        <h2 style={{ marginBottom: 12 }}>Ready to Detect?</h2>
        <p style={{ marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          Upload a traffic sign image and let the AI classify it instantly.
        </p>
        <button style={{ width: 'auto', padding: '14px 48px' }} onClick={() => navigate('/model')}>
          Start Detection ›
        </button>
      </div>

    </div>
  )
}