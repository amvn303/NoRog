import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import InputScreen from './pages/InputScreen'
import ResultScreen from './pages/ResultScreen'
import SimulationScreen from './pages/SimulationScreen'
import ProfileScreen from './pages/ProfileScreen'

function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/analyze', label: 'Analyze', icon: '🩺' },
    { to: '/profile', label: 'Profile', icon: '📊' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)]"
         style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
               style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))' }}>
            🩺
          </div>
          <span className="text-xl font-bold gradient-text">NoRog</span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={() => {
                const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
                return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-[var(--color-brand-light)] bg-[rgba(108,92,231,0.15)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-hover)]'
                }`
              }}>
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] p-4 flex flex-col gap-2 animate-fade-in"
             style={{ background: 'rgba(10, 10, 15, 0.95)' }}>
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={() => {
                const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
                return `px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
                  isActive
                    ? 'text-[var(--color-brand-light)] bg-[rgba(108,92,231,0.15)]'
                    : 'text-[var(--color-text-secondary)]'
                }`
              }}>
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

function App() {
  const [lastResult, setLastResult] = useState(null)
  const [lastBehaviors, setLastBehaviors] = useState(null)

  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard lastResult={lastResult} />} />
          <Route path="/analyze" element={<InputScreen onResult={(r, b) => { setLastResult(r); setLastBehaviors(b); }} />} />
          <Route path="/results" element={<ResultScreen result={lastResult} />} />
          <Route path="/simulation" element={<SimulationScreen result={lastResult} behaviors={lastBehaviors} />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </main>

      {/* Disclaimer Footer */}
      <footer className="text-center py-6 px-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
        <p>⚕️ NoRog is a behavioral health intelligence tool, not a medical diagnosis system.</p>
        <p className="mt-1">Always consult a qualified healthcare professional for medical advice.</p>
      </footer>
    </BrowserRouter>
  )
}

export default App
