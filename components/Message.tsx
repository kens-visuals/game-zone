// Hooks
import useUser from '../hooks/useUser';

// Interface
import { MessageType } from '../lib/types/index';

interface Props {
  message: MessageType;
}

export default function Message({ message }: Props) {
  const { currentUser } = useUser();

  const seconds = message.createdAt && message.createdAt?.seconds;
  const date = new Date(seconds * 1000);
  const time = date?.toLocaleTimeString('en-US', { timeStyle: 'short' });

  const isCurrentUser = message.from === currentUser?.uid;

  return (
    <li className={`flex ${isCurrentUser && 'flex-row-reverse'} `}>
      <div
        className={`w-fit rounded-md from-secondary to-secondary/20 px-4 py-2 ${
          isCurrentUser ? 'bg-secondary' : 'bg-primary-light'
        }`}
      >
        <p
          className={`flex w-fit max-w-[10rem] flex-col break-words text-body-1 md:max-w-xs md:text-h2-light ${
            isCurrentUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.message}
          {time && <small className="text-xs italic">{time}</small>}
        </p>
      </div>
    </li>
  );
}
