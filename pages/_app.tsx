import { useState } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { FirebaseAppProvider, FirestoreProvider } from 'reactfire';
import { db, firebaseConfig } from '../firebase/firebase.config';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirestoreProvider sdk={db}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </Hydrate>
        </QueryClientProvider>
      </FirestoreProvider>
    </FirebaseAppProvider>
  );
}
