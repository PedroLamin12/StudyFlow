import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function TaskCard({ task, onToggle }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const priorityColors = { low: 'text-blue-400', normal: 'text-yellow-400', high: 'text-error' }
  const priorityLabels = { low: 'Baixa', normal: 'Normal', high: 'Alta' }

  return (
    <div className={`rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01] ${
      task.completed
        ? isDark ? 'opacity-40 bg-white/5 border-white/5' : 'opacity-40 bg-slate-50 border-slate-100'
        : isDark ? 'bg-dark-card border-white/10 hover:border-neon-blue/50' : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'
    }`}>
      <div className="flex items-start gap-4">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`text-sm font-bold transition-all duration-300 ${task.completed ? 'line-through' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.subject}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${priorityColors[task.priority]} border-current/30`}>{priorityLabels[task.priority]}</span>
          </div>
          <p className={`text-sm ${task.completed ? 'line-through' : ''} ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{task.name}</p>
          <div className={`flex items-center gap-3 mt-2 text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            <span>⏰ {task.time}</span>
            {task.date && <span>📅 {task.date.split('-').reverse().join('/')}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
