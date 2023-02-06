import { orderBy, query, Query } from 'firebase/firestore';

export const formatDate = (date: string) => {
  const newDate = new Date(date);

  return newDate.toLocaleDateString('en-us', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });
};

export const orderByDescQuery = (collRef: Query) =>
  query(collRef, orderBy('createdAt', 'desc'));

export const formatName = (name: string) => name.replace(/\s\w*/gi, '');
