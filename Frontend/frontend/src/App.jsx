import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Dashboard from './pages/Dashboard'
import InputScreen from './pages/InputScreen'
import ResultScreen from './pages/ResultScreen'
import SimulationScreen from './pages/SimulationScreen'
import ProfileScreen from './pages/ProfileScreen'
import ChatScreen from './pages/ChatScreen'
import { bootstrapUser, createProfile } from './api/client'

function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/chat', label: 'Chat', icon: '💬' },
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
  const [userContext, setUserContext] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [activeProfileId, setActiveProfileId] = useState('')

  useEffect(() => {
    const init = async () => {
      const existingExternalId = localStorage.getItem('norog_external_id') || `local-${Date.now()}`
      localStorage.setItem('norog_external_id', existingExternalId)
      const res = await bootstrapUser(existingExternalId, 'NoRog User')
      if (res.success) {
        const userId = res.data.user.id
        const loadedProfiles = res.data.profiles || []
        setUserContext({ userId, externalId: existingExternalId, name: res.data.user.name })
        setProfiles(loadedProfiles)
        if (loadedProfiles.length) {
          setActiveProfileId(loadedProfiles[0].id)
        }
      }
    }
    init()
  }, [])

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) || null,
    [profiles, activeProfileId]
  )

  const addFamilyProfile = async () => {
    if (!userContext?.userId) return
    const name = prompt('Profile name (e.g., Father):')
    if (!name) return
    const relation = prompt('Relation (self/father/mother/sibling/other):', 'other') || 'other'
    const res = await createProfile({
      userId: userContext.userId,
      label: relation,
      displayName: name
    })
    if (res.success) {
      const next = [...profiles, res.data]
      setProfiles(next)
      setActiveProfileId(res.data.id)
    }
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto min-h-screen">
        <div className="glass-card p-3 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Active profile</span>
          <select
            value={activeProfileId}
            onChange={(e) => setActiveProfileId(e.target.value)}
            className="bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName} ({p.label})
              </option>
            ))}
          </select>
          <button onClick={addFamilyProfile} className="btn-secondary text-xs py-2 px-3">+ Add family profile</button>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard lastResult={lastResult} userContext={userContext} activeProfile={activeProfile} />} />
          <Route path="/chat" element={<ChatScreen userContext={userContext} activeProfile={activeProfile} onResult={(r, b) => { setLastResult(r); setLastBehaviors(b); }} />} />
          <Route path="/analyze" element={<InputScreen userContext={userContext} activeProfile={activeProfile} onResult={(r, b) => { setLastResult(r); setLastBehaviors(b); }} />} />
          <Route path="/results" element={<ResultScreen result={lastResult} />} />
          <Route path="/simulation" element={<SimulationScreen userContext={userContext} activeProfile={activeProfile} result={lastResult} behaviors={lastBehaviors} />} />
          <Route path="/profile" element={<ProfileScreen userContext={userContext} activeProfile={activeProfile} />} />
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
