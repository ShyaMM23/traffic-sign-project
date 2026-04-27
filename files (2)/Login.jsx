import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!username.trim()) e.username = 'Username is required'
    if (!password.trim()) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    navigate('/home')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🚦</div>
          <h1 className={styles.title}>Traffic AI</h1>
          <p className={styles.subtitle}>Sign detection powered by deep learning</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.formTitle}>Sign in</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder="Enter your username"
              value={username}
              onChange={e => { setUsername(e.target.value); setErrors(v => ({ ...v, username: '' })) }}
              autoComplete="username"
            />
            {errors.username && <span className={styles.errMsg}>{errors.username}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })) }}
              autoComplete="current-password"
            />
            {errors.password && <span className={styles.errMsg}>{errors.password}</span>}
          </div>

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading
              ? <span className={styles.spinner} aria-hidden />
              : 'Sign In'}
          </button>

          <p className={styles.hint}>Use any credentials for the demo</p>
        </form>
      </div>
    </div>
  )
}
