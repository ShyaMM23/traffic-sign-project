import styles from './About.module.css'

const tech = [
  { icon: '🧠', name: 'ResNet-50',      tag: 'PyTorch',  desc: 'Primary classification model. Trained on 43 GTSRB classes with 97.2% training accuracy.' },
  { icon: '⚡', name: 'EfficientNet',   tag: 'PyTorch',  desc: 'Efficient secondary model for validation, trading minimal accuracy for faster inference.' },
  { icon: '🔍', name: 'Sliding Window', tag: 'Detection', desc: 'Multi-scale scan over the input image for precise sign localization and bounding boxes.' },
  { icon: '🔌', name: 'FastAPI',        tag: 'Python',   desc: 'Async REST backend serving the inference pipeline at port 8000 with sub-12ms latency.' },
]

const specs = [
  ['Dataset',       'GTSRB (German Traffic Sign)'],
  ['Classes',       '43 sign categories'],
  ['Train Acc',     '97.2%'],
  ['Val Acc',       '94.7%'],
  ['Inference',     '~12ms per image'],
  ['Framework',     'PyTorch + FastAPI'],
  ['API Endpoint',  'POST /predict/'],
  ['Input',         'multipart/form-data (image)'],
  ['Output',        '{ class, confidence }'],
]

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>About</h1>
        <p className={styles.subtitle}>How the Traffic AI detection system works</p>
      </div>

      {/* Description */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Project Overview</h2>
        <p className={styles.cardText}>
          Traffic AI is an end-to-end deep learning system for detecting and classifying
          traffic signs in images. It uses convolutional neural networks trained on the
          German Traffic Sign Recognition Benchmark (GTSRB) dataset — one of the largest
          and most widely used benchmarks in traffic sign research.
        </p>
        <p className={styles.cardText}>
          A sliding-window approach scans the input image at multiple scales, feeding
          each candidate region into the model for classification. The system returns
          the detected sign class along with a confidence score.
        </p>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className={styles.sectionTitle}>Technology Stack</h2>
        <div className={styles.techGrid}>
          {tech.map(t => (
            <div key={t.name} className={styles.techCard}>
              <div className={styles.techHeader}>
                <span className={styles.techIcon}>{t.icon}</span>
                <div>
                  <div className={styles.techName}>{t.name}</div>
                  <span className={styles.techTag}>{t.tag}</span>
                </div>
              </div>
              <p className={styles.techDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Specs table */}
      <div>
        <h2 className={styles.sectionTitle}>System Specifications</h2>
        <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
          {specs.map(([k, v], i) => (
            <div key={k} className={`${styles.specRow} ${i === specs.length - 1 ? styles.specRowLast : ''}`}>
              <span className={styles.specKey}>{k}</span>
              <span className={styles.specVal}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
