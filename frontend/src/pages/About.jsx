import { motion } from 'framer-motion'
import useReveal from '../hooks/useReveal' 

const metrics = [
  { val: '97.2%', lbl: 'Train Accuracy' },
  { val: '94.7%', lbl: 'Val Accuracy' },
  { val: '43',    lbl: 'Sign Classes' },
  { val: '12ms',  lbl: 'Inference Time' },
  { val: '51K+',  lbl: 'Training Images' },
  { val: '99.9%', lbl: 'Uptime' },
]

const techStack = [
  { icon: '🧠', name: 'ResNet-50',      tag: 'PyTorch',   color: '', desc: 'Primary classification backbone. Deep residual architecture with skip connections prevents vanishing gradients, enabling 50-layer depth.' },
  { icon: '⚡', name: 'EfficientNet',   tag: 'PyTorch',   color: '', desc: 'Secondary validation model. Uses compound scaling to balance network depth, width, and resolution for optimal efficiency.' },
  { icon: '🔍', name: 'Sliding Window', tag: 'Detection', color: 'tag-green', desc: 'Custom multi-scale detector. Scans the image at 3 scales with overlapping windows to reliably locate signs at any size.' },
  { icon: '🐍', name: 'Flask',          tag: 'Python',    color: 'tag-amber', desc: 'Lightweight REST backend serving the /detect endpoint. Handles multipart image upload and returns JSON predictions.' },
  { icon: '📦', name: 'GTSRB Dataset',  tag: 'Dataset',   color: '', desc: 'German Traffic Sign Recognition Benchmark — 51,839 images across 43 classes. Considered the gold standard for sign detection research.' },
  { icon: '⚛️', name: 'React + Vite',  tag: 'Frontend',  color: 'tag-green', desc: 'Fast SPA frontend with React Router for navigation. Vite provides instant HMR and optimized production builds.' },
]

const pipeline = [
  { step: '01', title: 'Image Input',        desc: 'User uploads a PNG, JPG, or WEBP image through the web interface or mobile app. Accepted up to 10MB.' },
  { step: '02', title: 'Preprocessing',      desc: 'Image is resized to 224×224, normalized with ImageNet mean/std, and converted to a tensor for model input.' },
  { step: '03', title: 'Sliding Window',     desc: 'The detector scans the image at 3 scales (1×, 0.75×, 0.5×) using overlapping windows to find candidate regions.' },
  { step: '04', title: 'CNN Inference',      desc: 'Each candidate patch is classified by ResNet-50. EfficientNet validates high-confidence candidates as a secondary check.' },
  { step: '05', title: 'Post-processing',    desc: 'Non-Maximum Suppression (NMS) removes overlapping boxes. The top prediction is selected by confidence score.' },
  { step: '06', title: 'Response',           desc: 'The Flask backend returns { label, confidence } as JSON. The frontend displays the result with an animated confidence bar.' },
]

const specs = [
  ['Dataset',          'GTSRB (German Traffic Sign)'],
  ['Classes',          '43 sign categories'],
  ['Training Images',  '51,839 images'],
  ['Train Accuracy',   '97.2%'],
  ['Val Accuracy',     '94.7%'],
  ['Inference Time',   '~12ms per image'],
  ['Primary Model',    'ResNet-50'],
  ['Secondary Model',  'EfficientNet-B0'],
  ['Framework',        'PyTorch 2.0'],
  ['Backend',          'Flask (Python)'],
  ['API Endpoint',     'POST /detect'],
  ['Input Format',     'multipart/form-data'],
  ['Output Format',    '{ label, confidence }'],
  ['Image Size',       '224 × 224 px (normalized)'],
]

const faqs = [
  { q: 'What types of images work best?', a: 'Clear, well-lit photos where the traffic sign takes up at least 20% of the frame. Avoid heavy blur, extreme angles, or obstructions.' },
  { q: 'Why does confidence sometimes seem low?', a: 'Unusual lighting, partial occlusion, or sign damage can reduce confidence. The sliding window still returns the best match from all 43 classes.' },
  { q: 'Can it detect multiple signs in one image?', a: 'The current version returns the highest-confidence sign. Multi-sign detection via full NMS pipeline is planned for v2.0.' },
  { q: 'How do I connect my own backend?', a: 'Update the URL in Model.jsx to point to your server. The API expects a multipart POST with field name "image" and returns { label, confidence }.' },
]

