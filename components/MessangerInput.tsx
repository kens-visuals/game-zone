import { RefObject, SyntheticEvent, useState } from 'react';

// Hook
import useMessages from '../hooks/useMessages';

// Interfaces
interface Props {
  sendTo: string;
  scrollRef: RefObject<HTMLLIElement>;
  setUnreadMessages: (initialState: []) => void;
}

export default function MessangerInput({
  sendTo,
  scrollRef,
  setUnreadMessages,
}: Props) {
  const [message, setMessage] = useState('');

  const { addNewMessage } = useMessages();

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
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-secondary/50 px-4 text-white outline-none"
      />
      <button
        type="submit"
        onClick={handleClick}
        className="h-full bg-secondary p-2 px-4 hover:bg-slate-700 focus:outline-dashed"
      >
        Send
      </button>
    </form>
  );
}
