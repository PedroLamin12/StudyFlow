import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp, HOJE_STR } from '../contexts/AppContext'

export default function NewTaskModal({ isOpen, onClose }) {
  const { theme } = useTheme()
  const { handleAddTask } = useApp()
  const isDark = theme === 'dark'

  const [taskName, setTaskName] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState('normal')
  const [time, setTime] = useState('09:00')
  const [date, setDate] = useState(HOJE_STR)
  const [shakeTitle, setShakeTitle] = useState(false)
  const [titleError, setTitleError] = useState(false)

  const subjects = ['Matemática', 'Física', 'Biologia', 'História', 'Português', 'Inglês']
  const priorities = [
    { id: 'low', label: 'Baixa', color: 'bg-blue-500' },
    { id: 'normal', label: 'Normal', color: 'bg-yellow-500' },
    { id: 'high', label: 'Alta', color: 'bg-red-500' },
  ]

  const resetForm = () => { setTaskName(''); setSubject(''); setPriority('normal'); setTime('09:00'); setDate(HOJE_STR); setTitleError(false) }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskName.trim()) {
      setShakeTitle(true); setTitleError(true)
      setTimeout(() => setShakeTitle(false), 500)
      return
    }
    setTitleError(false)
    handleAddTask({ id: Date.now(), name: taskName.trim(), subject: subject || 'Geral', priority, time, date, completed: false })
    resetForm(); onClose()
  }

  const handleClose = () => { resetForm(); onClose() }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleClose}></div>
      <div className={`relative w-full max-w-md rounded-t-3xl md:rounded-3xl border p-6 animate-slide-up max-h-[85vh] overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-dark-card border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-extra-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Nova Missão</h2>
          <button onClick={handleClose} className={`hover:scale-110 active:scale-95 transition-all ${isDark ? 'text-white/40' : 'text-slate-400'}`}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={shakeTitle ? 'animate-shake' : ''}>
            <textarea value={taskName} onChange={(e) => { setTaskName(e.target.value); if (e.target.value.trim()) setTitleError(false) }} placeholder="O que você vai estudar?" className={`w-full text-lg font-medium resize-none focus:outline-none border-b pb-3 transition-all duration-300 ${isDark ? 'bg-transparent text-white placeholder-white/30' : 'bg-transparent text-slate-900 placeholder-slate-300'} ${titleError ? 'border-error' : isDark ? 'border-white/10 focus:border-neon-blue' : 'border-slate-200 focus:border-neon-blue'}`} rows="2" />
            {titleError && <p className="text-xs text-error mt-1 animate-fade-in">O título não pode estar em branco.</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Matéria</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map(s => (<button key={s} type="button" onClick={() => setSubject(subject === s ? '' : s)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${subject === s ? 'bg-neon-blue text-dark-bg shadow-neon-glow' : isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-600'}`}>{s}</button>))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Prioridade</label>
            <div className="flex gap-3">
              {priorities.map(p => (<button key={p.id} type="button" onClick={() => setPriority(p.id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${priority === p.id ? `${p.color} text-white shadow-lg` : isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-600'}`}>{p.label}</button>))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`w-full rounded-xl px-4 py-3 border transition-all duration-300 focus:outline-none focus:border-neon-blue ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Horário</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`w-full rounded-xl px-4 py-3 border transition-all duration-300 focus:outline-none focus:border-neon-blue ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
          </div>

          <button type="submit" className="w-full bg-neon-purple text-white font-bold py-4 rounded-xl hover:shadow-neon-purple-glow hover:scale-105 active:scale-95 transition-all duration-300">Adicionar à Rotina</button>
        </form>
      </div>
    </div>
  )
}
