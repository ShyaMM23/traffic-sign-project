import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function Model() {
  const [file, setFile]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState('')

  const handleUpload = async () => {
    if (!file) { setErr('ERR: NO IMAGE SELECTED'); return }
    setErr('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('http://127.0.0.1:8000/predict', formData)
      localStorage.setItem('result', JSON.stringify(res.data))
      window.location.href = '/results'
    } catch (e) {
      console.error(e)
      setErr('ERR: CONNECTION TO BACKEND FAILED')
      setLoading(false)
    }
  }

  return (
    <div className="center">
      <motion.div
        className="card"
        style={{ width: 420 }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="scan-line" />

        <h2>IMAGE ANALYSIS</h2>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 8 }}>
          {['EfficientNet', 'Sliding Win', 'CNN'].map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '2px',
              color: 'var(--cyan)', opacity: 0.6, textTransform: 'uppercase',
            }}>{tag}</span>
          ))}
        </div>

        {/* Upload zone */}
        <div
          className="upload-zone"
          style={{ marginTop: 24 }}
          onClick={() => document.getElementById('file-in').click()}
        >
          <input
            id="file-in" type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { setFile(e.target.files[0]); setErr('') }}
          />
          <span className="upload-icon">⬡</span>
          {file ? (
            <div className="file-name">{file.name}</div>
          ) : (
            <>
              <div className="upload-label">Drop image or click to select</div>
              <div className="upload-sublabel">PNG · JPG · JPEG · WEBP</div>
            </>
          )}
        </div>

        {err && <div className="error-msg">{err}</div>}

        <button onClick={handleUpload} disabled={loading} style={{ marginTop: 8 }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div className="loading-dots" style={{ margin: 0 }}><span /><span /><span /></div>
              ANALYZING
            </span>
          ) : 'RUN DETECTION ›'}
        </button>

        {/* Footer meta */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(0,245,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
          {[['MODEL', 'EfficientNet'], ['BACKEND', 'Flask'], ['MODE', 'Detection']].map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '2px' }}>{k}</div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--cyan)', marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}