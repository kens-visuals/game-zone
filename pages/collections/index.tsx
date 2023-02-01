import { FormEvent, useId, useState } from 'react';

// Components
import Divider from '../../components/Divider';
import ErrorCard from '../../components/ErrorCard';
import LoadingCard from '../../components/LoadingCard';
import PageHeading from '../../components/PageHeading';
import useCollections from '../../hooks/useCollections';
import SignInButton from '../../components/SignInButton';
import CollectionItem from '../../components/CollectionItem';

// Hooks
import useUser from '../../hooks/useUser';

export default function AddNewCollection() {
  const initialState = {
    name: '',
    description: '',
    isPublic: true,
    createdBy: '',
  };
  const { currentUser, isUserLoading } = useUser();
  const isPublicId = useId();
  const { addNewCollection, removeCollection, collections, status } =
    useCollections();

  const [collectionInfo, setCollectionInfo] = useState(initialState);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (collectionInfo.name) {
      addNewCollection({ ...collectionInfo });
      setIsError(false);
    }

    setCollectionInfo(initialState);
    setIsError(true);
  };

  if (status === 'loading') return <LoadingCard size={5} />;
  if (status === 'error') return <ErrorCard />;

  return (
    <>
      <div className="mb-8">
        <PageHeading heading="Collections" />
        {currentUser && (
          <form
            action="#"
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <input
              required
              type="text"
              value={collectionInfo.name}
              onChange={(e) =>
                setCollectionInfo((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
              placeholder="Collection name, i.g. Fav Games"
              className="w-full rounded-lg border-b border-b-transparent bg-transparent bg-primary-dark p-4 text-white placeholder:opacity-50 focus:border-b-white focus-visible:outline-none"
            />
            {isError && (
              <span className="text-secondary">
                Please name your collection!
              </span>
            )}
            <textarea
              cols={10}
              rows={10}
              value={collectionInfo.description}
              onChange={(e) =>
                setCollectionInfo((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }))
              }
              name="collections_description"
              placeholder="Description: This collection is..."
              className="h-28 w-full rounded-lg border-b border-b-transparent bg-transparent bg-primary-dark p-4 text-white placeholder:opacity-50 focus:border-b-white focus-visible:outline-none"
            />

            {currentUser && (
              <label
                htmlFor={`${isPublicId}-public-id`}
                className="relative mt-2 inline-flex cursor-pointer items-center"
              >
                <input
                  id={`${isPublicId}-public-id`}
                  type="checkbox"
                  name="isPublic"
                  className="peer sr-only"
                  checked={collectionInfo.isPublic}
                  onChange={() =>
                    setCollectionInfo((prevState) => ({
                      ...prevState,
                      isPublic: !prevState.isPublic,
                    }))
                  }
                />
                <div className="peer h-6 w-11 rounded-full border-gray-600 bg-primary-light after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-800" />

                <span className="ml-3 text-body-2 font-medium text-white">
                  Make it public?
                </span>
              </label>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full rounded-md bg-secondary p-4 text-h3 text-white transition-colors duration-300 hover:bg-secondary/70 "
            >
              Create new collection
            </button>
          </form>
        )}
      </div>

      <Divider />

      <div>
        <h2 className="mt-8 text-h2-medium">Your Collections</h2>
        {collections.length ? (
          <ul className="mt-4 grid gap-4 rounded-lg bg-primary-dark p-4 text-primary-light md:grid-flow-col md:grid-cols-2 lg:grid-cols-4">
            {collections?.map((collection) => (
              <li key={collection.id} className="rounded-lg bg-primary p-4">
                <CollectionItem
                  isOwner
                  collection={collection}
                  removeCollection={removeCollection}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-start rounded-lg bg-primary-dark p-4 text-primary-light">
            <span>
              {!currentUser ? (
                <div className="flex flex-col items-center justify-center">
                  <span className="mb-2 inline-block">
                    Sign In to create collections
                  </span>
                  <SignInButton isUserLoading={isUserLoading} />
                </div>
              ) : (
                'You have not created any collections yet'
              )}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
