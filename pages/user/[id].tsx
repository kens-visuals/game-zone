import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { Tab } from '@headlessui/react';
import { db } from '../../firebase/firebase.config';

// Compononents
import Divider from '../../components/Divider';
import FollowButton from '../../components/FollowButton';
import CollectionItem from '../../components/CollectionItem';

// Hooks
import useUser, { UserInterface } from '../../hooks/useUser';
import useFollow from '../../hooks/useFollow';
import useCollections, { CollectionInfo } from '../../hooks/useCollections';

interface Props {
  data: UserInterface;
}

export default function User({ data: user }: Props) {
  const { currentUser } = useUser();
  const { followList } = useFollow();
  const { collections, status, removeCollection, getUserPublicCollections } =
    useCollections();

  const [isOwner, setIsOwner] = useState(true);
  const [currentCollection, setCurrentCollection] = useState(collections);

  useEffect(() => {
    const callback = (d: any) => {
      if (currentUser?.uid !== user?.uid) {
        setCurrentCollection(
          d.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .filter((coll: CollectionInfo) => coll.isPublic)
        );
        setIsOwner(false);
      } else {
        setCurrentCollection(
          d.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        setIsOwner(true);
      }
    };

    const unsub = getUserPublicCollections(user?.uid, callback);

    return () => unsub();
  }, [user?.uid]);

  const followersArr = [...(followList('followers', user?.uid) || [])];
  const followingArr = [...(followList('following', user?.uid) || [])];

  const followersList = [followersArr, followingArr];

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
          {[
            { name: 'Followers', count: followersArr.length },
            { name: 'Following', count: followingArr.length },
          ].map((follower) => (
            <Tab
              key={follower.name}
              className={({ selected }) =>
                `flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-outfit text-sm leading-5 text-white transition-all duration-300 focus:outline-none focus:ring focus:ring-primary-light focus:ring-opacity-60
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
                <ul>
                  {users.map((usr) => (
                    <li
                      key={usr.uid}
                      className="flex items-center gap-2 rounded-md p-2 text-white hover:bg-primary-dark"
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

      {/* <div>
        <h2>Recent Bookmarks</h2>

        <div className="grid w-full grid-flow-col content-start items-start gap-4 overflow-x-scroll">
          {!bookmarksData.length ? (
            <Link href="/">Go to games</Link>
          ) : (
            bookmarksData?.slice(0,3).map((bookmark) => (
              <div className="w-full" key={bookmark.createdAt}>
                <GameCard details={bookmark} isFromBookmark />
              </div>
            ))
          )}
        </div>
      </div> */}

      <div>
        {status === 'loading' ? (
          <span>Loading collections...</span>
        ) : (
          <>
            <h2>Collections</h2>
            {collections?.length ? (
              <ul className="mt-4 flex flex-col gap-4 rounded-lg bg-primary-dark p-4 text-primary-light">
                {currentCollection?.map((col) => (
                  <li key={col.id} className="rounded-lg bg-primary p-4">
                    <CollectionItem
                      isOwner={isOwner}
                      collection={col}
                      removeCollection={removeCollection}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-start rounded-lg bg-primary-dark p-4 text-primary-light">
                <span>You have not created any collections yet</span>
              </div>
            )}
          </>
        )}
      </div>
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
