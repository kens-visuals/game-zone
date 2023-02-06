import React from 'react';
import useFollow from '../hooks/useFollow';

// Interfaces
import { UserInterface } from '../hooks/useUser';

interface Props {
  user: UserInterface;
}

export default function FollowButton({ user }: Props) {
  const { followList, manageFollow } = useFollow();

  return followList('following')
    ?.map((usr) => usr.uid)
    .includes(user.uid) ? (
    <button
      type="button"
      onClick={() => manageFollow('unfollow', user.uid, user)}
      className="w-full rounded-md bg-secondary py-2.5 px-4 transition-all duration-300 hover:opacity-70"
    >
      Unfollow
    </button>
  ) : (
    <button
      type="button"
      onClick={() => manageFollow('follow', user.uid, user)}
      className="w-full rounded-md bg-primary py-2.5 px-4 transition-all duration-300 hover:bg-primary-light"
    >
      Follow
    </button>
  );
}
