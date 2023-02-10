import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { db } from '../firebase/firebase.config';

// Hooks
import useUser from './useUser';

// Types
import { GameInterface } from '../lib/types/index';
import { orderByDescQuery } from '../lib/helpers';

export interface CollectionInfo {
  id?: string;
  name: string;
  slug?: string;
  createdBy: string;
  createdAt?: string;
  isPublic?: boolean;
  description?: string;
  games?: GameInterface[] | undefined;
}

export default function useCollections() {
  const { currentUser } = useUser();

  const userCollectionsRef = collection(
    db,
    `users/${currentUser?.uid}/collections`
  );
  const userCollectionsQuery = orderByDescQuery(userCollectionsRef);
  const privateCollectionsQuery = query(
    userCollectionsRef,
    where('isPublic', '==', false),
    orderBy('createdAt', 'desc')
  );

  const { status, data } = useFirestoreCollectionData(userCollectionsQuery, {
    idField: 'id',
  });
  const { status: privateCollectionsStatus, data: privateCollectionsData } =
    useFirestoreCollectionData(privateCollectionsQuery, {
      idField: 'id',
    });
  const collections = data as CollectionInfo[];
  const privateCollections = privateCollectionsData as CollectionInfo[];

  const getCurrentUserCollections = (
    userId: string,
    callback: (d: any) => void
  ) => {
    const userCollRef = collection(db, `users/${userId}/collections`);
    const userCollQuery = query(userCollRef, orderBy('createdAt', 'desc'));

    return onSnapshot(userCollQuery, callback);
  };

  const addNewDataMutation = useFirestoreCollectionMutation(userCollectionsRef);
  const addNewCollection = (collectionInfo: CollectionInfo) => {
    const createdAt = serverTimestamp();
    const createdBy = currentUser?.displayName;
    const slug = collectionInfo.name
      .toLowerCase()
      .replace(/[^\w ]+/g, ' ')
      .replace(/ +/g, '-');

    addNewDataMutation.mutate({
      ...collectionInfo,
      createdAt,
      createdBy,
      slug,
    });
  };

  const removeCollection = async (docId: string) => {
    try {
      const collectionRef = doc(userCollectionsRef, docId);
      await deleteDoc(collectionRef);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const manageCollection = async (
    type: 'add' | 'remove',
    docId: string,
    collectionData: GameInterface
  ): Promise<void> => {
    const batch = writeBatch(db);

    const userDocRef = doc(userCollectionsRef, docId);

    if (type === 'add') {
      batch.update(userDocRef, {
        games: arrayUnion(collectionData),
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.update(userDocRef, {
        games: arrayRemove(collectionData),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
  };

  return {
    status,
    collections,
    privateCollectionsStatus,
    privateCollections,
    removeCollection,
    addNewCollection,
    manageCollection,
    getCurrentUserCollections,
  };
}
