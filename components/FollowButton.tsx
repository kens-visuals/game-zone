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
      className="text-secondary"
    >
      Unfollow
    </button>
  ) : (
    <button
      type="button"
      onClick={() => manageFollow('follow', user.uid, user)}
      className="text-white/80"
    >
      Follow
    </button>
  );
}
