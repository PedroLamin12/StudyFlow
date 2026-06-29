import React from 'react'
import { Trophy, Flame, BookOpen, Moon, Target, Zap, CheckCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp, getXpForLevel } from '../contexts/AppContext'

const ICON_MAP = { Flame, BookOpen, Moon, Target, Zap }

export default function RightPanel() {
  const { theme } = useTheme()
  const { user, achievements } = useApp()
  const isDark = theme === 'dark'

  const xpNeeded = getXpForLevel(user.level)
  const progressPercent = Math.min(Math.round((user.xp / xpNeeded) * 100), 100)
  const recentAchievements = achievements.filter(a => a.unlocked).slice(0, 3)

  return (
    <aside className={`sticky top-0 h-screen overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
      {/* Perfil Rápido */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-100'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neon-purple">
            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 flex items-center justify-center text-xl">👨‍💻</div>}
          </div>
          <div>
            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{user.institution}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-lg font-extra-bold text-neon-blue">{user.totalTasksCompleted}</p><p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Missões</p></div>
          <div><p className="text-lg font-extra-bold text-neon-purple">{user.xp}</p><p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>XP</p></div>
          <div><p className="text-lg font-extra-bold text-warning">{user.streak}</p><p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Ofensiva</p></div>
        </div>
      </div>

      {/* Progresso */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 border border-neon-purple/30' : 'bg-purple-50 border border-purple-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Nível {user.level}</h4>
          <Trophy size={16} className="text-neon-purple" />
        </div>
        <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-purple-100'}`}>
          <div className="h-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className={`text-xs mt-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{user.xp}/{xpNeeded} XP ({progressPercent}%)</p>
      </div>

      {/* Conquistas Recentes */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-100'}`}>
        <h4 className={`font-bold text-sm mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Conquistas Recentes</h4>
        {recentAchievements.length > 0 ? (
          <div className="space-y-2">
            {recentAchievements.map(a => {
              const Icon = ICON_MAP[a.icon] || Flame
              return (
                <div key={a.id} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white border border-slate-100'}`}>
                  <Icon size={14} className={a.color} />
                  <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{a.name}</span>
                  <CheckCircle size={12} className="text-success ml-auto" />
                </div>
              )
            })}
          </div>
        ) : (
          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Complete tarefas para desbloquear!</p>
        )}
      </div>

      <div className={`p-4 rounded-xl ${isDark ? 'bg-neon-blue/10 border border-neon-blue/20' : 'bg-blue-50 border border-blue-100'}`}>
        <p className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>💡 +50 XP por tarefa. Nível × 200 para subir!</p>
      </div>
    </aside>
  )
}
