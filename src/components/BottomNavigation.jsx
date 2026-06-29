import React from 'react'
import { Home, Calendar, Trophy, User } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function BottomNavigation({ activeTab, onTabChange }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendário' },
    { id: 'achievements', icon: Trophy, label: 'Conquistas' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ]

  return (
    <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-300 ${isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-slate-200'}`}>
      <div className="flex justify-around items-center h-20 px-4 max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${isActive ? 'text-neon-blue' : isDark ? 'text-white/40' : 'text-slate-400'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 ${isActive ? 'text-neon-blue font-bold' : ''}`}>{tab.label}</span>
              {isActive && <div className="w-1.5 h-1.5 bg-neon-blue rounded-full mt-0.5 animate-pulse"></div>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
