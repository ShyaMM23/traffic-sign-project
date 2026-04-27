import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import styles from './Layout.module.css'

const nav = [
  { to: '/home',   label: 'Home',   icon: '⌂' },
  { to: '/detect', label: 'Detect', icon: '◎' },
  { to: '/about',  label: 'About',  icon: 'ℹ' },
]

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🚦</span>
          <span className={styles.brandName}>Traffic AI</span>
        </div>

        <nav className={styles.nav}>
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navActive : ''}`
              }
            >
              <span className={styles.navIcon}>{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className={styles.signOut}
          onClick={() => navigate('/')}
        >
          <span>↩</span>
          <span>Sign out</span>
        </button>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
