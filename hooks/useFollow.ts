import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Hooks
import useUser, { UserInterface } from './useUser';
import useUsers from './useUsers';

export default function useFollow() {
  const { currentUser } = useUser();
  const { users, status: usersStatus } = useUsers();

  const followList = (
    type: 'followers' | 'following',
    currentUserId = currentUser?.uid
  ) =>
    usersStatus === 'success'
      ? users
          .filter((user) => user.uid === currentUserId)
          .map((user) =>
            type === 'following' ? user?.following : user?.followers
          )
          .at(0)
      : [];

  const manageFollow = async (
    type: 'follow' | 'unfollow',
    targetUserId: string,
    targetUserObj: UserInterface
  ): Promise<void> => {
    const batch = writeBatch(db);

    const currentUserData = {
      uid: currentUser?.uid,
      email: currentUser?.email,
      photoURL: currentUser?.photoURL,
      displayName: currentUser?.displayName,
    };

    const targetUserData = {
      uid: targetUserObj?.uid,
      email: targetUserObj?.email,
      photoURL: targetUserObj?.photoURL,
      displayName: targetUserObj?.displayName,
    };

    const usersCollection = collection(db, `users`);

    const userDocRef = doc(usersCollection, currentUser?.uid);
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
  };

  return { manageFollow, followList };
}
