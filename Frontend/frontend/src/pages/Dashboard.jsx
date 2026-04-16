import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory, getDrift } from '../api/client'

const quickSymptoms = ['headache', 'fatigue', 'insomnia', 'anxiety', 'brain fog', 'back pain']

export default function Dashboard({ lastResult }) {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [drift, setDrift] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, driftRes] = await Promise.all([getHistory(5), getDrift()])
        setHistory(histRes.data || [])
        setDrift(driftRes.data || null)
      } catch (e) {
        console.error('Dashboard fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [lastResult])

  const latestResult = lastResult || (history.length > 0 ? history[0].result : null)
  const latestPrimary = latestResult?.prediction?.primary
  const latestConfidence = latestResult?.prediction?.confidence
  const riskLevel = latestResult?.behaviorAnalysis?.riskLevel || drift?.severity || 'unknown'

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Hero Section */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, var(--color-brand), transparent)', filter: 'blur(60px)' }} />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to <span className="gradient-text">NoRog</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl">
            Your AI-powered behavioral health intelligence system. Predict, understand, and evolve.
          </p>
          <button onClick={() => navigate('/analyze')}
                  className="btn-primary mt-6 text-base">
            🩺 Start Health Analysis
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Quick Symptoms */}
        <div className="glass-card p-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
            Quick Check
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickSymptoms.map(s => (
              <button key={s} onClick={() => navigate('/analyze', { state: { preselected: [s] } })}
                      className="symptom-chip text-xs">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Last Result */}
        <div className="glass-card p-6 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
            Last Analysis
          </h2>
          {latestPrimary ? (
            <div>
              <div className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{latestPrimary}</div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  latestConfidence === 'High' ? 'bg-[rgba(0,184,148,0.15)] text-[var(--color-success)]' :
                  latestConfidence === 'Moderate' ? 'bg-[rgba(253,203,110,0.15)] text-[var(--color-warning)]' :
                  'bg-[rgba(225,112,85,0.15)] text-[var(--color-danger)]'
                }`}>
                  {latestConfidence} Confidence
                </span>
              </div>
              <button onClick={() => navigate('/results')}
                      className="btn-secondary text-xs mt-4 py-2 px-4">
                View Details →
              </button>
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)] text-sm">No analyses yet. Start your first one!</p>
          )}
        </div>

        {/* Risk Indicator */}
        <div className="glass-card p-6 animate-fade-in-up stagger-3 flex flex-col items-center" style={{ opacity: 0 }}>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4 self-start">
            Risk Level
          </h2>
          <div className={`risk-gauge ${riskLevel}`}>
            <span className="relative z-10 text-lg font-bold capitalize">{riskLevel === 'unknown' ? '—' : riskLevel}</span>
          </div>
        </div>
      </div>

      {/* Drift Status */}
      {drift && drift.drift !== 'insufficient_data' && (
        <div className={`glass-card p-6 animate-fade-in-up stagger-4 border-l-4 ${
          drift.drift === 'increasing' ? 'border-l-[var(--color-danger)]' :
          drift.drift === 'decreasing' ? 'border-l-[var(--color-success)]' :
          'border-l-[var(--color-warning)]'
        }`} style={{ opacity: 0 }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {drift.drift === 'increasing' ? '⚠️' : drift.drift === 'decreasing' ? '✅' : '📊'}
            </span>
            <div>
              <h3 className="font-semibold mb-1">Health Drift: <span className="capitalize">{drift.drift}</span></h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{drift.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
            Recent Sessions
          </h2>
          <div className="space-y-3">
            {history.slice(0, 5).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--color-bg-surface-alt)] hover:bg-[var(--color-bg-surface-hover)] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🩺</span>
                  <div>
                    <div className="font-medium text-sm">{entry.result?.prediction?.primary || 'Unknown'}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {entry.symptoms?.slice(0, 3).join(', ')}{entry.symptoms?.length > 3 ? '...' : ''}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  entry.result?.prediction?.confidence === 'High' ? 'bg-[rgba(0,184,148,0.15)] text-[var(--color-success)]' :
                  entry.result?.prediction?.confidence === 'Moderate' ? 'bg-[rgba(253,203,110,0.15)] text-[var(--color-warning)]' :
                  'bg-[rgba(225,112,85,0.15)] text-[var(--color-danger)]'
                }`}>
                  {entry.result?.prediction?.confidence || '?'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
