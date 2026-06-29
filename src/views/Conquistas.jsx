import React from 'react'
import { Lock, Flame, Moon, BookOpen, Zap, Target, CheckCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp, getXpForLevel } from '../contexts/AppContext'

const ICON_MAP = { Flame, Moon, BookOpen, Zap, Target }

export default function Conquistas() {
  const { theme } = useTheme()
  const { user, achievements } = useApp()
  const isDark = theme === 'dark'

  const xpNeeded = getXpForLevel(user.level)
  const progressPercent = Math.min(Math.round((user.xp / xpNeeded) * 100), 100)
  const unlockedCount = achievements.filter(b => b.unlocked).length

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-2xl font-extra-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Conquistas & Gamificação</h2>

      {/* Progresso */}
      <div className={`p-6 rounded-xl mb-6 ${isDark ? 'bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 border border-neon-purple/30' : 'bg-purple-50 border border-purple-100'}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={`text-3xl font-extra-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Nível {user.level}</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Faltam {xpNeeded - user.xp} XP para o Nível {user.level + 1}</p>
          </div>
          <div className="text-4xl">🏆</div>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-purple-100'}`}>
          <div className="h-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="flex justify-between mt-3">
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{user.xp} / {xpNeeded} XP</span>
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{progressPercent}%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-2xl font-extra-bold text-neon-blue">{unlockedCount}</div>
          <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Desbloqueadas</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-2xl font-extra-bold text-neon-purple">{achievements.length - unlockedCount}</div>
          <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Bloqueadas</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-2xl font-extra-bold text-warning">{user.streak}</div>
          <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Ofensiva</p>
        </div>
      </div>

      {/* Medalhas */}
      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Suas Medalhas</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map(badge => {
          const Icon = ICON_MAP[badge.icon] || Flame
          return (
            <div key={badge.id} className={`relative rounded-xl p-4 border transition-all duration-300 overflow-hidden hover:scale-105 ${
              badge.unlocked
                ? isDark ? `bg-gradient-to-br ${badge.bgColor} border-white/20` : 'bg-white border-slate-200 shadow-sm'
                : isDark ? 'bg-white/5 border-white/10 opacity-50 grayscale' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
            }`}>
              <div className="relative z-10">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-lg ${badge.unlocked ? isDark ? 'bg-white/10' : 'bg-slate-50' : isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <Icon size={28} className={badge.unlocked ? badge.color : isDark ? 'text-white/30' : 'text-slate-300'} />
                  </div>
                </div>
                {!badge.unlocked ? (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-slate-800"><Lock size={10} className="text-white/40" /></div>
                ) : (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-success/20"><CheckCircle size={10} className="text-success" /></div>
                )}
                <h4 className={`text-xs font-bold text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{badge.name}</h4>
                <p className={`text-[10px] text-center mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{badge.description}</p>
                {badge.unlocked && <div className="mt-2 text-center"><span className="text-[10px] font-medium text-success bg-success/20 px-2 py-0.5 rounded-full">✓</span></div>}
              </div>
            </div>
          )
        })}
      </div>

      <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-neon-blue/10 border border-neon-blue/20' : 'bg-blue-50 border border-blue-100'}`}>
        <p className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>💡 Cada tarefa = +50 XP. Fórmula: Nível × 200 XP para subir.</p>
      </div>
    </div>
  )
}
