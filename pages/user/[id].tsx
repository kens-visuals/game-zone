import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { Tab } from '@headlessui/react';
import { db } from '../../firebase/firebase.config';

// Compononents
import Divider from '../../components/Divider';
import FollowButton from '../../components/FollowButton';

// Hooks
import useUser, { UserInterface } from '../../hooks/useUser';
import useFollow from '../../hooks/useFollow';

interface Props {
  data: UserInterface;
}

export default function Collection({ data: user }: Props) {
  const { currentUser } = useUser();
  const { followList } = useFollow();

  const categories = {
    Followers: [...(followList('followers', user?.uid) || [])],
    Following: [...(followList('following', user?.uid) || [])],
  };

  return (
    <div className="p-4">
      <h1 className="text-h1">User Profile</h1>
      <Divider />

      <div className="my-4 flex items-center gap-4">
        <Image
          src={user.photoURL}
          height={50}
          width={50}
          alt={user.displayName}
          className="rounded"
        />

        <div className="flex flex-col">
          <span>{user.displayName}</span>
          <span>{user.email}</span>
        </div>

        {user.uid !== currentUser?.uid && <FollowButton user={user} />}
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary-dark p-1">
          {['Followers', 'Following'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 font-outfit text-sm leading-5 text-white
                  transition-all duration-300 focus:outline-none focus:ring focus:ring-primary-light focus:ring-opacity-60
                  ${
                    selected
                      ? 'bg-primary shadow'
                      : 'text-white/70 hover:bg-white/[0.12] hover:text-white'
                  }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((users, idx) => (
            <Tab.Panel
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={`rounded-lg bg-primary-dark p-3
                  focus:outline-none focus:ring focus:ring-primary-light focus:ring-opacity-60`}
            >
              {users.length ? (
                <ul>
                  {users.map((usr) => (
                    <li
                      key={usr.uid}
                      className="flex items-center gap-2 rounded-md p-3 text-white hover:bg-primary-dark"
                    >
                      {usr.photoURL && (
                        <Image
                          width={50}
                          height={50}
                          src={usr.photoURL}
                          alt={usr.displayName}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      )}
                      <Link
                        href={`/user/${usr.uid}`}
                        className="rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                      >
                        {usr.displayName}
                      </Link>

                      <div className="ml-auto">
                        {usr.uid !== currentUser?.uid && (
                          <FollowButton user={usr} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <span>You don&apos;t follow anyone</span>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const docId = ctx?.query?.id;

  const usersRef = collection(db, `users`);
  const users: { uid?: string; createdAt: string; updatedAt: string }[] = [];

  const snapshot = await getDocs(usersRef);

  snapshot.forEach((d) =>
    users.push({
      ...d.data(),
      createdAt: d.data().createdAt.toJSON(),
      updatedAt: d.data().updatedAt.toJSON(),
    })
  );

  const data = users.filter((user) => user.uid === docId).at(0);

  return {
    props: {
      data,
    },
  };
};
