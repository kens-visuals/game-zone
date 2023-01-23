import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../firebase/firebase.config';

// Compononents
import Divider from '../../components/Divider';

// Hooks
import useUser, { UserInterface } from '../../hooks/useUser';
import useFollow from '../../hooks/useFollow';

interface Props {
  data: UserInterface;
}

export default function Collection({ data: user }: Props) {
  const router = useRouter();
  const { followList } = useFollow();
  const { user: currentUser } = useUser();
  const [selectMenu, setSelectMenu] = useState('followers');

  // console.log(selectMenu === 'followers');

  useEffect(() => {
    // router.push('/');
  }, [!currentUser]);

  return (
    <div className="p-4">
      <h1 className="text-h1">User Profile</h1>
      <Divider />

      <div className="flex items-center gap-4">
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
