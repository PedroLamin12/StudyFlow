import React, { useMemo } from 'react'
import { Sun, Moon, Plus } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp, HOJE, formatDate, HOJE_STR } from '../contexts/AppContext'
import TaskCard from '../components/TaskCard'

export default function Home({ onOpenModal }) {
  const { theme, toggleTheme } = useTheme()
  const { user, tasks, filtroData, setFiltroData, handleTaskToggle } = useApp()
  const isDark = theme === 'dark'

  // Semana começando no Domingo 28/06/2026
  const weekDays = useMemo(() => {
    const sunday = new Date(HOJE)
    const dayOfWeek = sunday.getDay()
    sunday.setDate(sunday.getDate() - dayOfWeek)
    const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    return labels.map((label, i) => {
      const d = new Date(sunday)
      d.setDate(sunday.getDate() + i)
      return { id: i, label, date: d.getDate(), month: d.getMonth(), fullDate: formatDate(d) }
    })
  }, [])

  // Tarefas filtradas pela data selecionada
  const filteredTasks = useMemo(() => tasks.filter(t => t.date === filtroData), [tasks, filtroData])
  const pendingCount = filteredTasks.filter(t => !t.completed).length

  return (
    <div className="p-4 md:p-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <p className={`text-xs font-medium mb-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Junho / Julho de 2026</p>
          <h2 className={`text-2xl md:text-3xl font-extra-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Olá, {user.name}!</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            {pendingCount > 0 ? `Você tem ${pendingCount} missões pendentes hoje.` : 'Todas as missões concluídas! 🎉'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className={`p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative w-11 h-11 flex-shrink-0">
            <div className={`w-11 h-11 rounded-full overflow-hidden border-2 ${isDark ? 'border-neon-purple' : 'border-neon-purple/60'}`}>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 flex items-center justify-center text-base">👨‍💻</div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-neon-purple text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{user.level}</div>
          </div>
        </div>
      </div>

      {/* Calendário Semanal */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
        {weekDays.map((day) => (
          <button
            key={day.id}
            onClick={() => setFiltroData(day.fullDate)}
            className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 flex-shrink-0 hover:scale-105 active:scale-95 min-w-[52px] ${
              filtroData === day.fullDate
                ? 'bg-neon-blue text-dark-bg shadow-neon-glow font-bold'
                : isDark
                  ? 'bg-white/5 text-white/60 hover:bg-white/10'
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-100'
            }`}
          >
            <span className="text-[10px] font-medium">{day.label}</span>
            <span className="text-lg font-bold">{day.date}</span>
            {day.month !== HOJE.getMonth() && <span className="text-[9px] opacity-60">{day.month === 6 ? 'Jul' : 'Jun'}</span>}
          </button>
        ))}
      </div>

      {/* Seção Missões */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Missões de Hoje</h3>
        <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'text-white/40 bg-white/5' : 'text-slate-500 bg-slate-100'}`}>{pendingCount} pendentes</span>
      </div>

      {/* Lista de Tarefas */}
      <div className="space-y-3 mb-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => <TaskCard key={task.id} task={task} onToggle={handleTaskToggle} />)
        ) : (
          <div className={`text-center py-12 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
            <p className="text-3xl mb-2">📚</p>
            <p className={isDark ? 'text-white/40' : 'text-slate-500'}>Nenhuma missão para este dia.</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Crie uma nova missão!</p>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className={`grid grid-cols-3 gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-2xl font-extra-bold text-neon-blue">{user.totalTasksCompleted}</div>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Concluídas</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-2xl font-extra-bold text-warning">{tasks.filter(t => !t.completed).length}</div>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Pendentes</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-2xl font-extra-bold text-success">{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</div>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Progresso</p>
        </div>
      </div>

      {/* FAB */}
      <button onClick={onOpenModal} className="fixed bottom-28 md:bottom-8 right-5 md:right-8 w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-40">
        <Plus size={24} />
      </button>
    </div>
  )
}
