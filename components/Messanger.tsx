import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Components
import Message from './Message';
import MessangerInput from './MessangerInput';

// Hooks
import useUser from '../hooks/useUser';
import useUsers from '../hooks/useUsers';
import useMessages from '../hooks/useMessages';

// Interface
import { MessageType } from '../lib/types/game';

export default function Messanger() {
  const { users } = useUsers();
  const { currentUser } = useUser();
  const { getMessages } = useMessages();
  const scrollRef = useRef(null);

  const otherUsers = users?.filter((user) => user.uid !== currentUser?.uid);

  const [sendTo, setSendTo] = useState(otherUsers[0].uid);
  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);
  const [messageLimit, setMessageLimit] = useState(25);

  const otherUser = users?.filter((user) => user.uid === sendTo).at(0);

  console.log(otherUsers);

  useEffect(() => {
    if (!sendTo) return;

    const callback = (d: any) =>
      setCurrentMessages(
        d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );

    const unsub = getMessages(sendTo, callback, messageLimit);

    // eslint-disable-next-line consistent-return
    return () => unsub();
  }, [sendTo, messageLimit]);

  return (
    <>
      <ul className="grid grid-flow-col justify-start overflow-x-scroll rounded-lg bg-primary-dark px-2 py-4">
        {otherUsers?.map((user) => (
          <li key={user.uid}>
            <button
              type="button"
              onClick={() => setSendTo(user.uid)}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Image
                width={100}
                height={100}
                src={user.photoURL}
                alt={user.displayName}
                className={`h-14 w-14 rounded-full md:h-auto md:w-full ${
                  sendTo === user.uid && 'ring-4 ring-secondary'
                }`}
              />
              <span className="w-20 break-words text-center text-body-2">
                {user.displayName}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="relative mt-4 h-full overflow-hidden rounded-lg bg-primary-dark ">
        <div className="grid grid-flow-row border-b border-primary-light px-4 py-2 shadow-lg shadow-black/70">
          {otherUser && (
            <div className="flex items-center gap-2">
              <Image
                height={50}
                width={50}
                src={otherUser?.photoURL}
                alt={otherUser?.displayName}
                className="h-10 w-10 rounded-full"
              />
              <span>{otherUser.displayName.replace(/\s\w*/gi, '')}</span>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center justify-end gap-2">
              <span>{currentUser.displayName.replace(/\s\w*/gi, '')}</span>

              <Image
                height={50}
                width={50}
                src={currentUser?.photoURL}
                alt={currentUser?.displayName}
                className="h-10 w-10 rounded-full"
              />
            </div>
          )}
        </div>

        <ul className="flex h-[calc(100vh_-_27rem)] flex-col-reverse gap-2 overflow-y-scroll p-4">
          <li ref={scrollRef} className="mt-8" />
          {currentMessages?.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          <li className="">
            <button
              type="button"
              onClick={() => setMessageLimit((prevState) => prevState + 25)}
            >
              Load More
            </button>
          </li>
        </ul>

        <MessangerInput sendTo={sendTo} scrollRef={scrollRef} />
      </div>
    </>
  );
}
