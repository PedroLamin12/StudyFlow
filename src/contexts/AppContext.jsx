import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { onAuthChange, signOut as authSignOut } from '../services/authService'
import {
  getUserProfile,
  updateUserProfile,
  updateGamification,
  getTasks,
  addTask as dbAddTask,
  updateTask,
  onTasksChange,
  onUserProfileChange
} from '../services/databaseService'

// ============================================================
// CONSTANTES
// ============================================================
export const HOJE = new Date(2026, 5, 28) // Domingo, 28 de Junho de 2026

export const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const HOJE_STR = formatDate(HOJE)

export const formatDateBR = (dateStr) => {
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`
}

export const getXpForLevel = (level) => level * 200

// ============================================================
// DADOS PADRÃO
// ============================================================
const DEFAULT_USER = {
  name: 'Novo Usuário',
  email: '',
  institution: 'Estudante',
  avatar: null,
  level: 1,
  xp: 0,
  totalTasksCompleted: 0,
  streak: 0,
  notifications: true,
  emailReminders: false,
  memberSince: '2026-06-28',
}

const INITIAL_ACHIEVEMENTS = [
  { id: 'a1', name: 'Primeira Missão', description: 'Conclua sua primeira tarefa', icon: 'Flame', color: 'text-warning', bgColor: 'from-warning/20 to-warning/10', requirement: { type: 'tasksCompleted', value: 1 }, unlocked: false },
  { id: 'a2', name: 'Fogo nos Livros', description: 'Conclua 5 tarefas', icon: 'Flame', color: 'text-orange-400', bgColor: 'from-orange-400/20 to-orange-400/10', requirement: { type: 'tasksCompleted', value: 5 }, unlocked: false },
  { id: 'a3', name: 'Estudante Dedicado', description: 'Chegue ao Nível 3', icon: 'BookOpen', color: 'text-neon-purple', bgColor: 'from-neon-purple/20 to-neon-purple/10', requirement: { type: 'levelReached', value: 3 }, unlocked: false },
  { id: 'a4', name: 'Madrugador', description: 'Chegue ao Nível 5', icon: 'Moon', color: 'text-neon-blue', bgColor: 'from-neon-blue/20 to-neon-blue/10', requirement: { type: 'levelReached', value: 5 }, unlocked: false },
  { id: 'a5', name: 'Mira Certeira', description: 'Conclua 10 tarefas', icon: 'Target', color: 'text-success', bgColor: 'from-success/20 to-success/10', requirement: { type: 'tasksCompleted', value: 10 }, unlocked: false },
  { id: 'a6', name: 'Campeão', description: 'Atinja o Nível 10', icon: 'Zap', color: 'text-error', bgColor: 'from-error/20 to-error/10', requirement: { type: 'levelReached', value: 10 }, unlocked: false },
]

// ============================================================
// CONTEXT
// ============================================================
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentUid, setCurrentUid] = useState(null)
  const [user, setUser] = useState(DEFAULT_USER)
  const [tasks, setTasks] = useState([])
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS)
  const [filtroData, setFiltroData] = useState(HOJE_STR)
  const [levelUpAlert, setLevelUpAlert] = useState(null)

  const unsubProfileRef = useRef(null)
  const unsubTasksRef = useRef(null)

  // ============================================================
  // LISTENER REATIVO DE AUTENTICAÇÃO
  // ============================================================
  useEffect(() => {
    const unsubAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUid(firebaseUser.uid)
        setIsAuthenticated(true)

        // Buscar perfil do Firestore
        const profile = await getUserProfile(firebaseUser.uid)
        if (profile) {
          setUser(prev => ({ ...prev, ...profile, email: firebaseUser.email }))
        } else {
          setUser(prev => ({ ...prev, name: firebaseUser.displayName || 'Novo Usuário', email: firebaseUser.email }))
        }

        // Buscar tarefas iniciais
        const storedTasks = await getTasks(firebaseUser.uid)
        setTasks(storedTasks)

        // Listener em tempo real do perfil
        if (unsubProfileRef.current) unsubProfileRef.current()
        unsubProfileRef.current = onUserProfileChange(firebaseUser.uid, (profileData) => {
          setUser(prev => ({ ...prev, ...profileData, email: firebaseUser.email }))
        })

        // Listener em tempo real das tarefas
        if (unsubTasksRef.current) unsubTasksRef.current()
        unsubTasksRef.current = onTasksChange(firebaseUser.uid, (tasksData) => {
          setTasks(tasksData)
        })
      } else {
        // Usuário deslogado — limpar tudo
        setCurrentUid(null)
        setIsAuthenticated(false)
        setUser(DEFAULT_USER)
        setTasks([])
        setAchievements(INITIAL_ACHIEVEMENTS)
        if (unsubProfileRef.current) { unsubProfileRef.current(); unsubProfileRef.current = null }
        if (unsubTasksRef.current) { unsubTasksRef.current(); unsubTasksRef.current = null }
      }
      setAuthLoading(false)
    })

    return () => {
      unsubAuth()
      if (unsubProfileRef.current) unsubProfileRef.current()
      if (unsubTasksRef.current) unsubTasksRef.current()
    }
  }, [])

  // ============================================================
  // VERIFICAR CONQUISTAS (reativo ao user)
  // ============================================================
  useEffect(() => {
    if (!isAuthenticated) return
    setAchievements(prev => prev.map(a => {
      const { type, value } = a.requirement
      let unlocked = false
      if (type === 'tasksCompleted') unlocked = user.totalTasksCompleted >= value
      if (type === 'levelReached') unlocked = user.level >= value
      return { ...a, unlocked }
    }))
  }, [user.totalTasksCompleted, user.level, isAuthenticated])

  // ============================================================
  // LOGIN (chamado após signIn/signUp bem-sucedido)
  // ============================================================
  const login = useCallback((sessionUser) => {
    // O onAuthStateChanged já cuida de tudo, mas podemos forçar estado imediato
    setIsAuthenticated(true)
    setCurrentUid(sessionUser.uid)
  }, [])

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = useCallback(async () => {
    await authSignOut()
    // onAuthStateChanged vai limpar o estado automaticamente
  }, [])

  // ============================================================
  // TOGGLE TAREFA (concluir/desconcluir + XP + Firestore)
  // ============================================================
  const handleTaskToggle = useCallback(async (taskId) => {
    if (!currentUid) return
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const newCompleted = !task.completed

    // Atualizar tarefa no Firestore
    await updateTask(currentUid, taskId, { completed: newCompleted })

    // Calcular novo XP e nível
    let newXp = user.xp
    let newLevel = user.level
    let newTotal = user.totalTasksCompleted

    if (newCompleted) {
      // Tarefa concluída: +50 XP
      newXp += 50
      newTotal += 1
      let targetXp = getXpForLevel(newLevel)
      let didLevelUp = false
      while (newXp >= targetXp) {
        newXp -= targetXp
        newLevel++
        targetXp = getXpForLevel(newLevel)
        didLevelUp = true
      }
      if (didLevelUp) {
        setLevelUpAlert({ level: newLevel })
        setTimeout(() => setLevelUpAlert(null), 3500)
      }
    } else {
      // Tarefa desmarcada: -50 XP
      newXp = Math.max(0, newXp - 50)
      newTotal = Math.max(0, newTotal - 1)
    }

    // Atualizar gamificação no Firestore
    await updateGamification(currentUid, newXp, newLevel, newTotal)
  }, [currentUid, tasks, user.xp, user.level, user.totalTasksCompleted])

  // ============================================================
  // ADICIONAR TAREFA
  // ============================================================
  const handleAddTask = useCallback(async (task) => {
    if (!currentUid) return
    await dbAddTask(currentUid, task)
    // O onSnapshot vai atualizar o estado automaticamente
  }, [currentUid])

  // ============================================================
  // ATUALIZAR PERFIL (Nome, Instituição, Avatar, Toggles)
  // ============================================================
  const handleUpdateUser = useCallback(async (updates) => {
    if (!currentUid) return
    await updateUserProfile(currentUid, updates)
    // O onSnapshot do perfil vai atualizar o estado automaticamente
  }, [currentUid])

  // ============================================================
  // CONTEXT VALUE
  // ============================================================
  const value = {
    isAuthenticated, authLoading, currentUid, user, tasks, achievements,
    filtroData, setFiltroData, levelUpAlert,
    login, logout, handleTaskToggle, handleAddTask, handleUpdateUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
