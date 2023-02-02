// import { useState } from 'react';
// import Image from 'next/image';

// Componentns
import Messanger from '../../components/Messanger';

// Hooks
// import useUser from '../../hooks/useUser';
// import useUsers from '../../hooks/useUsers';

export default function Messages() {
  //   const { users } = useUsers();
  //   const { currentUser } = useUser();

  //   const [sendTo, setSendTo] = useState('');

  //   const otherUsers = users?.filter((user) => user.uid === currentUser?.uid);

  return (
    <div>
      {/* <ul className="grid grid-flow-col justify-start overflow-x-scroll rounded-lg bg-primary-dark px-2 py-4">
        {otherUsers?.map((user) => (
          <li key={user.uid}>
            <button
              type="button"
              onClick={() => setSendTo(user.uid)}
              className="flex flex-col items-center justify-center gap-1"
            >
              <Image
                width={100}
                height={100}
                src={user.photoURL}
                alt={user.displayName}
                className="h-14 w-14 rounded-full md:h-auto md:w-full"
              />
              <span className="w-20 break-words text-center text-body-2">
                {user.displayName}
              </span>
            </button>
          </li>
        ))}
      </ul> */}

      <Messanger />
    </div>
  );
}
