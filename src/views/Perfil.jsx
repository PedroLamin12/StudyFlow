import React, { useState, useRef } from 'react'
import { Edit2, Camera, Bell, Mail, LogOut, Check, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp, formatDateBR } from '../contexts/AppContext'

export default function Perfil() {
  const { theme } = useTheme()
  const { user, tasks, logout, handleUpdateUser } = useApp()
  const isDark = theme === 'dark'
  const fileInputRef = useRef(null)

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editInstitution, setEditInstitution] = useState(user.institution)

  const handleAvatarClick = () => fileInputRef.current?.click()
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => handleUpdateUser({ avatar: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    handleUpdateUser({ name: editName.trim() || user.name, institution: editInstitution.trim() || user.institution })
    setIsEditingProfile(false)
  }

  const handleCancelEdit = () => {
    setEditName(user.name)
    setEditInstitution(user.institution)
    setIsEditingProfile(false)
  }

  const totalXp = ((user.level - 1) * 200) + user.xp

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-2xl font-extra-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Perfil</h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div className={`w-28 h-28 rounded-2xl overflow-hidden border-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 flex items-center justify-center text-5xl">👨‍💻</div>
            )}
          </div>
          <button onClick={handleAvatarClick} className="absolute bottom-0 right-0 bg-neon-blue text-dark-bg p-2 rounded-lg hover:scale-110 active:scale-95 transition-all duration-300 shadow-neon-glow">
            <Camera size={14} strokeWidth={2.5} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        {/* Inline Editing */}
        {isEditingProfile ? (
          <div className="w-full max-w-xs space-y-3">
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus placeholder="Seu nome" className={`w-full text-center text-xl font-bold px-4 py-2 rounded-xl border transition-all duration-300 focus:outline-none focus:border-neon-blue ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} />
            <input type="text" value={editInstitution} onChange={(e) => setEditInstitution(e.target.value)} placeholder="Instituição" className={`w-full text-center text-sm px-4 py-2 rounded-xl border transition-all duration-300 focus:outline-none focus:border-neon-blue ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} />
            <div className="flex gap-2 justify-center">
              <button onClick={handleSaveProfile} className="flex items-center gap-1 px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:scale-105 active:scale-95 transition-all duration-300"><Check size={14} /> Salvar</button>
              <button onClick={handleCancelEdit} className="flex items-center gap-1 px-4 py-2 bg-error/20 text-error text-sm font-medium rounded-lg hover:scale-105 active:scale-95 transition-all duration-300"><X size={14} /> Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h3 className={`text-2xl font-extra-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
              <button onClick={() => setIsEditingProfile(true)} className={`p-1.5 rounded-lg hover:scale-110 active:scale-95 transition-all duration-300 ${isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-slate-100 text-slate-400'}`}><Edit2 size={14} /></button>
            </div>
            <p className={`text-sm mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{user.institution}</p>
            <p className="text-xs text-neon-purple font-medium mt-2">Nível {user.level} • {totalXp} XP Total</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-3xl font-extra-bold text-neon-blue">{user.totalTasksCompleted}</div>
          <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Missões</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-3xl font-extra-bold text-neon-purple">{totalXp}</div>
          <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>XP</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="text-3xl font-extra-bold text-warning">{user.streak}</div>
          <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Ofensiva</p>
        </div>
      </div>

      {/* Configurações */}
      <div className="space-y-3 mb-6">
        <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Configurações</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-blue/20 rounded-lg"><Bell size={18} className="text-neon-blue" /></div>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Notificações</p>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Lembretes de tarefas</p>
            </div>
          </div>
          <label className="toggle-switch"><input type="checkbox" checked={user.notifications} onChange={() => handleUpdateUser({ notifications: !user.notifications })} /><span className="toggle-slider"></span></label>
        </div>
        <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-purple/20 rounded-lg"><Mail size={18} className="text-neon-purple" /></div>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>E-mail semanal</p>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Resumo de progresso</p>
            </div>
          </div>
          <label className="toggle-switch"><input type="checkbox" checked={user.emailReminders} onChange={() => handleUpdateUser({ emailReminders: !user.emailReminders })} /><span className="toggle-slider"></span></label>
        </div>
      </div>

      {/* Info */}
      <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
        <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Informações da Conta</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Membro desde:</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatDateBR(user.memberSince)}</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Versão:</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>4.0.0</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-error/20 border border-error/50 text-error font-medium py-3 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300">
        <LogOut size={18} /> Sair da Conta
      </button>
    </div>
  )
}
