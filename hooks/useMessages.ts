import { SyntheticEvent } from 'react';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Hooks
import useUser from './useUser';

export default function useMessages() {
  const { currentUser } = useUser();

  const updateLastMessage = async (targetUserId: string) => {
    const currentUserId = currentUser?.uid as string;

    const id =
      currentUserId > targetUserId
        ? `${currentUserId + targetUserId}`
        : `${targetUserId + currentUserId}`;

    const lastMessageDocRef = doc(db, 'lastMessage', id);
    const docSnap = await getDoc(lastMessageDocRef);

    if (docSnap.data() && docSnap.data()?.from !== currentUser?.uid) {
      await updateDoc(lastMessageDocRef, { seen: true });
    }
  };

  const addNewMessage = async (
    e: SyntheticEvent,
    message: string,
    targetUserId: string
    // eslint-disable-next-line consistent-return
  ) => {
    e.preventDefault();

    if (message.trim() === '') return;

    const currentUserId = currentUser?.uid as string;

    const id =
      currentUserId > targetUserId
        ? `${currentUserId + targetUserId}`
        : `${targetUserId + currentUserId}`;

    const userMessagesRef = collection(db, `messages/${id}/chat`);
    const lastMessageDocRef = doc(db, `lastMessage/${id}`);

    const createdAt = serverTimestamp();
    const data = {
      message,
      createdAt,
      chatId: id,
      seen: false,
      to: targetUserId,
      from: currentUser?.uid,
      photoURL: currentUser?.photoURL,
      displayName: currentUser?.displayName,
    };

    if (targetUserId && currentUser) {
      await addDoc(userMessagesRef, data);
      await setDoc(lastMessageDocRef, data);
    }
  };

  const getMessages = (
    targetUserId: string,
    callback: (d: any) => void,
    msgLimit: number
  ) => {
    const currentUserId = currentUser?.uid as string;

    const id =
      currentUserId > targetUserId
        ? `${currentUserId + targetUserId}`
        : `${targetUserId + currentUserId}`;

    const userMessagesRef = collection(db, `messages/${id}/chat`);

    const userMessagesQuery = query(
      userMessagesRef,
      orderBy('createdAt', 'desc'),
      limit(msgLimit)
    );

    return onSnapshot(userMessagesQuery, callback);
  };

  const getLastMessage = (targetUserId: string, callback: (d: any) => void) => {
    const currentUserId = currentUser?.uid as string;

    const id =
      currentUserId > targetUserId
        ? `${currentUserId + targetUserId}`
        : `${targetUserId + currentUserId}`;

    const lastMessageRef = doc(db, `lastMessage/${id}`);

    return onSnapshot(lastMessageRef, callback);
  };

  const getUnseenMessages = (callback: (d: any) => void) => {
    const lastMessageRef = collection(db, `lastMessage`);

    const lastMessageQuery = query(lastMessageRef, where('seen', '==', false));

    return onSnapshot(lastMessageQuery, callback);
  };

  const selectChat = async (
    targetUserId: string,
    setCurrentMessages: (msg: any) => void
  ) => {
    const currentUserId = currentUser?.uid as string;

    const id =
      currentUserId > targetUserId
        ? `${currentUserId + targetUserId}`
        : `${targetUserId + currentUserId}`;

    const msgsRef = collection(db, 'messages', id, 'chat');
    const q = query(msgsRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (d: any) => {
      setCurrentMessages(
        d.docs.map((docs: any) => ({ ...docs.data(), id: docs.id }))
      );
    });

    updateLastMessage(targetUserId);
  };

  return {
    selectChat,
    getMessages,
    addNewMessage,
    getLastMessage,
    updateLastMessage,
    getUnseenMessages,
  };
}
