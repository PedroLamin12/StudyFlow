import React, { useState } from 'react'
import { Zap, BookOpen, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useApp } from '../contexts/AppContext'
import { signIn, signUp } from '../services/authService'

export default function Login() {
  const { theme } = useTheme()
  const { login } = useApp()
  const isDark = theme === 'dark'

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    let result
    if (isSignUp) {
      result = await signUp(email, password, name)
    } else {
      result = await signIn(email, password)
    }

    setIsLoading(false)

    if (result.success) {
      login(result.user)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${isDark ? 'bg-dark-bg' : 'bg-slate-50'}`}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl opacity-20 blur-xl"></div>
            <div className="relative flex items-center gap-2">
              <Zap size={32} className="text-neon-blue" strokeWidth={2.5} />
              <BookOpen size={32} className="text-neon-purple" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-4xl font-extra-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">StudyFlow</h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Seu fluxo de estudos perfeito</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-error/10 border border-error/40 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in">
            <AlertCircle size={18} className="text-error flex-shrink-0" />
            <p className="text-sm text-error font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className={`w-full border rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus:border-neon-blue ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300 shadow-sm'}`}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>E-mail</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={`w-full border rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus:border-neon-blue ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300 shadow-sm'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`w-full border rounded-xl px-4 py-3 pr-12 transition-all duration-300 focus:outline-none focus:border-neon-blue ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300 shadow-sm'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-extra-bold py-4 rounded-xl hover:scale-105 active:scale-95 hover:shadow-neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {isLoading ? 'Processando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <p className={`text-center text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} className="text-neon-blue font-medium hover:underline">
            {isSignUp ? 'Entrar' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </div>
  )
}
