import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore Error Handler per guidelines
export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication Actions
export async function loginWithGoogle() {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      await syncUserProfile(res.user);
    }
    return res.user;
  } catch (error) {
    console.error('Erro no login com Google:', error);
    throw error;
  }
}

export async function registerWithEmail(email, password, displayName) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && res.user) {
      await updateProfile(res.user, { displayName });
    }
    await syncUserProfile({
      ...res.user,
      displayName: displayName || res.user.email.split('@')[0],
    });
    return res.user;
  } catch (error) {
    console.error('Erro no cadastro com email:', error);
    throw error;
  }
}

export async function loginWithEmail(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (res.user) {
      await syncUserProfile(res.user);
    }
    return res.user;
  } catch (error) {
    console.error('Erro no login com email:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao sair:', error);
    throw error;
  }
}

// Profile sync
export async function syncUserProfile(user) {
  if (!user || !user.uid) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    const data = {
      userId: user.uid,
      displayName: user.displayName || user.email?.split('@')[0] || 'Jogador',
      email: user.email || '',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'write', `users/${user.uid}`);
  }
}

// Save Game Progress
export async function saveGameProgress(userId, gameId, gameTitle, stats) {
  if (!userId || !gameId) return;
  const progressRef = doc(db, 'users', userId, 'progress', gameId);
  try {
    const payload = {
      userId,
      gameId,
      gameTitle: gameTitle || gameId,
      highScore: Number(stats.highScore || 0),
      playTimeSeconds: Number(stats.playTimeSeconds || 0),
      sessionsCount: Number(stats.sessionsCount || 1),
      notes: String(stats.notes || ''),
      lastPlayedAt: new Date().toISOString(),
    };
    await setDoc(progressRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, 'write', `users/${userId}/progress/${gameId}`);
  }
}

// Get Single Game Progress
export async function getGameProgress(userId, gameId) {
  if (!userId || !gameId) return null;
  const progressRef = doc(db, 'users', userId, 'progress', gameId);
  try {
    const snap = await getDoc(progressRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, 'get', `users/${userId}/progress/${gameId}`);
  }
}

// Get All Progress for a User
export async function getUserAllProgress(userId) {
  if (!userId) return [];
  const colRef = collection(db, 'users', userId, 'progress');
  try {
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data());
  } catch (error) {
    handleFirestoreError(error, 'list', `users/${userId}/progress`);
  }
}
