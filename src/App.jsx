import React, { useState } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { AppProvider, useApp } from './contexts/AppContext'
import Login from './views/Login'
import Home from './views/Home'
import Calendario from './views/Calendario'
import Conquistas from './views/Conquistas'
import Perfil from './views/Perfil'
import Sidebar from './components/Sidebar'
import BottomNavigation from './components/BottomNavigation'
import RightPanel from './components/RightPanel'
import NewTaskModal from './components/NewTaskModal'
import LevelUpAlert from './components/LevelUpAlert'

function AppContent() {
  const { theme } = useTheme()
  const { isAuthenticated, authLoading, levelUpAlert } = useApp()
  const [activeTab, setActiveTab] = useState('home')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isDark = theme === 'dark'

  // Loading state
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-bg' : 'bg-slate-50'}`}>
        <div className="animate-pulse text-neon-blue text-xl font-bold">Carregando...</div>
      </div>
    )
  }

  // GUARDA DE ROTA: Se não autenticado, força Login
  if (!isAuthenticated) {
    return <Login />
  }

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <Home onOpenModal={() => setIsModalOpen(true)} />
      case 'calendar': return <Calendario />
      case 'achievements': return <Conquistas />
      case 'profile': return <Perfil />
      default: return <Home onOpenModal={() => setIsModalOpen(true)} />
    }
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? 'bg-dark-bg text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* DESKTOP */}
      <div className="hidden md:grid md:grid-cols-[256px_1fr_300px] min-h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className={`overflow-y-auto min-h-screen border-x transition-colors duration-300 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          {renderView()}
        </main>
        <RightPanel />
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto pb-24">
          {renderView()}
        </main>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Modal */}
      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Level Up */}
      {levelUpAlert && <LevelUpAlert level={levelUpAlert.level} />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  )
}