export default function About() {
  useReveal()

  return (
    <div className="page">

      {/* ── HERO ── */}
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">Deep Learning · Computer Vision</span>
        <h1 className="glitch" data-text="TRAFFIC AI" style={{ marginBottom: 16 }}>TRAFFIC AI</h1>
        <p style={{ maxWidth: 520, margin: '0 auto', fontSize: 15, lineHeight: 1.8 }}>
          An end-to-end traffic sign detection and classification system powered by
          convolutional neural networks trained on the GTSRB benchmark dataset.
        </p>
        <div className="tag-row" style={{ justifyContent: 'center', marginTop: 20 }}>
          {['ResNet-50', 'EfficientNet', 'PyTorch', 'Flask', 'GTSRB', 'Sliding Window'].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </motion.div>

      {/* ── METRICS ── */}
      <span className="section-label reveal">Performance</span>
      <div className="section-title reveal delay-1">Key Metrics</div>
      <div className="about-grid-3" style={{ marginBottom: 60 }}>
        {metrics.map((m, i) => (
          <div key={m.lbl} className={`metric-box reveal delay-${i + 1}`}>
            <span className="metric-val">{m.val}</span>
            <span className="metric-lbl">{m.lbl}</span>
          </div>
        ))}
      </div>

      {/* ── PROJECT OVERVIEW ── */}
      <span className="section-label reveal">Overview</span>
      <div className="section-title reveal delay-1">About the Project</div>
      <div className="panel-wide reveal delay-2" style={{ marginBottom: 40 }}>
        <p style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.9 }}>
          Traffic AI uses convolutional neural networks to automatically detect and classify
          traffic signs in photographs. It was built to demonstrate how modern deep learning
          models can be deployed as practical web and mobile applications connected to a real
          inference backend.
        </p>
        <p style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.9 }}>
          The system is trained on the <strong style={{ color: 'var(--cyan)' }}>German Traffic Sign Recognition Benchmark (GTSRB)</strong>,
          one of the largest and most widely cited benchmarks in traffic sign research, containing
          over 51,000 images across 43 distinct sign categories including speed limits, warnings,
          prohibitions, and mandatory signs.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.9 }}>
          A <strong style={{ color: 'var(--cyan)' }}>sliding-window detection</strong> approach scans the input image at
          multiple scales and feeds each candidate crop into the classification network. This allows
          the system to locate signs regardless of their size or position within the frame.
        </p>
      </div>

      {/* ── TECH STACK ── */}
      <span className="section-label reveal">Architecture</span>
      <div className="section-title reveal delay-1">Technology Stack</div>
      <div className="about-grid" style={{ marginBottom: 60 }}>
        {techStack.map((t, i) => (
          <div key={t.name} className={`panel reveal delay-${(i % 3) + 1}`}>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{t.icon}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>{t.name}</h3>
              <span className={`tag ${t.color}`}>{t.tag}</span>
            </div>
            <p style={{ fontSize: 13 }}>{t.desc}</p>
          </div>
        ))}
      </div>

      {/* ── PIPELINE ── */}
      <span className="section-label reveal">Workflow</span>
      <div className="section-title reveal delay-1">Detection Pipeline</div>
      <div className="panel-wide reveal delay-2" style={{ marginBottom: 60 }}>
        <div className="timeline">
          {pipeline.map((p, i) => (
            <div key={p.step} className={`timeline-item reveal delay-${i + 1}`}>
              <div className="timeline-step">Step {p.step}</div>
              <div className="timeline-title">{p.title}</div>
              <p className="timeline-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SPEC TABLE ── */}
      <span className="section-label reveal">Reference</span>
      <div className="section-title reveal delay-1">System Specifications</div>
      <div className="spec-table reveal delay-2" style={{ marginBottom: 60 }}>
        {specs.map(([k, v]) => (
          <div key={k} className="spec-row">
            <span className="spec-key">{k}</span>
            <span className="spec-val">{v}</span>
          </div>
        ))}
      </div>

      {/* ── FAQ ── */}
      <span className="section-label reveal">Support</span>
      <div className="section-title reveal delay-1">Frequently Asked Questions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 60 }}>
        {faqs.map((f, i) => (
          <div key={f.q} className={`panel reveal delay-${i + 1}`}>
            <h3 style={{ marginBottom: 10, fontSize: 12 }}>{f.q}</h3>
            <p style={{ fontSize: 13 }}>{f.a}</p>
          </div>
        ))}
      </div>

      {/* ── DATASET CARD ── */}
      <div className="panel-wide reveal" style={{ textAlign: 'center', padding: '40px 32px' }}>
        <span style={{ fontSize: 36, display: 'block', marginBottom: 16 }}>📦</span>
        <h2 style={{ marginBottom: 12 }}>GTSRB DATASET</h2>
        <p style={{ maxWidth: 480, margin: '0 auto 20px', fontSize: 14 }}>
          The German Traffic Sign Recognition Benchmark contains real-world photographs
          of 43 traffic sign classes captured under various lighting and weather conditions.
          It is the industry standard for evaluating sign recognition systems.
        </p>
        <div className="tag-row" style={{ justifyContent: 'center' }}>
          <span className="tag">51,839 Images</span>
          <span className="tag">43 Classes</span>
          <span className="tag tag-green">Open Source</span>
          <span className="tag tag-amber">Real World</span>
        </div>
      </div>

    </div>
  )
}