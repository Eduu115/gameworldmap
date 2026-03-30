import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { NavBar } from './components/nav/NavBar'
import { AppShell } from './components/layout/AppShell'
import { AddGameModal } from './components/modals/AddGameModal'
import { Toast } from './components/feedback/Toast'
import { SEED_GAMES } from './data/seedGames'
import { uniqueCountriesCount } from './utils/gameStats'
import { MapPage } from './pages/MapPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  const [activeView, setActiveView] = useState('home')
  const [games, setGames] = useState(() => SEED_GAMES)
  const [selectedCountryId, setSelectedCountryId] = useState(null)
  const [activeFilters, setActiveFilters] = useState(['completed', 'playing', 'abandoned', 'wishlist'])
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState({ open: false, title: null })

  const totalCountries = useMemo(() => uniqueCountriesCount(games), [games])

  useEffect(() => {
    if (activeView !== 'map') return
    const t = window.setTimeout(() => setSelectedCountryId('japan'), 600)
    return () => window.clearTimeout(t)
  }, [activeView])

  const toggleFilter = (status) => {
    setActiveFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const saveGame = (game) => {
    setGames((prev) => [...prev, game])
    setAddOpen(false)
    setSelectedCountryId(game.countryId)
    setToast({ open: true, title: game.title })
  }

  return (
    <AppShell
      nav={
        activeView === 'home' ? null : (
          <NavBar
            activeView={activeView}
            onChangeView={setActiveView}
            totalGames={games.length}
            totalCountries={totalCountries}
            onAddGame={() => setAddOpen(true)}
          />
        )
      }
    >
      {activeView === 'home' ? (
        <LandingPage
          onGoToMap={() => setActiveView('map')}
          onAddGame={() => setAddOpen(true)}
          totalGames={games.length}
          totalCountries={totalCountries}
        />
      ) : activeView === 'map' ? (
        <MapPage
          games={games}
          selectedCountryId={selectedCountryId}
          onSelectCountryId={setSelectedCountryId}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
        />
      ) : (
        <div className="main">
          <div className="map-container" style={{ display: 'grid', placeItems: 'center' }}>
            <div className="empty-state">
              <div className="empty-icon">🚧</div>
              <div className="empty-text">
                Vista <strong>{activeView.toUpperCase()}</strong> pendiente. La hemos dejado preparada con tabs para
                implementarla en `src/pages/`.
              </div>
            </div>
          </div>
          <div className="sidebar" />
        </div>
      )}

      <AddGameModal open={addOpen} onClose={() => setAddOpen(false)} onSave={saveGame} />

      <Toast
        open={toast.open}
        message={
          toast.title ? (
            <>
              <strong>{toast.title}</strong> added to your map
            </>
          ) : null
        }
        onClose={() => setToast({ open: false, title: null })}
      />
    </AppShell>
  )
}

export default App
