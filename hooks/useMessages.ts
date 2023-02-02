import { SyntheticEvent } from 'react';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Hooks
import useUser from './useUser';

export default function useMessages() {
  const { currentUser } = useUser();

  const addNewMessage = async (
    e: SyntheticEvent,
    message: string,
    targetUserId: string
    // eslint-disable-next-line consistent-return
  ) => {
    e.preventDefault();

    if (message.trim() === '') return;

    const userMessagesRef = collection(
      db,
      `users/${currentUser?.uid}/chats/${targetUserId}/messages`
    );
    const otherUserMessagesRef = collection(
      db,
      `users/${targetUserId}/chats/${currentUser?.uid}/messages`
    );

    const createdAt = serverTimestamp();
    const data = {
      message,
      createdAt,
      uid: currentUser?.uid,
      photoURL: currentUser?.photoURL,
      displayName: currentUser?.displayName,
    };

    if (targetUserId && currentUser) {
      await addDoc(userMessagesRef, data);
      await addDoc(otherUserMessagesRef, data);
    }
  };

  const getMessages = (
    targetUserId: string,
    callback: (d: any) => void,
    msgLimit: number = 25
  ) => {
    const userMessagesRef = collection(
      db,
      `users/${currentUser?.uid}/chats/${targetUserId}/messages`
    );

    const userMessagesQuery = query(
      userMessagesRef,
      orderBy('createdAt', 'desc'),
      limit(msgLimit)
    );

    return onSnapshot(userMessagesQuery, callback);
  };

  return { addNewMessage, getMessages };
}
