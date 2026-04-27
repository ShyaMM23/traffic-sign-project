import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const stats = [
  { val: '94.7%', label: 'Accuracy',  color: 'blue' },
  { val: '43',    label: 'Classes',   color: 'blue' },
  { val: '12ms',  label: 'Latency',   color: 'blue' },
  { val: '97.2%', label: 'Train Acc', color: 'blue' },
]

const features = [
  { icon: '🧠', title: 'ResNet-50',      desc: 'Deep residual network fine-tuned on 43 GTSRB sign classes.' },
  { icon: '⚡', title: 'EfficientNet',   desc: 'Lightweight model for fast, accurate secondary validation.' },
  { icon: '🔍', title: 'Sliding Window', desc: 'Multi-scale detection for robust sign localization.' },
  { icon: '🔌', title: 'FastAPI',        desc: 'Python REST backend with sub-12ms inference latency.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.badge}>● System Online</span>
          <h1 className={styles.heading}>
            AI Traffic Sign<br />Detection
          </h1>
          <p className={styles.desc}>
            Real-time classification of traffic signs using state-of-the-art
            deep learning. Upload an image and get instant results.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => navigate('/detect')}>
              Start Detection
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/about')}>
              Learn More
            </button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.signBox}>🚦</div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statVal}>{s.val}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className={styles.sectionTitle}>How It Works</div>
      <div className={styles.featGrid}>
        {features.map(f => (
          <div key={f.title} className={styles.featCard}>
            <span className={styles.featIcon}>{f.icon}</span>
            <h3 className={styles.featTitle}>{f.title}</h3>
            <p className={styles.featDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
