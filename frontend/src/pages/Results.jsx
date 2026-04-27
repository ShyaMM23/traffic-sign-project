import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LANGUAGES = [
  { code: 'tamil',     label: 'Tamil',     script: 'தமிழ்'   },
  { code: 'hindi',     label: 'Hindi',     script: 'हिंदी'     },
  { code: 'telugu',    label: 'Telugu',    script: 'తెలుగు'   },
  { code: 'kannada',   label: 'Kannada',   script: 'ಕನ್ನಡ'   },
  { code: 'malayalam', label: 'Malayalam', script: 'മലയാളം' },
]

export default function Results() {
  const nav    = useNavigate()
  const result = JSON.parse(localStorage.getItem('result') || '{}')

  const label      = result?.label ?? result?.class ?? '—'
  const rawConf    = result?.confidence ?? result?.score ?? 0
  const confidence = parseFloat(rawConf) || 0
  const pct        = Math.round(confidence > 1 ? confidence : confidence * 100)

  const [selectedLang, setSelectedLang]   = useState(
    result?.language ?? 'tamil'
  )
  const [ocrText, setOcrText]             = useState(
    result?.ocr_text ?? null
  )
  const [transliteration, setTranslit]    = useState(
    result?.transliteration ?? null
  )
  const [transLoading, setTransLoading]   = useState(false)
  const [transError,   setTransError]     = useState('')

  const fetchTransliteration = async (lang) => {
    setSelectedLang(lang)
    setTransError('')
    const storedFile = window._lastDetectFile  
    if (!storedFile) {
      setTransError('Re-upload image to change language.')
      return
    }

    setTransLoading(true)
    try {
      const form = new FormData()
      form.append('image', storedFile)
      const res = await axios.post(
        `http://127.0.0.1:5000/detect?lang=${lang}`, form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setOcrText(res.data.ocr_text)
      setTranslit(res.data.transliteration)
      localStorage.setItem('result', JSON.stringify(res.data))
    } catch {
      setTransError('Could not fetch transliteration. Check backend.')
    } finally {
      setTransLoading(false)
    }
  }

  return (
    <div className="center">
      <motion.div
        className="card"
        style={{ width: 480 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="scan-line" />

        <h2>DETECTION RESULT</h2>

        {/* ── Detected class ────────────────────────────────────────────── */}
        <div className="result-display">
          <motion.div
            className="result-class"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {label}
          </motion.div>
          <span className="result-badge">✓ Classified</span>
        </div>

        {/* ── Confidence bar ────────────────────────────────────────────── */}
        <div className="confidence-bar-wrap">
          <div className="confidence-label">
            <span>Confidence Score</span>
            <span>{pct}%</span>
          </div>
          <div className="confidence-bar">
            <motion.div
              className="confidence-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* ── Detection data table ──────────────────────────────────────── */}
        <div style={{ marginTop: 20 }}>
          {[
            ['Detected Class', label],
            ['Confidence',     `${pct}%`],
            ['Model',          'EfficientNet + ResNet-50'],
            ['Backend',        'Flask · port 5000'],
            ['Status',         'COMPLETE'],
          ].map(([k, v]) => (
            <div className="data-row" key={k}>
              <span className="data-key">{k}</span>
              <span className="data-val">{String(v)}</span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24,
          padding: '20px',
          border: '1px solid var(--border)',
          borderRadius: 4,
          background: 'rgba(0,245,255,0.03)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: 'var(--font-data)', fontSize: 10,
            letterSpacing: '3px', color: 'var(--cyan)',
            textTransform: 'uppercase', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ opacity: 0.5 }}></span> OCR + TRANSLITERATION
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => fetchTransliteration(l.code)}
                disabled={transLoading}
                style={{
                  width: 'auto',
                  padding: '5px 14px',
                  fontSize: 11,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-data)',
                  marginTop: 0,
                  border: selectedLang === l.code
                    ? '1px solid var(--cyan)'
                    : '1px solid var(--border)',
                  background: selectedLang === l.code
                    ? 'var(--cyan-dim)'
                    : 'transparent',
                  color: selectedLang === l.code
                    ? 'var(--cyan)'
                    : 'var(--text-dim)',
                  boxShadow: selectedLang === l.code
                    ? '0 0 12px rgba(0,245,255,0.2)'
                    : 'none',
                  cursor: transLoading ? 'not-allowed' : 'pointer',
                  opacity: transLoading ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
                title={l.script}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* OCR text */}
          <div className="data-row" style={{ paddingBottom: 10 }}>
            <span className="data-key">OCR Text (English)</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-data)', fontSize: 12,
            color: ocrText ? 'var(--text)' : 'var(--text-dim)',
            letterSpacing: '1px', marginBottom: 12,
            padding: '8px 12px',
            background: 'rgba(0,245,255,0.04)',
            border: '1px solid rgba(0,245,255,0.08)',
            borderRadius: 2, minHeight: 36,
          }}>
            {transLoading ? (
              <div className="loading-dots" style={{ margin: '4px 0' }}>
                <span /><span /><span />
              </div>
            ) : (
              ocrText ?? '—  Upload image and run detection'
            )}
          </div>

          {/* Transliteration output */}
          <div className="data-row" style={{ paddingBottom: 10 }}>
            <span className="data-key">
              Transliteration
              ({LANGUAGES.find(l => l.code === selectedLang)?.script})
            </span>
          </div>
          <div style={{
            fontSize: 18,
            color: transliteration ? 'var(--green)' : 'var(--text-dim)',
            textShadow: transliteration
              ? '0 0 15px rgba(0,255,136,0.4)' : 'none',
            letterSpacing: '2px', lineHeight: 1.6,
            padding: '10px 12px',
            background: 'rgba(0,255,136,0.04)',
            border: '1px solid rgba(0,255,136,0.12)',
            borderRadius: 2, minHeight: 48,
          }}>
            {transLoading ? (
              <div className="loading-dots" style={{ margin: '8px 0' }}>
                <span /><span /><span />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={transliteration}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {transliteration ?? '—'}
                </motion.span>
              </AnimatePresence>
            )}
          </div>

          {/* Error message */}
          {transError && (
            <div className="error-msg" style={{ marginTop: 10 }}>
              {transError}
            </div>
          )}

          {/* Help text */}
          <p style={{
            marginTop: 10, fontSize: 10,
            color: 'var(--text-dim)', letterSpacing: '1px', opacity: 0.6,
          }}>
            Select a language above to transliterate sign text.
            The image is re-sent to the backend with the chosen language.
          </p>
        </div>

        {/* ── Action buttons ────────────────────────────────────────────── */}
        <button onClick={() => nav('/model')} style={{ marginTop: 24 }}>
          ANALYZE ANOTHER ›
        </button>
        <button className="btn-secondary" onClick={() => nav('/home')}>
          RETURN TO HOME
        </button>
      </motion.div>
    </div>
  )
}