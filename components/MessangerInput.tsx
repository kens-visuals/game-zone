import { SyntheticEvent, useState } from 'react';

// Hook
import useMessages from '../hooks/useMessages';

// Interfaces
interface Props {
  sendTo: string;
  scrollRef: any;
}

export default function MessangerInput({ sendTo, scrollRef }: Props) {
  const [message, setMessage] = useState('');

  const { addNewMessage } = useMessages();

  const handleClick = (e: SyntheticEvent) => {
    addNewMessage(e, message, sendTo);
    setMessage('');
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <form className="absolute bottom-0 left-0 z-20 grid w-full grid-cols-[1fr_auto]">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-primary/90 px-4 text-white outline-none"
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
