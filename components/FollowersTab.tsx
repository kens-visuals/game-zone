import Link from 'next/link';
import Image from 'next/image';
import { Tab } from '@headlessui/react';

// Components
import FollowButton from './FollowButton';

// Hooks
import useFollow from '../hooks/useFollow';

// Helpers
import { formatName } from '../lib/helpers';

// Interfaces
import { UserInterface } from '../hooks/useUser';

interface Props {
  user: UserInterface;
  currentUser: UserInterface;
  isOwner: boolean;
}

export default function FollowersTab({ user, currentUser, isOwner }: Props) {
  const { followList } = useFollow();

  const followersArr = [...(followList('followers', user?.uid) || [])];
  const followingArr = [...(followList('following', user?.uid) || [])];

  const followersList = [followersArr, followingArr];

  return (
    <Tab.Group>
      <Tab.List className="flex gap-2 rounded-xl bg-primary-dark p-1">
        {[
          { name: 'Followers', count: followersArr.length },
          { name: 'Following', count: followingArr.length },
        ].map((follower) => (
          <Tab
            key={follower.name}
            className={({ selected }) =>
              `flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-outfit text-sm leading-5 text-white transition-all duration-300 focus:outline-none focus:ring focus:ring-primary-light focus:ring-opacity-60 md:p-4 md:text-h3
            ${
              selected
                ? 'bg-primary shadow'
                : 'text-white/70 hover:bg-white/[0.12] hover:text-white'
            }`
            }
          >
            <span>{follower.name}:</span>
            <span>{follower.count}</span>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">
        {followersList.map((users, idx) => (
          <Tab.Panel
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            className="rounded-lg bg-primary-dark p-2 focus:outline-none focus:ring focus:ring-primary-light focus:ring-opacity-60"
          >
            {users.length ? (
              <ul className="flex flex-col gap-2">
                {users.map((usr) => (
                  <li
                    key={usr.uid}
                    className="flex flex-col gap-2 rounded-md bg-primary p-2 text-white md:flex-row"
                  >
                    <div className="flex items-center gap-4">
                      {usr.photoURL && (
                        <Image
                          width={50}
                          height={50}
                          unoptimized
                          src={usr.photoURL}
                          alt={usr.displayName}
                          className="h-10 w-10 rounded-md object-cover md:h-14 md:w-14"
                        />
                      )}
                      <Link
                        href={`/user/${usr.uid}`}
                        className="rounded-md underline transition-all duration-200 hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-light md:text-h3"
                      >
                        {usr.displayName}
                      </Link>
                    </div>
                    {usr.uid !== currentUser?.uid && (
                      <div className="flex items-center gap-2 md:ml-auto">
                        <Link
                          href="/messages"
                          className="w-full rounded-md bg-primary-light py-2.5 px-4 text-center transition-all duration-300 hover:bg-primary-light/50"
                        >
                          Message
                        </Link>

                        <FollowButton user={usr} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex w-full items-center justify-center p-4">
                {isOwner ? (
                  <span className="text-center">
                    You don&apos;t follow anyone
                  </span>
                ) : (
                  <span className="text-center">
                    {formatName(user.displayName)} doesn&apos;t follow anyone
                  </span>
                )}
              </div>
            )}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
