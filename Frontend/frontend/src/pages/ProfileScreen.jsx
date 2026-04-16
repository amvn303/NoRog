import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, getDrift, getHistory } from '../api/client'

export default function ProfileScreen({ userContext, activeProfile }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [drift, setDrift] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, driftRes, histRes] = await Promise.all([
          getProfile({ userId: userContext?.userId, profileId: activeProfile?.id }),
          getDrift({ userId: userContext?.userId, profileId: activeProfile?.id }),
          getHistory({ userId: userContext?.userId, profileId: activeProfile?.id, limit: 10 })
        ])
        setProfile(profRes.data)
        setDrift(driftRes.data)
        setHistory(histRes.data || [])
      } catch (e) {
        console.error('Profile fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    if (userContext?.userId && activeProfile?.id) fetchData()
  }, [userContext, activeProfile])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-12 h-12 border-3 border-[var(--color-border)] border-t-[var(--color-brand)] rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--color-text-secondary)]">Loading your health profile...</p>
      </div>
    )
  }

  const prof = profile?.profile
  const noData = !prof || prof.totalSessions === 0

  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-xl font-semibold mb-2">No Health Profile Yet</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 text-center max-w-md">
          Start analyzing your symptoms and behaviors to build your personal health profile.
        </p>
        <button onClick={() => navigate('/analyze')} className="btn-primary">Start Your First Analysis</button>
      </div>
    )
  }

  const riskColor = prof.risk_level === 'high' ? 'var(--color-danger)' :
    prof.risk_level === 'moderate' ? 'var(--color-warning)' : 'var(--color-success)'
  const trendIcon = prof.trend === 'improving' ? '📈' : prof.trend === 'worsening' ? '📉' : '📊'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Health Profile</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Your aggregated health intelligence based on {prof.totalSessions} session(s)
        </p>
      </div>

      {/* Profile Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">Dominant Issue</p>
          <p className="text-lg font-bold gradient-text">{prof.dominant_issue}</p>
        </div>
        <div className="glass-card p-5 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">Trend</p>
          <p className="text-lg font-bold flex items-center gap-2">
            <span>{trendIcon}</span>
            <span className="capitalize">{prof.trend}</span>
          </p>
        </div>
        <div className="glass-card p-5 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">Risk Level</p>
          <p className="text-lg font-bold capitalize" style={{ color: riskColor }}>{prof.risk_level}</p>
        </div>
        <div className="glass-card p-5 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
          <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">Sessions</p>
          <p className="text-lg font-bold">{prof.totalSessions}</p>
        </div>
      </div>

      {/* Drift Detection */}
      {drift && drift.drift !== 'insufficient_data' && (
        <div className={`glass-card p-6 animate-fade-in-up stagger-3 border-l-4 ${
          drift.drift === 'increasing' ? 'border-l-[var(--color-danger)]' :
          drift.drift === 'decreasing' ? 'border-l-[var(--color-success)]' :
          drift.drift === 'recurring' ? 'border-l-[var(--color-warning)]' :
          'border-l-[var(--color-accent)]'
        }`} style={{ opacity: 0 }}>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            ⚡ Drift Detection
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              drift.severity === 'high' ? 'bg-[rgba(225,112,85,0.15)] text-[var(--color-danger)]' :
              drift.severity === 'moderate' ? 'bg-[rgba(253,203,110,0.15)] text-[var(--color-warning)]' :
              'bg-[rgba(0,184,148,0.15)] text-[var(--color-success)]'
            }`}>
              {drift.severity} severity
            </span>
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{drift.message}</p>

          {/* Recurring symptoms */}
          {drift.details?.recurringSymptoms?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">Recurring Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {drift.details.recurringSymptoms.map((s, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-[rgba(253,203,110,0.1)] border border-[rgba(253,203,110,0.3)] text-[var(--color-warning)]">
                    {s.symptom} ({s.percentage}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recurring Symptoms Chart */}
      {profile?.recurring_symptoms?.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            🔄 Top Recurring Symptoms
          </h3>
          <div className="space-y-3">
            {profile.recurring_symptoms.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm w-36 text-[var(--color-text-secondary)] truncate capitalize">{s.symptom}</span>
                <div className="flex-1 h-6 bg-[var(--color-bg-surface-alt)] rounded-full overflow-hidden relative">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out"
                       style={{
                         width: `${Math.min(s.percentage, 100)}%`,
                         background: `linear-gradient(90deg, var(--color-brand), var(--color-accent))`,
                         animationDelay: `${i * 0.1}s`
                       }} />
                  <span className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                    {s.occurrences}× ({s.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition History */}
      {profile?.condition_history?.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            📋 Condition History
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.condition_history.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] flex items-center justify-between">
                <span className="text-sm font-medium">{c.condition}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[rgba(108,92,231,0.15)] text-[var(--color-brand-light)]">
                  {c.occurrences}×
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session History Timeline */}
      {history.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            🕐 Recent Sessions
          </h3>
          <div className="space-y-3">
            {history.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-[var(--color-bg-surface-alt)] hover:bg-[var(--color-bg-surface-hover)] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(108,92,231,0.15)] text-sm flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <span className="font-medium text-sm truncate">{entry.normalizedConditions?.[0]?.name || 'Unknown'}</span>
                     <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                       entry.confidence === 'High' ? 'bg-[rgba(0,184,148,0.15)] text-[var(--color-success)]' :
                       entry.confidence === 'Moderate' ? 'bg-[rgba(253,203,110,0.15)] text-[var(--color-warning)]' :
                       'bg-[rgba(225,112,85,0.15)] text-[var(--color-danger)]'
                     }`}>{entry.confidence}</span>
                   </div>
                   <div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                     {entry.symptoms?.join(', ')}
                   </div>
                 </div>
                 <div className="text-xs text-[var(--color-text-muted)] flex-shrink-0">
                   {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
                 </div>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence */}
      <div className="glass-card p-4 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          ⚕️ Profile confidence: <span className="font-semibold">{profile?.confidence}</span> — {profile?.explanation}
        </p>
      </div>
    </div>
  )
}
