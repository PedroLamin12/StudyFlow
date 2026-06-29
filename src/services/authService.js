import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "./firebase";

// ============================================================
// INSTÂNCIAS DO FIREBASE
// ============================================================
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================================
// VALIDAÇÃO E SANITIZAÇÃO
// ============================================================

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'&]/g, (char) => {
      const entities = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" };
      return entities[char] || char;
    })
    .trim();
}

// ============================================================
// CADASTRO (SIGN UP)
// ============================================================

/**
 * Registrar novo usuário no Firebase Auth + criar documento no Firestore
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signUp = async (email, password, displayName) => {
  const cleanEmail = sanitizeInput(email).toLowerCase();
  const cleanName = sanitizeInput(displayName);

  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: "Formato de e-mail inválido." };
  }
  if (!password || password.length < 6) {
    return { success: false, error: "A senha deve ter pelo menos 6 caracteres." };
  }
  if (!cleanName || cleanName.trim().length === 0) {
    return { success: false, error: "O nome não pode estar em branco." };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    // Atualizar displayName no Firebase Auth
    await updateProfile(user, { displayName: cleanName });

    // Criar documento inicial no Firestore (coleção "users")
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      name: cleanName,
      institution: "Estudante",
      level: 1,
      xp: 0,
      totalTasksCompleted: 0,
      streak: 0,
      notifications: true,
      emailReminders: false,
      avatar: null,
      memberSince: "2026-06-28",
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      user: { uid: user.uid, email: user.email, displayName: cleanName },
    };
  } catch (error) {
    let errorMessage = "Erro ao criar conta.";
    if (error.code === "auth/email-already-in-use") errorMessage = "Este e-mail já está cadastrado.";
    else if (error.code === "auth/weak-password") errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
    else if (error.code === "auth/invalid-email") errorMessage = "E-mail inválido.";
    else if (error.code === "auth/operation-not-allowed") errorMessage = "Método de autenticação não habilitado no Firebase.";
    return { success: false, error: errorMessage };
  }
};

// ============================================================
// LOGIN (SIGN IN)
// ============================================================

/**
 * Login de usuário existente via Firebase Auth
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signIn = async (email, password) => {
  const cleanEmail = sanitizeInput(email).toLowerCase();

  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: "Formato de e-mail inválido." };
  }
  if (!password || password.trim().length === 0) {
    return { success: false, error: "A senha não pode estar em branco." };
  }
  if (password.length < 6) {
    return { success: false, error: "A senha deve ter pelo menos 6 caracteres." };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;
    return {
      success: true,
      user: { uid: user.uid, email: user.email, displayName: user.displayName || "Usuário" },
    };
  } catch (error) {
    let errorMessage = "Erro ao fazer login.";
    if (error.code === "auth/user-not-found") errorMessage = "Usuário não encontrado.";
    else if (error.code === "auth/wrong-password") errorMessage = "Senha incorreta.";
    else if (error.code === "auth/invalid-credential") errorMessage = "Credenciais inválidas. Verifique e-mail e senha.";
    else if (error.code === "auth/too-many-requests") errorMessage = "Muitas tentativas. Aguarde e tente novamente.";
    else if (error.code === "auth/user-disabled") errorMessage = "Esta conta foi desativada.";
    return { success: false, error: errorMessage };
  }
};

// ============================================================
// LOGOUT (SIGN OUT)
// ============================================================

/**
 * Logout via Firebase Auth
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  await firebaseSignOut(auth);
};

// ============================================================
// LISTENER REATIVO DE ESTADO DE AUTENTICAÇÃO
// ============================================================

/**
 * Escuta mudanças no estado de autenticação (login/logout)
 * @param {function} callback - Recebe (user | null)
 * @returns {function} unsubscribe
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({ uid: user.uid, email: user.email, displayName: user.displayName || "Usuário" });
    } else {
      callback(null);
    }
  });
};
