import { useState, useRef } from 'react'
import axios from 'axios'
import styles from './Detect.module.css'

export default function Detect() {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = f => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError('')
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleDetect = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await axios.post('/api/predict/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        'Could not reach the detection server. Make sure it is running on port 8000.'
      )
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
  }

  const pct = result ? Math.round(parseFloat(result.confidence) * 100) : 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Detect Sign</h1>
        <p className={styles.subtitle}>Upload a photo and our AI will classify the traffic sign instantly.</p>
      </div>

      <div className={styles.grid}>
        {/* Upload panel */}
        <div className={styles.panel}>
          {/* Drop zone */}
          <div
            className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${preview ? styles.hasImage : ''}`}
            onClick={() => !preview && inputRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={e => handleFile(e.target.files[0])}
            />
            {preview ? (
              <img src={preview} alt="Preview" className={styles.previewImg} />
            ) : (
              <div className={styles.dropContent}>
                <span className={styles.dropIcon}>📷</span>
                <p className={styles.dropText}>Drop image here</p>
                <p className={styles.dropSub}>or click to browse — PNG, JPG, WEBP</p>
              </div>
            )}
          </div>

          {/* Filename */}
          {file && (
            <p className={styles.fileName}>
              <span className={styles.fileNameLabel}>Selected:</span> {file.name}
            </p>
          )}

          {error && (
            <div className={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.btnOutline}
              onClick={() => preview ? reset() : inputRef.current.click()}
            >
              {preview ? 'Clear' : 'Choose File'}
            </button>
            <button
              className={styles.btnPrimary}
              onClick={handleDetect}
              disabled={!file || loading}
            >
              {loading
                ? <><span className={styles.spinner} /> Analyzing…</>
                : 'Detect Sign'}
            </button>
          </div>
        </div>

        {/* Result panel */}
        <div className={styles.panel}>
          {!result && !loading && (
            <div className={styles.emptyResult}>
              <span className={styles.emptyIcon}>◎</span>
              <p className={styles.emptyText}>Results will appear here</p>
              <p className={styles.emptySub}>Upload an image and click Detect Sign</p>
            </div>
          )}

          {loading && (
            <div className={styles.emptyResult}>
              <span className={styles.bigSpinner} />
              <p className={styles.emptyText}>Analyzing image…</p>
              <p className={styles.emptySub}>Running inference on the model</p>
            </div>
          )}

          {result && (
            <div className={styles.resultContent}>
              <div className={styles.resultBadge}>✓ Detected</div>

              <div className={styles.resultClass}>{result.class}</div>

              <div className={styles.confSection}>
                <div className={styles.confHeader}>
                  <span className={styles.confLabel}>Confidence</span>
                  <span className={styles.confPct}>{pct}%</span>
                </div>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className={styles.dataTable}>
                {[
                  ['Sign Class',     result.class],
                  ['Raw Score',      result.confidence],
                  ['Model',          'ResNet-50'],
                  ['Dataset',        'GTSRB'],
                ].map(([k, v]) => (
                  <div key={k} className={styles.dataRow}>
                    <span className={styles.dataKey}>{k}</span>
                    <span className={styles.dataVal}>{v}</span>
                  </div>
                ))}
              </div>

              <button className={styles.btnOutline} onClick={reset} style={{ width: '100%', marginTop: 8 }}>
                Analyze Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
