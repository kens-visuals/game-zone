import { SyntheticEvent } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  doc,
  writeBatch,
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
      status: 'unread',
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

  const getMessagesStatus = (
    targetUserId: string,
    callback: (d: any) => void,
    msgLimit: number = 25
  ) => {
    const userMessagesRef = collection(
      db,
      `users/${currentUser?.uid}/chats/${targetUserId}/messages`
    );

    const userMessagesStatusQuery = query(
      userMessagesRef,
      orderBy('createdAt', 'desc'),
      where('status', '==', 'unread'),
      where('uid', '==', `${targetUserId}`),
      limit(msgLimit)
    );

    return onSnapshot(userMessagesStatusQuery, callback);
  };

  const updateMessagesStatus = async (targetUserId: string) => {
    const batch = writeBatch(db);
    const userMessagesRef = collection(
      db,
      `users/${currentUser?.uid}/chats/${targetUserId}/messages`
    );

    const newDocumentBody = {
      readAt: serverTimestamp(),
      status: 'read',
    };

    const userMessagesStatusQuery = query(
      userMessagesRef,
      where('status', '==', 'unread')
    );

    const unreads = await getDocs(userMessagesStatusQuery);

    unreads.forEach((d) => {
      const docRef = doc(userMessagesRef, d.id);

      batch.update(docRef, newDocumentBody);
    });

    await batch.commit();
  };

  return {
    getMessages,
    addNewMessage,
    getMessagesStatus,
    updateMessagesStatus,
  };
}
