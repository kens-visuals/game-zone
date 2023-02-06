import { useEffect, useState } from 'react';
import useFollow from './useFollow';
import useMessages from './useMessages';
import { MessageType } from '../lib/types/game';

export default function useMessageUsers() {
  const { followList } = useFollow();
  const { getMessages, getMessagesStatus } = useMessages();

  const otherUsers = followList('following') || [];

  const [sendTo, setSendTo] = useState(otherUsers[0]?.uid || '');
  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);
  const [messageLimit, setMessageLimit] = useState(50);
  const [unreadMessages, setUnreadMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (!sendTo) return;

    const messagesCallback = (d: any) =>
      setCurrentMessages(
        d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );

    const statusCallback = (d: any) =>
      setUnreadMessages(
        d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );

    const statusUnsub = getMessagesStatus(sendTo, statusCallback, messageLimit);
    const messagesUnsub = getMessages(sendTo, messagesCallback, messageLimit);

    // eslint-disable-next-line consistent-return
    return () => {
      statusUnsub();
      messagesUnsub();
    };
  }, [sendTo, messageLimit]);

  return {
    sendTo,
    setSendTo,
    messageLimit,
    unreadMessages,
    currentMessages,
    setMessageLimit,
    setUnreadMessages,
  };
}
