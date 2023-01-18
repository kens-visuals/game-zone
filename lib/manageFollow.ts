import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Interfaces
import { UserInterface } from '../hooks/useUser';

export default async function manageFollow(
  type: 'follow' | 'unfollow',
  userId: string,
  targetUserId: string,
  userObj: UserInterface,
  targetUserObj: UserInterface
): Promise<void> {
  const batch = writeBatch(db);

  const currentUserData = {
    uid: userObj?.uid,
    email: userObj?.email,
    photoURL: userObj?.photoURL,
    displayName: userObj?.displayName,
  };

  const targetUserData = {
    uid: targetUserObj?.uid,
    email: targetUserObj?.email,
    photoURL: targetUserObj?.photoURL,
    displayName: targetUserObj?.displayName,
  };

  const usersCollection = collection(db, `users`);

  const userDocRef = doc(usersCollection, userId);
  const targetUserDocRef = doc(usersCollection, targetUserId);

  if (type === 'follow') {
    batch.update(userDocRef, {
      following: arrayUnion(targetUserData),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      followers: arrayUnion(currentUserData),
      updatedAt: serverTimestamp(),
    });
  } else {
    batch.update(userDocRef, {
      following: arrayRemove(targetUserData),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      followers: arrayRemove(currentUserData),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}
