import Image from 'next/image';

// Components
import SignInButton from './SignInButton';

// Hooks
import useUser, { UserInterface } from '../hooks/useUser';
import useFollow from '../hooks/useFollow';
import useMessages from '../hooks/useMessages';

// Interfaces
import { MessageType } from '../lib/types/game';

interface Props {
  sendTo: string;
  setSendTo: (to: string) => void;
  unreadMessages: MessageType[];
}

export default function MessangerUsers({
  sendTo,
  setSendTo,
  unreadMessages,
}: Props) {
  const { followList } = useFollow();
  const { updateMessagesStatus } = useMessages();
  const { currentUser, isUserLoading } = useUser();

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
            {mergeUsers().map((user) => (
              <li key={user.uid}>
                <button
                  type="button"
                  onClick={() => {
                    setSendTo(user.uid);
                    updateMessagesStatus(user.uid);
                  }}
                  className="relative flex flex-col items-center justify-center gap-2"
                >
                  <span
                    className={`absolute top-0 right-2 w-fit rounded-full bg-primary-light p-0.5 px-1 text-body-2 ${
                      unreadMessages.length > 0 ? 'inline-block' : 'hidden'
                    }`}
                  >
                    {
                      unreadMessages?.filter((msg) => msg.uid === user.uid)
                        .length
                    }
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
        <SignInButton isSidebarOpen isUserLoading={isUserLoading} />
      )}
    </div>
  );
}
