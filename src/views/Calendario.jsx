import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp, HOJE, formatDate, HOJE_STR } from '../contexts/AppContext'
import TaskCard from '../components/TaskCard'

export default function Calendario() {
  const { theme } = useTheme()
  const { tasks, filtroData, setFiltroData, handleTaskToggle } = useApp()
  const isDark = theme === 'dark'
  const [currentMonth, setCurrentMonth] = useState(new Date(HOJE))

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const days = useMemo(() => {
    const arr = []
    for (let i = 0; i < firstDay; i++) arr.push(null)
    for (let i = 1; i <= daysInMonth; i++) arr.push(i)
    return arr
  }, [firstDay, daysInMonth])

  const tasksPerDay = useMemo(() => {
    const map = {}
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    tasks.forEach(task => {
      if (!task.date) return
      const [ty, tm, td] = task.date.split('-').map(Number)
      if (ty === year && tm - 1 === month) {
        if (!map[td]) map[td] = []
        map[td].push(task.priority === 'high' ? 'purple' : 'blue')
      }
    })
    return map
  }, [tasks, currentMonth])

  const getDayStr = (day) => {
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${currentMonth.getFullYear()}-${m}-${d}`
  }

  const isToday = (day) => getDayStr(day) === HOJE_STR
  const isSelected = (day) => getDayStr(day) === filtroData
  const filteredTasks = useMemo(() => tasks.filter(t => t.date === filtroData), [tasks, filtroData])

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-2xl font-extra-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Calendário</h2>

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className={`p-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
          <ChevronLeft size={20} className={isDark ? 'text-white/60' : 'text-slate-500'} />
        </button>
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className={`p-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
          <ChevronRight size={20} className={isDark ? 'text-white/60' : 'text-slate-500'} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => (
          <div key={d} className={`text-center text-xs font-medium py-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => day && setFiltroData(getDayStr(day))}
            disabled={!day}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-300 text-sm ${
              !day ? '' :
              isSelected(day) ? 'bg-neon-blue text-dark-bg font-bold shadow-neon-glow' :
              isToday(day) ? `border-2 border-neon-purple font-bold ${isDark ? 'text-white' : 'text-slate-900'}` :
              isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-50'
            } ${day ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}`}
          >
            {day && (
              <>
                <span>{day}</span>
                {tasksPerDay[day] && !isSelected(day) && (
                  <div className="flex gap-0.5 mt-0.5">
                    {[...new Set(tasksPerDay[day])].slice(0, 2).map((c, j) => (
                      <div key={j} className={`w-1 h-1 rounded-full ${c === 'blue' ? 'bg-neon-blue' : 'bg-neon-purple'}`}></div>
                    ))}
                  </div>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      <div className={`flex gap-6 mb-6 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'}`}>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-neon-blue rounded-full"></div><span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Normal</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-neon-purple rounded-full"></div><span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Alta prioridade</span></div>
      </div>

      <div>
        <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tarefas de {filtroData.split('-').reverse().join('/')}</h4>
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">{filteredTasks.map(task => <TaskCard key={task.id} task={task} onToggle={handleTaskToggle} />)}</div>
        ) : (
          <div className={`text-center py-8 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
            <p className={isDark ? 'text-white/40' : 'text-slate-500'}>Nenhuma missão para este dia. 😴</p>
          </div>
        )}
      </div>
    </div>
  )
}
