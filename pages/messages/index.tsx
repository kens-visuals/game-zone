import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Components
import Message from '../../components/Message';
import MessangerInput from '../../components/MessangerInput';
import MessangerUsers from '../../components/MessangerUsers';

// Hooks
import useFollow from '../../hooks/useFollow';
import useMessages from '../../hooks/useMessages';

// Interfaces
import { MessageType } from '../../lib/types/index';

export default function Messanger() {
  const { followList } = useFollow();
  const { getLastMessage } = useMessages();

  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);
  const [sendTo, setSendTo] = useState('');
  const [messageLimit, setMessageLimit] = useState(50);
  const [lastMessage, setLastMessage] = useState<MessageType>();

  const scrollRef = useRef<HTMLLIElement>(null);

  const otherUser = followList('following')
    ?.filter((user) => user.uid === sendTo)
    .at(0);

  useEffect(() => {
    if (!sendTo) return;

    const lastMessageCallback = (doc: any) => setLastMessage(doc.data());

    const lastMessageUnsub = getLastMessage(sendTo, lastMessageCallback);

    // eslint-disable-next-line consistent-return
    return () => {
      // messagesUnsub();
      lastMessageUnsub();
    };
  }, [sendTo, messageLimit]);

  return (
    <>
      <Head>
        <title>GZ | Messages</title>
        <meta name="description" content="List of messages and users" />
      </Head>

      <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-4">
        <MessangerUsers
          sendTo={sendTo}
          setSendTo={setSendTo}
          setCurrentMessages={setCurrentMessages}
        />

        <div className="relative mt-4 h-full overflow-hidden rounded-lg bg-primary-dark lg:mt-0">
          <div className="flex flex-col items-center justify-center gap-4 border-b border-primary-light p-4 shadow-lg shadow-black/70 md:flex-row">
            {otherUser && (
              <>
                <Link
                  href={`/user/${otherUser?.uid}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    height={50}
                    width={50}
                    src={otherUser?.photoURL}
                    alt={otherUser?.displayName}
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="md:text-h2-medium">
                    {otherUser.displayName}
                  </span>
                </Link>

                <span className="w-80 truncate text-ellipsis md:ml-auto">
                  Last message: {lastMessage?.message}
                </span>
              </>
            )}
          </div>

          <ul className="flex h-[calc(100vh_-_27rem)] flex-col-reverse gap-2 overflow-y-scroll p-4 md:h-[calc(100vh_-_10.7rem)]">
            {currentMessages.length > 0 ? (
              <>
                <li ref={scrollRef} className="mt-8 md:mt-12" />
                {currentMessages?.map((msg) => (
                  <Message key={msg.id} message={msg} />
                ))}
                <li
                  className={`flex w-fit items-center justify-center self-center rounded-md bg-primary-light px-4 py-2 ${
                    messageLimit > currentMessages.length && 'hidden'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMessageLimit((prevState) => prevState + 25)
                    }
                  >
                    Load More
                  </button>
                </li>{' '}
              </>
            ) : (
              <li className="my-auto flex items-center justify-center">
                <span>No messages yet!</span>
              </li>
            )}
          </ul>

          <MessangerInput sendTo={sendTo} scrollRef={scrollRef} />
        </div>
      </div>
    </>
  );
}
