import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';

// Components
import SignInButton from './SignInButton';

// Hooks
import useFollow from '../hooks/useFollow';
import useMessages from '../hooks/useMessages';
import useUser, { UserInterface } from '../hooks/useUser';

// Interfaces
import { MessageType } from '../lib/types/index';

interface Props {
  sendTo: string;
  setSendTo: Dispatch<SetStateAction<string>>;
  setMessageLimit: Dispatch<SetStateAction<number>>;
  setCurrentMessages: Dispatch<SetStateAction<MessageType[]>>;
}

export default function MessangerUsers({
  sendTo,
  setSendTo,
  setMessageLimit,
  setCurrentMessages,
}: Props) {
  const { followList } = useFollow();
  const { currentUser, isUserLoading } = useUser();
  const { getUnseenMessages, selectChat } = useMessages();
  const [unseenMessages, setUnseenMessages] = useState<MessageType[]>();

  useEffect(() => {
    const lastMessageCallback = (d: any) =>
      setUnseenMessages(
        d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );

    const lastMessageUnsub = getUnseenMessages(lastMessageCallback);

    return () => lastMessageUnsub();
  }, [sendTo]);

  const unseens = (user: UserInterface) =>
    unseenMessages?.filter((msg) => msg.from === user?.uid && !msg.seen);

  const mergeUsers = function mergeArraysAndDeduplicate() {
    const followers = followList('followers') as UserInterface[];
    const following = followList('following') as UserInterface[];
    const mergedArray = [...followers, ...following];

    return mergedArray.filter(
      (item, index) =>
        index === mergedArray.findIndex((i) => i.uid === item.uid)
    );
  };

  return (
    <div className="rounded-lg bg-primary-dark py-4 lg:col-start-2 lg:col-end-3 lg:row-span-full lg:px-4">
      {currentUser ? (
        <>
          <span className="inline-block px-4 text-h2-light">Users</span>
          <ul className="lg:ovy grid grid-flow-col items-center justify-start overflow-x-scroll p-4 md:gap-4 lg:grid-flow-row">
            {mergeUsers()?.map((user) => (
              <li key={user.uid}>
                <button
                  type="button"
                  onClick={() => {
                    setMessageLimit(50);
                    setSendTo(user.uid);
                    selectChat(user.uid, setCurrentMessages);
                  }}
                  className="relative flex flex-col items-center justify-center gap-2"
                >
                  <span
                    className={`absolute top-0 right-2 w-fit rounded-full bg-primary-light p-0.5 px-1 text-body-2
                    ${unseens(user)?.length ? 'inline-block' : 'hidden'}
                    `}
                  >
                    New
                  </span>

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
        </>
      ) : (
        <div className="flex flex-col items-center justify-start rounded-lg bg-primary-dark p-4 text-primary-light">
          {!currentUser ? (
            <div className="flex flex-col items-center justify-center">
              <span className="mb-2 inline-block">
                Sign In to chat with others!
              </span>
              <SignInButton isSidebarOpen isUserLoading={isUserLoading} />
            </div>
          ) : (
            'You have not created any collections yet'
          )}
        </div>
      )}
    </div>
  );
}
