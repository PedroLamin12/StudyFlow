import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy
} from 'firebase/firestore'
import { db } from './firebase'
import { sanitizeInput } from './authService'

// ============================================================
// USER PROFILE (Coleção: users/{uid})
// ============================================================

/**
 * Obter perfil do usuário do Firestore
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { uid, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }
}

/**
 * Criar perfil inicial do usuário (caso não exista)
 * @param {string} uid
 * @param {object} data
 * @returns {Promise<void>}
 */
export async function createUserProfile(uid, data) {
  try {
    const docRef = doc(db, 'users', uid)
    await setDoc(docRef, data)
  } catch (error) {
    console.error('Erro ao criar perfil:', error)
  }
}

/**
 * Atualizar campos do perfil no Firestore (com sanitização)
 * @param {string} uid
 * @param {object} updates
 * @returns {Promise<void>}
 */
export async function updateUserProfile(uid, updates) {
  try {
    const sanitized = {}
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string' && (key === 'name' || key === 'institution')) {
        sanitized[key] = sanitizeInput(value)
      } else {
        sanitized[key] = value
      }
    }
    const docRef = doc(db, 'users', uid)
    await updateDoc(docRef, sanitized)
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
  }
}

/**
 * Listener em tempo real do perfil do usuário
 * @param {string} uid
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function onUserProfileChange(uid, callback) {
  const docRef = doc(db, 'users', uid)
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ uid, ...docSnap.data() })
    }
  })
}

// ============================================================
// TASKS (Coleção: users/{uid}/tasks)
// ============================================================

/**
 * Obter todas as tarefas do usuário
 * @param {string} uid
 * @returns {Promise<Array>}
 */
export async function getTasks(uid) {
  try {
    const tasksRef = collection(db, 'users', uid, 'tasks')
    const q = query(tasksRef, orderBy('date', 'asc'))
    const querySnapshot = await getDocs(q)
    const tasks = []
    querySnapshot.forEach((docSnap) => {
      tasks.push({ id: docSnap.id, ...docSnap.data() })
    })
    return tasks
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error)
    return []
  }
}

/**
 * Adicionar uma tarefa ao Firestore (com sanitização)
 * @param {string} uid
 * @param {object} task
 * @returns {Promise<object>} tarefa com id do Firestore
 */
export async function addTask(uid, task) {
  try {
    const sanitizedTask = {
      name: sanitizeInput(task.name),
      subject: sanitizeInput(task.subject),
      priority: task.priority || 'normal',
      time: task.time || '09:00',
      date: task.date || '2026-06-28',
      completed: false,
      createdAt: new Date().toISOString()
    }
    const tasksRef = collection(db, 'users', uid, 'tasks')
    const docRef = await addDoc(tasksRef, sanitizedTask)
    return { id: docRef.id, ...sanitizedTask }
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error)
    return null
  }
}

/**
 * Atualizar uma tarefa (ex: marcar como concluída)
 * @param {string} uid
 * @param {string} taskId
 * @param {object} updates
 * @returns {Promise<void>}
 */
export async function updateTask(uid, taskId, updates) {
  try {
    const taskRef = doc(db, 'users', uid, 'tasks', taskId)
    await updateDoc(taskRef, updates)
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error)
  }
}

/**
 * Deletar uma tarefa
 * @param {string} uid
 * @param {string} taskId
 * @returns {Promise<void>}
 */
export async function deleteTask(uid, taskId) {
  try {
    const taskRef = doc(db, 'users', uid, 'tasks', taskId)
    await deleteDoc(taskRef)
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error)
  }
}

/**
 * Listener em tempo real das tarefas do usuário
 * @param {string} uid
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function onTasksChange(uid, callback) {
  const tasksRef = collection(db, 'users', uid, 'tasks')
  const q = query(tasksRef, orderBy('date', 'asc'))
  return onSnapshot(q, (querySnapshot) => {
    const tasks = []
    querySnapshot.forEach((docSnap) => {
      tasks.push({ id: docSnap.id, ...docSnap.data() })
    })
    callback(tasks)
  })
}

// ============================================================
// GAMIFICAÇÃO — Atualização de XP e Nível no Firestore
// ============================================================

/**
 * Atualizar XP e nível do usuário no Firestore
 * @param {string} uid
 * @param {number} xp
 * @param {number} level
 * @param {number} totalTasksCompleted
 * @returns {Promise<void>}
 */
export async function updateGamification(uid, xp, level, totalTasksCompleted) {
  try {
    const docRef = doc(db, 'users', uid)
    await updateDoc(docRef, { xp, level, totalTasksCompleted })
  } catch (error) {
    console.error('Erro ao atualizar gamificação:', error)
  }
}
