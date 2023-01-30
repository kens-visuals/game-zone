import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageList({ children }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </ul>
  );
}
