import { RefObject, SyntheticEvent, useState } from 'react';

// Hook
import useUser from '../hooks/useUser';
import useMessages from '../hooks/useMessages';

// Interfaces
interface Props {
  sendTo: string;
  scrollRef: RefObject<HTMLLIElement>;
  setUnreadMessages: (msg: any) => void;
}

export default function MessangerInput({
  sendTo,
  scrollRef,
  setUnreadMessages,
}: Props) {
  const { currentUser } = useUser();
  const { addNewMessage } = useMessages();

  const [message, setMessage] = useState('');

  const handleClick = (e: SyntheticEvent) => {
    addNewMessage(e, message, sendTo);
    setMessage('');
    setUnreadMessages([]);

    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <form className="absolute bottom-0 left-0 z-20 grid w-full grid-cols-[1fr_auto] overflow-hidden rounded-b-lg ">
      <input
        value={message}
        disabled={!currentUser}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-secondary/50 px-4 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        onClick={handleClick}
        disabled={!currentUser}
        className="h-full bg-secondary p-2 px-4 hover:bg-slate-700 focus:outline-dashed disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
