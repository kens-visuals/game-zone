// Hooks
import useUser from '../hooks/useUser';

// Interface
import { MessageType } from '../lib/types/index';

interface Props {
  message: MessageType;
}

export default function Message({ message }: Props) {
  const { currentUser } = useUser();

  const isCurrentUser = message.uid === currentUser?.uid;

  return (
    <li className={`flex ${isCurrentUser && 'flex-row-reverse'} `}>
      <div
        className={`w-fit rounded-md from-secondary to-secondary/20 px-4 py-2 ${
          isCurrentUser ? 'bg-gradient-to-r' : 'bg-gradient-to-l'
        }`}
      >
        <p
          className={`w-fit max-w-[10rem] break-words text-body-1 md:max-w-xs md:text-h2-light ${
            isCurrentUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.message}
        </p>
      </div>
    </li>
  );
}
