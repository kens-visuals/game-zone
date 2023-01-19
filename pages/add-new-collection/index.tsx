import { FormEvent, useState } from 'react';

// Components
import ErrorMsg from '../../components/ErrorMsg';
import LoadingMsg from '../../components/LoadingMsg';

// Hooks
import useCollections from '../../hooks/useCollections';

export default function AddNewCollection() {
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
  };

  if (status === 'loading') return <LoadingMsg size={5} />;
  if (status === 'error') return <ErrorMsg />;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-h1">Collections</h1>
      <form action="#" onSubmit={handleSubmit}>
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
          className="w-full border-b bg-transparent py-1 text-white placeholder:opacity-50 focus:border-b-primary-light focus-visible:outline-none"
        />
        <textarea
          cols={30}
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
          className="mt-4 w-full border-b bg-transparent py-1 text-white placeholder:opacity-50 focus:border-b-primary-light focus-visible:outline-none"
        />
        {/* {!collectionName && <span>Please name your collection!</span>} */}
        <input
          type="checkbox"
          name="isPublic"
          checked={collectionInfo.isPublic}
          onChange={() =>
            setCollectionInfo((prevState) => ({
              ...prevState,
              isPublic: !prevState.isPublic,
            }))
          }
        />
        <button type="button" onClick={handleSubmit}>
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
