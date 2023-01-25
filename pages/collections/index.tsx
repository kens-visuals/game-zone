import { FormEvent, useId, useState } from 'react';

// Components
import ErrorMsg from '../../components/ErrorMsg';
import LoadingMsg from '../../components/LoadingMsg';
import Divider from '../../components/Divider';
import CollectionItem from '../../components/CollectionItem';

// Hooks
import useCollections from '../../hooks/useCollections';

export default function AddNewCollection() {
  const initialState = {
    name: '',
    description: '',
    isPublic: true,
  };

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

  if (status === 'loading') return <LoadingMsg size={5} />;
  if (status === 'error') return <ErrorMsg />;

  return (
    <>
      <div className="p-4">
        <h1 className="mb-4 text-h1">Collections</h1>
        <form
          action="#"
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 "
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
            <span className="text-secondary">Please name your collection!</span>
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
            <div className="peer h-6 w-11 rounded-full border-gray-600 bg-gray-700 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-800" />

            <span className="ml-3 text-body-2 font-medium text-white">
              Make it public?
            </span>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 w-full rounded-md bg-secondary p-4 text-h3 text-white transition-colors duration-300 hover:bg-secondary/70"
          >
            Create new collection
          </button>
        </form>
      </div>

      <Divider />

      <div className="p-4">
        <h2 className="mt-4 text-h2-medium">Your collections</h2>
        {collections.length ? (
          <ul className="mt-4 flex flex-col gap-4 rounded-lg bg-primary-dark p-4 text-primary-light">
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
            <span>You have not created any collections yet</span>
          </div>
        )}
      </div>
    </>
  );
}
