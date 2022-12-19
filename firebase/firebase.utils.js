import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider } from './firebase.config';

export const createUserDocFromAuth = async (userAuth) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email, uid } = userAuth;
    const createdAt = serverTimestamp();

    try {
      // Create user doc
      await setDoc(userDocRef, {
        email,
        id: uid,
        createdAt,
        displayName,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // eslint-disable-next-line consistent-return
  return userDocRef;
};

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error(err);
  }
};

export const signUserOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
};

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const getUserData = (callback, uid) => {
  const usersCollectionRef = collection(db, 'users', `${uid}`, 'data');

  const q = query(usersCollectionRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, callback);
};

export const addNewData = async (uid, name) => {
  const usersCollectionRef = collection(db, 'users', `${uid}`, 'data');
  const createdAt = serverTimestamp();

  try {
    await addDoc(usersCollectionRef, {
      name,
      createdAt,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getUserGames = (uid) => {
  const usersCollectionRef = collection(db, 'users', `${uid}`, 'data');

  // const q = query(usersCollectionRef, orderBy('createdAt', 'desc'));

  // return onSnapshot(q, callback);

  const callback = (docsSnap) =>
    docsSnap.forEach((doc) => console.log(doc.data()));

  return onSnapshot(usersCollectionRef, callback);
};
