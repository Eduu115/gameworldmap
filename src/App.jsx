import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { NavBar } from './components/nav/NavBar'
import { AppShell } from './components/layout/AppShell'
import { Toast } from './components/feedback/Toast'
import { MapPage } from './pages/MapPage'
import { LandingPage } from './pages/LandingPage'
import { ListPage } from './pages/ListPage'
import { StatsPage } from './pages/StatsPage'
import { api, normalizeGame } from './api.js'

function App() {
  const [activeView, setActiveView] = useState('home')
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountryId, setSelectedCountryId] = useState(null)
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState({ open: false, message: null })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.games({ limit: 500, page: 1 })
        if (!cancelled) setGames(data.results.map(normalizeGame))
      } catch (err) {
        console.error('Failed to load games:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (activeView !== 'map') return
    const t = window.setTimeout(() => setSelectedCountryId('japan'), 600)
    return () => window.clearTimeout(t)
  }, [activeView])

  const totalCountries = useMemo(
    () => new Set(games.map((g) => g.countryId).filter(Boolean)).size,
    [games],
  )

  const showToast = (message) => setToast({ open: true, message })

  return (
    <AppShell
      nav={
        activeView === 'home' ? null : (
          <NavBar
            activeView={activeView}
            onChangeView={setActiveView}
            totalGames={games.length}
            totalCountries={totalCountries}
            user={user}
            onLogin={() => showToast('Login coming soon!')}
          />
        )
      }
    >
      {loading ? (
        <div className="main">
          <div className="map-container" style={{ display: 'grid', placeItems: 'center' }}>
            <div className="empty-state">
              <div className="empty-text">Loading catalog...</div>
            </div>
          </div>
        </div>
      ) : activeView === 'home' ? (
        <LandingPage
          onGoToMap={() => setActiveView('map')}
          totalGames={games.length}
          totalCountries={totalCountries}
        />
      ) : activeView === 'map' ? (
        <MapPage
          games={games}
          selectedCountryId={selectedCountryId}
          onSelectCountryId={setSelectedCountryId}
        />
      ) : activeView === 'list' ? (
        <ListPage games={games} user={user} onLoginRequired={() => showToast('Login to track games')} />
      ) : activeView === 'stats' ? (
        <StatsPage games={games} />
      ) : null}

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: null })}
      />
    </AppShell>
  )
}

export default App
