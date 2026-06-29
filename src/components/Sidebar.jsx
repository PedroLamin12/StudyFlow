import React from 'react'
import { Home, Calendar, Trophy, User, Zap, BookOpen } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp } from '../contexts/AppContext'

export default function Sidebar({ activeTab, onTabChange }) {
  const { theme } = useTheme()
  const { user } = useApp()
  const isDark = theme === 'dark'

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendário' },
    { id: 'achievements', icon: Trophy, label: 'Conquistas' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ]

  return (
    <aside className={`sticky top-0 h-screen flex flex-col p-4 transition-colors duration-300 ${isDark ? 'bg-dark-card' : 'bg-white border-r border-slate-200'}`}>
      <div className="flex items-center gap-2 px-3 py-4 mb-6">
        <Zap size={20} className="text-neon-blue" strokeWidth={2.5} />
        <BookOpen size={20} className="text-neon-purple" strokeWidth={2.5} />
        <h1 className="text-lg font-extra-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">StudyFlow</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isActive ? 'bg-neon-blue/10 text-neon-blue font-bold' : isDark ? 'text-white/60 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{tab.label}</span>
              {isActive && <div className="ml-auto w-2 h-2 bg-neon-blue rounded-full"></div>}
            </button>
          )
        })}
      </nav>

      <div className={`mt-auto p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-neon-purple flex-shrink-0">
            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 flex items-center justify-center text-xs">👨‍💻</div>}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
            <p className="text-xs text-neon-purple font-medium">Nível {user.level}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
