import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { postPredict } from '../api/client'

const ALL_SYMPTOMS = [
  'cough', 'sore throat', 'runny nose', 'sneezing', 'shortness of breath',
  'chest tightness', 'wheezing', 'headache', 'dizziness', 'brain fog',
  'difficulty concentrating', 'memory issues', 'nausea', 'stomach pain',
  'bloating', 'diarrhea', 'loss of appetite', 'body aches', 'back pain',
  'neck pain', 'joint pain', 'fatigue', 'insomnia', 'anxiety', 'mood swings',
  'irritability', 'low motivation', 'skin rash', 'acne', 'dry skin',
  'fever', 'chills', 'sweating', 'weight gain', 'weight loss',
  'frequent urination', 'excessive thirst', 'eye strain', 'blurred vision'
]

const GOALS = [
  { value: 'general wellness', label: '🌿 General Wellness' },
  { value: 'study focus', label: '📚 Study Focus' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'stress relief', label: '🧘 Stress Relief' },
  { value: 'better sleep', label: '😴 Better Sleep' },
]

export default function InputScreen({ onResult, userContext, activeProfile }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [symptomSearch, setSymptomSearch] = useState('')
  const [behaviors, setBehaviors] = useState({
    screenTime: '', sleepQuality: '', focusLevel: '',
    exerciseFrequency: '', dietQuality: '', stressLevel: ''
  })
  const [goal, setGoal] = useState('general wellness')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Preselect symptoms from navigation state
  useEffect(() => {
    if (location.state?.preselected) {
      setSelectedSymptoms(location.state.preselected)
    }
  }, [location.state])

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const filteredSymptoms = ALL_SYMPTOMS.filter(s =>
    s.toLowerCase().includes(symptomSearch.toLowerCase())
  )

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.')
      return
    }
    setError('')
    setLoading(true)
    try {
      // Filter out empty behavior values
      const cleanBehaviors = Object.fromEntries(
        Object.entries(behaviors).filter(([, v]) => v !== '')
      )
      const res = await postPredict({
        userId: userContext?.userId,
        profileId: activeProfile?.id,
        symptoms: selectedSymptoms,
        behaviors: cleanBehaviors,
        goal
      })
      if (res.success) {
        onResult(res.data, cleanBehaviors)
        navigate('/results')
      } else {
        setError(res.error || 'Analysis failed.')
      }
    } catch (e) {
      setError('Failed to connect to the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const BehaviorSelect = ({ label, icon, name, options }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1.5">
        <span>{icon}</span> {label}
      </label>
      <select value={behaviors[name]}
              onChange={e => setBehaviors({ ...behaviors, [name]: e.target.value })}
              className="bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors appearance-none cursor-pointer">
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold mb-1">Health Analysis</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Select your symptoms and describe your lifestyle for a comprehensive behavioral health analysis.
        </p>
      </div>

      {/* Symptoms Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🩺</span> Symptoms
          {selectedSymptoms.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(108,92,231,0.15)] text-[var(--color-brand-light)]">
              {selectedSymptoms.length} selected
            </span>
          )}
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <input type="text" placeholder="Search symptoms..."
                 value={symptomSearch} onChange={e => setSymptomSearch(e.target.value)}
                 className="w-full bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl px-4 py-3 pl-10 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] transition-colors" />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">🔍</span>
        </div>

        {/* Selected symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedSymptoms.map(s => (
              <button key={s} onClick={() => toggleSymptom(s)}
                      className="symptom-chip selected text-xs group">
                {s}
                <span className="ml-1.5 opacity-60 group-hover:opacity-100">✕</span>
              </button>
            ))}
            <button onClick={() => setSelectedSymptoms([])}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] px-2 py-1 transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Symptom chips grid */}
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredSymptoms.map(s => (
            <button key={s} onClick={() => toggleSymptom(s)}
                    className={`symptom-chip text-xs ${selectedSymptoms.includes(s) ? 'selected' : ''}`}>
              {s}
            </button>
          ))}
          {filteredSymptoms.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)] py-4">No matching symptoms found.</p>
          )}
        </div>
      </div>

      {/* Behavior Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🧠</span> Behavior & Lifestyle
          <span className="text-xs text-[var(--color-text-muted)] font-normal">(optional)</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <BehaviorSelect label="Screen Time" icon="📱" name="screenTime"
            options={[{value:'low',label:'Low (< 2hrs)'},{value:'medium',label:'Medium (2-6hrs)'},{value:'high',label:'High (6+ hrs)'}]} />
          <BehaviorSelect label="Sleep Quality" icon="😴" name="sleepQuality"
            options={[{value:'good',label:'Good'},{value:'fair',label:'Fair'},{value:'poor',label:'Poor'}]} />
          <BehaviorSelect label="Focus Level" icon="🎯" name="focusLevel"
            options={[{value:'high',label:'High'},{value:'medium',label:'Medium'},{value:'low',label:'Low'}]} />
          <BehaviorSelect label="Exercise" icon="🏃" name="exerciseFrequency"
            options={[{value:'high',label:'Daily'},{value:'moderate',label:'Few times/week'},{value:'low',label:'Rarely'},{value:'none',label:'Never'}]} />
          <BehaviorSelect label="Diet Quality" icon="🥗" name="dietQuality"
            options={[{value:'good',label:'Good/Balanced'},{value:'fair',label:'Fair'},{value:'poor',label:'Poor/Junk'}]} />
          <BehaviorSelect label="Stress Level" icon="😰" name="stressLevel"
            options={[{value:'low',label:'Low'},{value:'medium',label:'Medium'},{value:'high',label:'High'}]} />
        </div>
      </div>

      {/* Goal Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🎯</span> Your Goal
        </h2>
        <div className="flex flex-wrap gap-2">
          {GOALS.map(g => (
            <button key={g.value} onClick={() => setGoal(g.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      goal === g.value
                        ? 'border-[var(--color-brand)] bg-[rgba(108,92,231,0.15)] text-[var(--color-brand-light)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-light)]'
                    }`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card p-4 border-l-4 border-l-[var(--color-danger)] text-sm text-[var(--color-danger)]">
          ⚠️ {error}
        </div>
      )}

      {/* Analyze Button */}
      <div className="flex justify-center pt-2">
        <button onClick={handleAnalyze} disabled={loading || selectedSymptoms.length === 0}
                className="btn-primary text-lg px-12 py-4 animate-pulse-glow disabled:animate-none">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Analyzing...
            </span>
          ) : (
            '🔍 Analyze My Health'
          )}
        </button>
      </div>
    </div>
  )
}
