import { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const isLanding = location.pathname === '/'
  const logoTarget = isLoggedIn ? '/dashboard' : '/'

  useEffect(() => {
    document.body.classList.remove('nav-open')
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="layout">
      <header className={`header ${isLanding ? 'header-landing' : ''}`}>
        <div className="container header-inner">
          <Link to={logoTarget} className="logo">
            Persona<span>AI</span>
          </Link>
          <nav className="nav">
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
                <Link to="/assessment" className={location.pathname === '/assessment' ? 'active' : ''}>Assessment</Link>
                <Link to="/report" className={location.pathname === '/report' ? 'active' : ''}>Report</Link>
              </>
            )}
            {location.pathname !== '/login' && location.pathname !== '/register' && (
              location.pathname === '/login' ? (
                <Link to="/register" className="btn btn-secondary btn-sm">Sign Up</Link>
              ) : location.pathname === '/register' ? (
                <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              ) : isLoggedIn ? (
                <button type="button" className="btn btn-logout btn-sm" onClick={handleLogout}>Log out</button>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Log In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Start Assessment</Link>
                </>
              )
            )}
          </nav>
          <button type="button" className="menu-toggle" aria-label="Menu" onClick={() => document.body.classList.toggle('nav-open')}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>AI-Powered Real-Time Confidence Monitoring &amp; Enhancement System — Frontend prototype. Not for clinical diagnosis.</p>
          <p className="footer-credit">Developed by Sharvil Maind</p>
        </div>
      </footer>
    </div>
  )
}
