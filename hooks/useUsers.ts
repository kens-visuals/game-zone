import { collection } from 'firebase/firestore';

import { useFirestore, useFirestoreCollectionData } from 'reactfire';

export default function useUserBookmarks() {
  const firestore = useFirestore();
  const usersCollection = collection(firestore, `users`);

  const { status, data } = useFirestoreCollectionData(usersCollection);

  return { status, data };
}
