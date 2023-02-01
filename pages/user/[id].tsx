import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { Tab } from '@headlessui/react';
import { db } from '../../firebase/firebase.config';

// Compononents
import Divider from '../../components/Divider';
import PageHeading from '../../components/PageHeading';
import FollowButton from '../../components/FollowButton';
import CollectionItem from '../../components/CollectionItem';

// Hooks
import useFollow from '../../hooks/useFollow';
import useUserBookmarks from '../../hooks/useUserBookmarks';
import useUser, { UserInterface } from '../../hooks/useUser';
import useCollections, { CollectionInfo } from '../../hooks/useCollections';

// Assets
import placeholderImg from '../../public/assets/placeholder.avif';

interface Props {
  data: UserInterface;
}

export default function User({ data: user }: Props) {
  const { currentUser } = useUser();
  const { followList } = useFollow();
  const {
    status: bookmarkStatus,
    bookmarksData,
    getCurrentUserBookmarks,
  } = useUserBookmarks();
  const {
    status: collectionStatus,
    collections,
    removeCollection,
    getCurrentUserCollections,
  } = useCollections();

  const [isOwner, setIsOwner] = useState(true);
  const [currentCollection, setCurrentCollection] = useState(collections);
  const [currentBookmark, setCurrentBookmark] = useState(bookmarksData);

  useEffect(() => {
    const callback = (d: any) => {
      // If it's not the current user then only get the public collections
      // Otherwise the all collections
      if (currentUser?.uid !== user?.uid) {
        setCurrentCollection(
          d.docs
            .map((doc: any) => ({ ...doc.data(), id: doc.id }))
            .filter((coll: CollectionInfo) => coll.isPublic)
        );
        setIsOwner(false);
      } else {
        setCurrentCollection(
          d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
        );
        setIsOwner(true);
      }
    };

    const unsub = getCurrentUserCollections(user?.uid, callback);

    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    const callback = (d: any) =>
      setCurrentBookmark(
        d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );

    const unsub = getCurrentUserBookmarks(user?.uid, callback);

    return () => unsub();
  }, [user?.uid]);

  const followersArr = [...(followList('followers', user?.uid) || [])];
  const followingArr = [...(followList('following', user?.uid) || [])];

  const followersList = [followersArr, followingArr];

  return (
    <div>
      <PageHeading heading="Profile" />
      <Divider />

      <div className="my-4 flex flex-col  items-start gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={user.photoURL}
            height={50}
            width={50}
            alt={user.displayName}
            className="rounded"
          />
          <div className="flex flex-col md:text-h3">
            <span>{user.displayName}</span>
            <span>{user.email}</span>
          </div>
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
                          className="h-10 w-10 rounded-md object-cover md:h-14 md:w-14"
                        />
                      )}
                      <Link
                        href={`/user/${usr.uid}`}
                        className="rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light md:text-h3"
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
                <span className="inline-block w-full p-4 text-center">
                  You don&apos;t follow anyone
                </span>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {bookmarkStatus === 'loading' ? (
        <span>Loading bookmars...</span>
      ) : (
        <div className="my-8 w-full">
          <h2 className="my-4 text-h3 md:text-h1">Recent Bookmarks</h2>

          <ul
            className={`grid snap-x snap-proximity scroll-px-4 grid-flow-col items-center gap-4 overflow-x-scroll rounded-lg bg-primary-dark p-4 ${
              currentBookmark.length <= 4 && 'justify-start'
            }`}
          >
            {!currentBookmark.length ? (
              <li className="flex flex-col items-center justify-center gap-4 rounded-md bg-primary-dark p-4 py-6">
                <span className="inline-block w-full text-center">
                  You don&apos;t have any bookmarked games
                </span>
                <Link href="/" className="rounded-md bg-secondary py-2 px-4 ">
                  Go to games
                </Link>
              </li>
            ) : (
              currentBookmark?.slice(0, 7).map((bookmark) => (
                <li className="w-full snap-start" key={bookmark.createdAt}>
                  <div className="relative h-full w-72 max-w-xl overflow-hidden rounded-lg">
                    <Image
                      src={bookmark.background_image || placeholderImg}
                      alt={bookmark.name}
                      width={200}
                      height={200}
                      className="h-48 w-full object-cover object-top"
                    />

                    <div className="absolute bottom-0 w-full py-4 px-3 backdrop-blur-md backdrop-filter">
                      <div className="flex items-center justify-between gap-6">
                        <Link
                          href={`/game/${bookmark.slug}`}
                          className="truncate text-ellipsis border-b border-b-transparent text-body-1 font-medium transition-all duration-100 hover:border-b hover:border-b-secondary"
                        >
                          {bookmark.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
            {currentBookmark.length > 4 && (
              <li className="h-full">
                <Link
                  href="/bookmarks"
                  className="flex h-full items-center rounded-md bg-primary-light px-6 py-2 text-center text-white transition-colors duration-300 hover:bg-primary-light/50"
                >
                  View More
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <div>
        {collectionStatus === 'loading' ? (
          <span>Loading collections...</span>
        ) : (
          <>
            <h2 className="my-4 text-h3 md:text-h1">Collections</h2>

            {collections?.length ? (
              <ul className="mt-4 grid gap-4 rounded-lg bg-primary-dark p-4 text-primary-light md:grid-cols-2 lg:grid-cols-4">
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
