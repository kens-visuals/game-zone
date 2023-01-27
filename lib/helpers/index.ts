export const formatDate = (date: string) => {
  const newDate = new Date(date);

  return newDate.toLocaleDateString('en-us', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });
};
