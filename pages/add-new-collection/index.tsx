import { FormEvent, useId, useState } from 'react';

// Components
import ErrorMsg from '../../components/ErrorMsg';
import LoadingMsg from '../../components/LoadingMsg';

// Hooks
import useCollections from '../../hooks/useCollections';

export default function AddNewCollection() {
  const isPublicId = useId();
  const { addNewCollection, removeCollection, collections, status } =
    useCollections();

  const [collectionInfo, setCollectionInfo] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (collectionInfo.name) addNewCollection({ ...collectionInfo });

    setCollectionInfo({ name: '', description: '', isPublic: true });
  };

  if (status === 'loading') return <LoadingMsg size={5} />;
  if (status === 'error') return <ErrorMsg />;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-h1">Collections</h1>
      <form action="#" onSubmit={handleSubmit} className="flex flex-col gap-2 ">
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
          className="w-full border-b bg-transparent bg-primary-dark py-1 text-white placeholder:opacity-50 focus:border-b-primary-light focus-visible:outline-none"
        />
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
          placeholder="This collection is..."
          className="w-full border-b bg-transparent py-1 text-white placeholder:opacity-50 focus:border-b-primary-light focus-visible:outline-none"
        />
        {/* {!collectionName && <span>Please name your collection!</span>} */}

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
          className="mt-4 w-full rounded-md bg-primary-dark p-4 text-h3 text-white"
        >
          Create new collection
        </button>
      </form>

      {collections && (
        <ul>
          {collections?.map((collection) => (
            <li key={collection.id}>
              {collection.name}
              <button
                type="button"
                onClick={() => removeCollection(collection.id!)}
                className="ml-4"
              >
                Remove Col
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
