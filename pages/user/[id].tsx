import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../firebase/firebase.config';

// Compononents
import Divider from '../../components/Divider';
import PageHeading from '../../components/PageHeading';
import FollowButton from '../../components/FollowButton';
import CollectionItem from '../../components/CollectionItem';

// Hooks
import useUserBookmarks from '../../hooks/useUserBookmarks';
import useUser, { UserInterface } from '../../hooks/useUser';
import useCollections, { CollectionInfo } from '../../hooks/useCollections';
import useBookmarkMutation from '../../hooks/useBookmarkMutation';

// Helpers
import { formatName } from '../../lib/helpers';

// Assets
import placeholderImg from '../../public/assets/placeholder.avif';
import FollowersTab from '../../components/FollowersTab';

interface Props {
  data: UserInterface;
}

export default function User({ data: user }: Props) {
  const { currentUser } = useUser();
  const { removeBookmark } = useBookmarkMutation();

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
  }, [user?.uid, bookmarksData]);

  return (
    <>
      <Head>
        <title>Tags | {user?.displayName}</title>
        <meta
          name="description"
          content={`Profile page of ${user?.displayName}`}
        />
      </Head>

      <div className="pb-8">
        <PageHeading heading="Profile" />
        <Divider />

        <div className="my-4 flex flex-col items-start gap-4 rounded-md bg-primary-dark p-4">
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
              <span className="text-body-2 text-primary-light lg:text-body-1">
                {user.email}
              </span>
            </div>
          </div>

          {user.uid !== currentUser?.uid && (
            <div className="flex w-full items-center justify-center gap-2">
              <Link
                href="/messages"
                className="w-full rounded-md bg-primary-light py-2.5 px-4 text-center transition-all duration-300 hover:bg-primary-light/50"
              >
                Message
              </Link>

              <FollowButton user={user} />
            </div>
          )}
        </div>

        {currentUser && (
          <FollowersTab
            user={user}
            isOwner={isOwner}
            currentUser={currentUser}
          />
        )}

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
                <li className="flex flex-col items-center justify-center gap-4 rounded-md bg-primary-dark p-4 py-6 text-primary-light">
                  {isOwner ? (
                    <>
                      <span className="inline-block w-full text-center">
                        You haven&apos;t bookmarked games
                      </span>
                      <Link
                        href="/"
                        className="rounded-md bg-secondary py-2 px-4 text-white transition-all duration-300 hover:bg-secondary/70"
                      >
                        Go to games
                      </Link>
                    </>
                  ) : (
                    <span className="inline-block w-full text-center">
                      {formatName(user?.displayName)} hasn&apos;t bookmarked
                      games
                    </span>
                  )}
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

                      <div className="absolute bottom-0 w-full py-2 px-3 backdrop-blur-md backdrop-filter">
                        <div className="flex items-center justify-between gap-6">
                          <Link
                            href={`/game/${bookmark.slug}`}
                            className="truncate text-ellipsis border-b border-b-transparent text-body-1 font-medium transition-all duration-100 hover:border-b hover:border-b-secondary"
                          >
                            {bookmark.name}
                          </Link>

                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => removeBookmark(bookmark.id!)}
                              className="group flex w-fit items-center justify-center gap-2"
                            >
                              Remove
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-4 w-4 fill-white group-hover:fill-none"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
              {currentBookmark.length > 7 && (
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

              {currentCollection?.length ? (
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
                <div className="mt-4 flex flex-col items-center justify-start gap-4 rounded-lg bg-primary-dark p-4 text-primary-light">
                  {isOwner ? (
                    <>
                      <span className="inline-block w-full text-center">
                        You don&apos;t have any collections
                      </span>
                      <Link
                        href="/collections"
                        className="rounded-md bg-secondary py-2 px-4 text-white transition-all duration-300 hover:bg-secondary/70"
                      >
                        Go to collections
                      </Link>
                    </>
                  ) : (
                    <span className="inline-block w-full text-center">
                      {formatName(user?.displayName)} hasn&apos;t created
                      collections yet
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
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
